// index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
// Ruta Raíz 
app.get("'/", (req, res) => { 
     res.send("br br patapim");
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // En producción con Render a veces necesitas SSL: ver sección Troubleshooting
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Ruta de prueba que verifica conexión con la BD
app.get('/db-now', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error conectando a la base de datos', detail: err.message });
  }
});

// Ejemplo CRUD simple (tabla users)
app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
  res.json(rows);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  res.status(201).json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));
