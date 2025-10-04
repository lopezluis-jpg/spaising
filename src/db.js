import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Solo cargar dotenv si estamos en local
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requerido en Render
  },
});

// Crear tabla si no existe
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    console.log("✅ Tabla 'tasks' lista");
  } catch (err) {
    console.error("❌ Error creando tabla:", err.message);
  }
})();

export default pool;
