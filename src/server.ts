import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor SHOPCAR ejecutándose en el puerto ${PORT}`);
});