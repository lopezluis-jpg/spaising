// 📁 db.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

// Cargar .env solo en desarrollo local
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Tomar la URL desde Render o desde .env
const connectionString = process.env.DATABASE_URL;

// Validar que la variable exista
if (!connectionString) {
  console.error("❌ No se encontró DATABASE_URL. Verifica que esté configurada en Render o en tu archivo .env");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // ⚠️ Obligatorio en Render
});

// Verificar conexión y crear tabla si no existe
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado exitosamente a la base de datos PostgreSQL");

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    console.log("✅ Tabla 'tasks' lista");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar o crear tabla:", err.message);
  }
})();

export default pool;
