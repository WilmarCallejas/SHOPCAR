import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

// Ruta de comprobación
app.get("/", (_req, res) => {
  res.status(200).json({
    mensaje: "API SHOPCAR funcionando correctamente."
  });
});

export default app;