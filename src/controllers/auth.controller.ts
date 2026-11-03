
import { Request, Response } from "express";

import {
  registrarCliente,
  iniciarSesion,
  renovarSesion,
  cerrarSesion,
  AuthError
} from "../services/auth.service";

// REGISTRO DE CLIENTES
export async function registrar(
  req: Request,
  res: Response
) {
  try {
    const usuario = await registrarCliente(req.body);

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario
    });

  } catch (error) {

    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        mensaje: error.message
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      mensaje: "Error interno al registrar el usuario."
    });
  }
}

// INICIO DE SESIÓN
export async function login(
  req: Request,
  res: Response
) {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios."
      });
    }

    const resultado = await iniciarSesion(correo, contrasena);

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      ...resultado
    });

  } catch (error) {

    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        mensaje: error.message
      });
    }

    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión."
    });
  }
}

// RENOVACIÓN DE SESIÓN
export async function refresh(
  req: Request,
  res: Response
) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== "string") {
      return res.status(400).json({
        mensaje: "Refresh Token obligatorio."
      });
    }

    const resultado = await renovarSesion(refreshToken);

    return res.status(200).json({
      mensaje: "Sesión renovada correctamente.",
      ...resultado
    });

  } catch (error) {

    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        mensaje: error.message
      });
    }

    console.error("Error al renovar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al renovar la sesión."
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== "string") {
      return res.status(400).json({
        mensaje: "Refresh Token obligatorio."
      });
    }

    const resultado = await cerrarSesion(refreshToken);

    return res.status(200).json(resultado);

  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        mensaje: error.message
      });
    }

    console.error("Error al cerrar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al cerrar la sesión."
    });
  }
}
