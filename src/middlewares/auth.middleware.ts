import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/jwt";

export interface AuthRequest extends Request {
  usuario?: {
    idUsuario: number;
    idRol: number;
    correo: string;
  };
}

export function autenticar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Token de acceso no proporcionado."
      });
    }

    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, JWT_ACCESS_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.idUsuario !== "number" ||
      typeof payload.idRol !== "number" ||
      typeof payload.correo !== "string"
    ) {
      return res.status(401).json({
        mensaje: "Token de acceso inválido."
      });
    }

    req.usuario = {
      idUsuario: payload.idUsuario,
      idRol: payload.idRol,
      correo: payload.correo
    };

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado."
    });
  }
}