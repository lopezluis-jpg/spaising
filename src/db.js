import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Cargar .env solo si estamos en local
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;

// Validar que la variable exista
if (!connectionString) {
  console.error("❌ No se encontró DATABASE_URL. Verifica que esté configurada en Render o en tu .env");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // requerido en Render
  },
});

// Verificar conexión antes de crear la tabla
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado exitosamente a la base de datos");

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
    console.error("🔍 DATABASE_URL actual:", process.env.DATABASE_URL);
  }
})();

export default pool;
