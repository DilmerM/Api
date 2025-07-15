const express = require("express");
const mysql = require("mysql");
const router = express.Router();

var mysqlConnection = mysql.createConnection({
  host: "142.44.161.115",
  user: "25-1700P4PAC2E2",
  password: "25-1700P4PAC2E2#e67",
  database: "25-1700P4PAC2E2",
  multipleStatements: true,
});

router.post("/", (req, res) => {
  const {
    nombre_evento,
    descripcion,
    fecha_inicio,
    fecha_fin,
    id_ubicacion_evento,
    id_organizador_persona,
    presupuesto,
    estado,
    tipo_evento,
  } = req.body;

  const estadosValidos = ["Planificado", "En Curso", "Finalizado", "Cancelado"];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: "Estado inválido. Debe ser uno de: " + estadosValidos.join(", "),
    });
  }

  const sql = "CALL SP_InsertarEvento(?, ?, ?, ?, ?, ?, ?, ?, ?)";

  mysqlConnection.query(
    sql,
    [
      nombre_evento,
      descripcion,
      fecha_inicio,
      fecha_fin,
      id_ubicacion_evento,
      id_organizador_persona,
      presupuesto,
      estado,
      tipo_evento,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al insertar evento:", err);
        return res.status(500).json({ error: "Error al insertar el evento" });
      }

      const id_evento = results[0][0].id_evento;
      res.status(201).json({
        message: "Evento creado correctamente",
        id_evento,
      });
    }
  );
});
// PUT: Actualizar evento por ID
router.put("/:id", (req, res) => {
  const id_evento = req.params.id;
  const {
    nombre_evento,
    descripcion,
    fecha_inicio,
    fecha_fin,
    id_ubicacion_evento,
    id_organizador_persona,
    presupuesto,
    estado,
    tipo_evento,
  } = req.body;

  // Validar estado
  const estadosValidos = ["Planificado", "En Curso", "Finalizado", "Cancelado"];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: "Estado inválido. Debe ser uno de: " + estadosValidos.join(", "),
    });
  }

  // Verificar que el evento exista
  const verificarSQL = "SELECT id_evento FROM Eventos WHERE id_evento = ?";
  mysqlConnection.query(verificarSQL, [id_evento], (err, results) => {
    if (err) {
      console.error("Error al verificar el evento:", err);
      return res.status(500).json({ error: "Error al verificar el evento" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Ejecutar procedimiento de actualización
    const sql = "CALL SP_ActualizarEvento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    mysqlConnection.query(
      sql,
      [
        id_evento,
        nombre_evento,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_ubicacion_evento,
        id_organizador_persona,
        presupuesto,
        estado,
        tipo_evento,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar evento:", err);
          return res.status(500).json({ error: "Error al actualizar el evento" });
        }

        res.json({ message: "Evento actualizado correctamente" });
      }
    );
  });
});

// GET: Todos los eventos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Eventos";
  mysqlConnection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// DELETE: Eliminar un evento por ID
router.delete("/:id", (req, res) => {
  const id_evento = req.params.id;

  // Verificar que el evento exista antes de eliminar
  const verificarSQL = "SELECT id_evento FROM Eventos WHERE id_evento = ?";
  mysqlConnection.query(verificarSQL, [id_evento], (err, results) => {
    if (err) {
      console.error("Error al verificar el evento:", err);
      return res.status(500).json({ error: "Error al verificar el evento" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Ejecutar el procedimiento de eliminación
    const sql = "CALL SP_EliminarEvento(?)";
    mysqlConnection.query(sql, [id_evento], (err, results) => {
      if (err) {
        console.error("Error al eliminar el evento:", err);
        return res.status(500).json({ error: "Error al eliminar el evento" });
      }

      res.json({ mensaje: "Evento eliminado correctamente" });
    });
  });
});
// Manejador de error de conexión
mysqlConnection.on("error", (err) => {
  console.error("Error de conexión MySQL:", err.code);
});

module.exports = router;
