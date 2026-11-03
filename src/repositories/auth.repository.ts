
import sql from "mssql/msnodesqlv8";
import { conectarBD } from "../config/database";

interface CrearUsuarioDTO {
  idRol: number;
  nombre: string;
  correo: string;
  hashContrasena: string;
}

export async function crearUsuario(datos: CrearUsuarioDTO) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("IDRol", sql.TinyInt, datos.idRol)
    .input("Nombre", sql.NVarChar(150), datos.nombre)
    .input("Correo", sql.NVarChar(254), datos.correo)
    .input("HashContrasena", sql.NVarChar(255), datos.hashContrasena)
    .execute("Seguridad.SP_Usuarios_Crear");

  return resultado.recordset[0];
}

export async function obtenerUsuarioPorCorreo(correo: string) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("Correo", sql.NVarChar(254), correo)
    .execute("Seguridad.SP_Usuarios_ObtenerPorCorreo");

  return resultado.recordset[0] ?? null;
}

export async function obtenerUsuarioPorID(idUsuario: number) {
  const pool = await conectarBD();

  const resultado = await pool.request()
    .input("IDUsuario", sql.BigInt, idUsuario)
    .execute("Seguridad.SP_Usuarios_ObtenerPorID");

  return resultado.recordset[0] ?? null;
}