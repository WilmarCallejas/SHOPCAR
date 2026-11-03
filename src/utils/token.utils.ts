import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";

import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_DAYS
} from "../config/jwt";

// Generar Access Token
export function generarAccessToken(usuario: {
  IDUsuario: number;
  IDRol: number;
  Correo: string;
}) {
  return jwt.sign(
    {
      idUsuario: usuario.IDUsuario,
      idRol: usuario.IDRol,
      correo: usuario.Correo
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"]
    }
  );
}

// Generar Refresh Token
export function generarRefreshToken() {
  return randomBytes(64).toString("hex");
}

// Calcular hash SHA-256
export function calcularHashToken(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

// Calcular expiración del Refresh Token
export function calcularFechaExpiracionRefresh(): Date {
  const fecha = new Date();

  fecha.setDate(fecha.getDate() + JWT_REFRESH_DAYS);

  return fecha;
}

// Verificar Access Token
export function verificarAccessToken(token: string) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

// Verificar Refresh Token JWT
export function verificarRefreshTokenJWT(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}