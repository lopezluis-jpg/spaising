// ============================
// 📁 index.js — Servidor principal
// ============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js"; // Asegúrate de tener este archivo creado correctamente

// Cargar variables del archivo .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Ruta principal (para probar que el servidor funciona)
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente desde Render");
});

// ✅ Crear tarea
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error al crear tarea:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Listar todas las tareas
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al listar tareas:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Actualizar tarea
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
      [title, completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error al actualizar tarea:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Eliminar tarea
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "🗑️ Tarea eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar tarea:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// 🟢 Iniciar el servidor
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
