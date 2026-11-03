
import bcrypt from "bcrypt";

import {
  crearUsuario,
  obtenerUsuarioPorCorreo
} from "../repositories/auth.repository";

import {
  crearRefreshToken,
  rotarRefreshToken,
  detectarReutilizacionRefreshToken,
  cerrarSesionRefreshToken
} from "../repositories/refresh-token.repository";

import {
  generarAccessToken,
  generarRefreshToken,
  calcularHashToken,
  calcularFechaExpiracionRefresh
} from "../utils/token.utils";

// Errores controlados de autenticación
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// REGISTRO DE CLIENTES
export async function registrarCliente(datos: {
  nombre: string;
  correo: string;
  contrasena: string;
}) {
  const nombre = datos.nombre.trim();
  const correo = datos.correo.trim().toLowerCase();

  if (!nombre || !correo || !datos.contrasena) {
    throw new AuthError("Todos los campos son obligatorios.", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new AuthError("El correo electrónico no es válido.", 400);
  }

  if (datos.contrasena.length < 8) {
    throw new AuthError(
      "La contraseña debe tener al menos 8 caracteres.",
      400
    );
  }

  const hashContrasena = await bcrypt.hash(datos.contrasena, 12);

  return await crearUsuario({
    idRol: 1,
    nombre,
    correo,
    hashContrasena
  });
}

// INICIO DE SESIÓN
export async function iniciarSesion(
  correo: string,
  contrasena: string
) {
  const usuario = await obtenerUsuarioPorCorreo(
    correo.trim().toLowerCase()
  );

  if (!usuario) {
    throw new AuthError("Credenciales incorrectas.", 401);
  }

  if (!usuario.Activo) {
    throw new AuthError("La cuenta está desactivada.", 401);
  }

  const contrasenaValida = await bcrypt.compare(
    contrasena,
    usuario.HashContrasena
  );

  if (!contrasenaValida) {
    throw new AuthError("Credenciales incorrectas.", 401);
  }

  // Generar tokens
  const accessToken = generarAccessToken(usuario);
  const refreshToken = generarRefreshToken();

  // Calcular hash y expiración
  const hashToken = calcularHashToken(refreshToken);
  const fechaExpiracion = calcularFechaExpiracionRefresh();

  // Guardar únicamente el hash en SQL Server
  await crearRefreshToken({
    idUsuario: usuario.IDUsuario,
    hashToken,
    fechaExpiracion
  });

  // Nunca devolver el hash de la contraseña
  const {
    HashContrasena,
    ...datosUsuario
  } = usuario;

  return {
    usuario: datosUsuario,
    accessToken,
    refreshToken
  };
}

// RENOVACIÓN Y ROTACIÓN DE REFRESH TOKEN

export async function renovarSesion(refreshTokenActual: string) {
  if (!refreshTokenActual) {
    throw new AuthError("Refresh Token no proporcionado.", 400);
  }

  // Calcular el hash del Refresh Token recibido
  const hashTokenActual = calcularHashToken(refreshTokenActual);

  // Generar el nuevo Refresh Token
  const refreshTokenNuevo = generarRefreshToken();
  const hashTokenNuevo = calcularHashToken(refreshTokenNuevo);
  const fechaExpiracionNueva = calcularFechaExpiracionRefresh();

  let resultado;

  try {
    // Intentar rotar el Refresh Token en SQL Server
    resultado = await rotarRefreshToken({
      hashTokenActual,
      hashTokenNuevo,
      fechaExpiracionNueva
    });

  } catch (error) {
    const errorSQL = error as {
      number?: number;
      originalError?: {
        info?: {
          number?: number;
        };
      };
    };

    const numeroError =
      errorSQL.number ??
      errorSQL.originalError?.info?.number;

    // Solo investigar reutilización cuando SQL devuelve el error 50010
    if (numeroError === 50010) {
      try {
        const deteccion = await detectarReutilizacionRefreshToken(
          hashTokenActual
        );

        if (deteccion?.ReutilizacionDetectada === 1) {
          throw new AuthError(
            "Se detectó la reutilización de un Refresh Token. La sesión ha sido revocada.",
            401
          );
        }

        throw new AuthError(
          "Refresh Token inválido, expirado o revocado.",
          401
        );

      } catch (errorDeteccion) {
        if (errorDeteccion instanceof AuthError) {
          throw errorDeteccion;
        }

        console.error(
          "Error al verificar la reutilización del Refresh Token:",
          errorDeteccion
        );

        // Conservar el error original de la rotación
        throw error;
      }
    }

    // No ocultar otros errores de SQL o conexión
    throw error;
  }

  if (!resultado) {
    throw new Error("No fue posible renovar la sesión.");
  }

  // Generar el Access Token con los datos devueltos por SQL Server
  const accessToken = generarAccessToken({
    IDUsuario: resultado.IDUsuario,
    IDRol: resultado.IDRol,
    Correo: resultado.Correo
  });

  return {
    accessToken,
    refreshToken: refreshTokenNuevo
  };
}

export async function cerrarSesion(refreshToken: string) {
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new AuthError("Refresh Token no proporcionado.", 400);
  }

  const hashToken = calcularHashToken(refreshToken);

  const resultado = await cerrarSesionRefreshToken(hashToken);

  if (!resultado || resultado.SesionCerrada !== 1) {
    throw new AuthError(
      "El Refresh Token es inválido, expiró o ya fue revocado.",
      401
    );
  }

  return {
    mensaje: "Sesión cerrada correctamente."
  };
}