
import sql from "mssql/msnodesqlv8";

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "ShopCart",
  driver: "ODBC Driver 18 for SQL Server",
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

export async function conectarBD() {
  try {
    const pool = await sql.connect(config);

    console.log("Conexión exitosa con SQL Server");

    return pool;
  } catch (error) {
    console.error("Error al conectar con SQL Server:", error);
    throw error;
  }
}
