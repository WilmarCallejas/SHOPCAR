import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error("Faltan las claves JWT en el archivo .env");
}

export const JWT_ACCESS_SECRET = accessSecret;
export const JWT_REFRESH_SECRET = refreshSecret;

export const JWT_ACCESS_EXPIRES =
  process.env.JWT_ACCESS_EXPIRES || "15m";

export const JWT_REFRESH_DAYS = Number(
  process.env.JWT_REFRESH_DAYS || 7
);