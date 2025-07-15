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

// GET: Todas las actividades
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Actividades";
  mysqlConnection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET: Obtener una actividad por ID
router.get("/:id", (req, res) => {
  const id_actividad = req.params.id;
  const sql = "CALL SP_SeleccionarActividadPorID(?)";

  mysqlConnection.query(sql, [id_actividad], (err, results) => {
    if (err) {
      console.error("Error al obtener actividad:", err);
      return res.status(500).json({ error: "Error al obtener la actividad" });
    }

    const actividad = results[0][0];
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json(actividad);
  });
});
// GET: Obtener una actividad
router.get("/detalle/:id", (req, res) => {
  const id_actividad = req.params.id;
  const sql = "CALL SP_SeleccionarActividadDetallePorID(?)";

  mysqlConnection.query(sql, [id_actividad], (err, results) => {
    if (err) {
      console.error("Error al obtener detalle de actividad:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener el detalle de la actividad" });
    }

    const detalle = results[0][0];
    if (!detalle) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json(detalle);
  });
});
// post:  
router.post("/", (req, res) => {
  const {
    id_evento,
    nombre_actividad,
    descripcion,
    fecha_hora_inicio,
    fecha_hora_fin,
    id_ubicacion_actividad,
    id_responsable_persona,
  } = req.body;

  const sql = "CALL SP_InsertarActividad(?, ?, ?, ?, ?, ?, ?)";

  mysqlConnection.query(
    sql,
    [
      id_evento,
      nombre_actividad,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      id_ubicacion_actividad,
      id_responsable_persona,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al insertar actividad:", err);
        return res
          .status(500)
          .json({ error: "Error al insertar la actividad" });
      }

      const id_actividad = results[0][0].id_actividad;
      res.status(201).json({
        message: "Actividad creada correctamente",
        id_actividad,
      });
    }
  );
});

router.put("/:id", (req, res) => {
  const id_actividad = req.params.id;
  const {
    nombre_actividad,
    descripcion,
    fecha_hora_inicio,
    fecha_hora_fin,
    id_ubicacion_actividad,
    id_responsable_persona,
  } = req.body;

  const sql = "CALL SP_ActualizarActividad(?, ?, ?, ?, ?, ?, ?)";

  mysqlConnection.query(
    sql,
    [
      id_actividad,
      nombre_actividad,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      id_ubicacion_actividad,
      id_responsable_persona,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar actividad:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar la actividad" });
      }
      res.json({ message: "Actividad actualizada correctamente" });
    }
  );
});


// DELETE: Eliminar una actividad por ID
router.delete("/:id", (req, res) => {
  const id_actividad = req.params.id;

  // Verificar si la actividad existe
  const verificarSQL = "SELECT id_actividad FROM Actividades WHERE id_actividad = ?";
  mysqlConnection.query(verificarSQL, [id_actividad], (err, results) => {
    if (err) {
      console.error("Error al verificar la actividad:", err);
      return res.status(500).json({ error: "Error al verificar la actividad" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }

    // Ejecutar el procedimiento de eliminación
    const sql = "CALL SP_EliminarActividad(?)";
    mysqlConnection.query(sql, [id_actividad], (err, results) => {
      if (err) {
        console.error("Error al eliminar la actividad:", err);
        return res.status(500).json({ error: "Error al eliminar la actividad" });
      }

      res.json({ mensaje: "Actividad eliminada correctamente" });
    });
  });
});
module.exports = router;
