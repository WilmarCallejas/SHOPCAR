import sql from "mssql/msnodesqlv8";
import { conectarBD } from "../config/database";

interface CrearRefreshTokenDTO {
  idUsuario: number;
  hashToken: Buffer;
  fechaExpiracion: Date;
}

export async function crearRefreshToken(datos: CrearRefreshTokenDTO) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("IDUsuario", sql.BigInt, datos.idUsuario)
    .input("HashToken", sql.VarBinary(32), datos.hashToken)
    .input("FechaExpiracion", sql.DateTime2, datos.fechaExpiracion)
    .execute("Seguridad.SP_RefreshTokens_Crear");

  return resultado.recordset[0];
}

export async function obtenerRefreshTokenActivo(hashToken: Buffer) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("HashToken", sql.VarBinary(32), hashToken)
    .execute("Seguridad.SP_RefreshTokens_ObtenerActivo");

  return resultado.recordset[0] ?? null;
}

export async function revocarRefreshToken(
  idRefreshToken: number,
  idTokenReemplazo: number | null = null
) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("IDRefreshToken", sql.BigInt, idRefreshToken)
    .input("IDTokenReemplazo", sql.BigInt, idTokenReemplazo)
    .execute("Seguridad.SP_RefreshTokens_Revocar");

  return resultado.recordset[0]?.FilasAfectadas === 1;
}

interface RotarRefreshTokenDTO {
  hashTokenActual: Buffer;
  hashTokenNuevo: Buffer;
  fechaExpiracionNueva: Date;
}


interface RotarRefreshTokenDTO {
  hashTokenActual: Buffer;
  hashTokenNuevo: Buffer;
  fechaExpiracionNueva: Date;
}

export async function rotarRefreshToken(
  datos: RotarRefreshTokenDTO
) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input(
      "HashTokenActual",
      sql.VarBinary(32),
      datos.hashTokenActual
    )
    .input(
      "HashTokenNuevo",
      sql.VarBinary(32),
      datos.hashTokenNuevo
    )
    .input(
      "FechaExpiracionNueva",
      sql.DateTime2,
      datos.fechaExpiracionNueva
    )
    .execute("Seguridad.SP_RefreshTokens_Rotar");

  return resultado.recordset[0] ?? null;
}


export async function detectarReutilizacionRefreshToken(
  hashToken: Buffer
) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("HashToken", sql.VarBinary(32), hashToken)
    .execute("Seguridad.SP_RefreshTokens_DetectarReutilizacion");

  return resultado.recordset[0] ?? null;
}

export async function cerrarSesionRefreshToken(
  hashToken: Buffer
) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input(
      "HashToken",
      sql.VarBinary(32),
      hashToken
    )
    .execute("Seguridad.SP_RefreshTokens_CerrarSesion");

  return resultado.recordset[0] ?? null;
}