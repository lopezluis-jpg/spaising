
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ⚠️ Importante para Render (usa SSL)
  },
});

// Prueba la conexión apenas se inicie el servidor
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión exitosa a la base de datos PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  }
})();

export default pool;
