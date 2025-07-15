const express = require('express');
const mysql = require('mysql');
const router = express.Router();

var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});
//http://localhost:3000/asistencias
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Asistencia_actividad';
    mysqlConnection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener asistencias:', err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }
        res.json(results);
    });
});
// GET: Estadísticas de asistencia por evento
router.get('/evento/:id/asistencia', (req, res) => {
    const id_evento = req.params.id;
    const sql = 'CALL SP_ObtenerEstadisticasAsistenciaPorEvento(?)';

    mysqlConnection.query(sql, [id_evento], (err, results) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error al obtener estadísticas de asistencia' });
        }

        const estadisticas = results[0][0];
        if (!estadisticas) {
            return res.status(404).json({ mensaje: 'Evento no encontrado o sin registros' });
        }

        res.json(estadisticas);
    });
});

// POST: Registrar nueva asistencia
router.post('/', (req, res) => {
  const { id_persona, id_actividad, estado_asistencia } = req.body;

  const estadosValidos = ['Registrado', 'Asistió', 'No Asistió', 'Canceló'];
  if (!estadosValidos.includes(estado_asistencia)) {
    return res.status(400).json({
      error: 'Estado inválido. Debe ser uno de: ' + estadosValidos.join(', ')
    });
  }

  const sql = 'CALL SP_RegistrarAsistenciaActividad(?, ?, ?)';
  mysqlConnection.query(sql, [id_persona, id_actividad, estado_asistencia], (err, results) => {
    if (err) {
      console.error('Error al registrar asistencia:', err);
      return res.status(500).json({ error: 'Error al registrar la asistencia' });
    }

    res.status(201).json({ mensaje: 'Asistencia registrada o actualizada correctamente' });
  });
});
// PUT: Actualizar estado de asistencia
router.put('/:id', (req, res) => {
  const id_registro_asistencia = req.params.id;
  const { estado_asistencia } = req.body;

  const estadosValidos = ['Registrado', 'Asistió', 'No Asistió', 'Canceló'];

  // Validación de entrada
  if (!estado_asistencia) {
    return res.status(400).json({
      error: "El campo 'estado_asistencia' es obligatorio"
    });
  }

  if (!estadosValidos.includes(estado_asistencia)) {
    return res.status(400).json({
      error: "Estado inválido. Debe ser uno de: " + estadosValidos.join(', ')
    });
  }

  // Verificar que el registro exista
 const verificarSQL = 'SELECT id_asistencia_actividad FROM Asistencia_actividad WHERE id_asistencia_actividad = ?';
  mysqlConnection.query(verificarSQL, [id_registro_asistencia], (err, result) => {
    if (err) {
      console.error('Error al verificar asistencia:', err);
      return res.status(500).json({ error: 'Error al verificar el registro de asistencia' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }

    // Ejecutar el procedimiento
    const sql = 'CALL SP_ActualizarEstadoAsistencia(?, ?)';
    mysqlConnection.query(sql, [id_registro_asistencia, estado_asistencia], (err, results) => {
      if (err) {
        console.error('Error al actualizar asistencia:', err);
        return res.status(500).json({ error: 'Error al actualizar la asistencia' });
      }

      res.json({ mensaje: 'Estado de asistencia actualizado correctamente' });
    });
  });
});
// DELETE: Eliminar una asistencia por ID
router.delete('/:id', (req, res) => {
  const id_asistencia_actividad = req.params.id;

  // Verificar si el registro existe
  const verificarSQL = 'SELECT id_asistencia_actividad FROM Asistencia_actividad WHERE id_asistencia_actividad = ?';
  mysqlConnection.query(verificarSQL, [id_asistencia_actividad], (err, result) => {
    if (err) {
      console.error('Error al verificar asistencia:', err);
      return res.status(500).json({ error: 'Error al verificar el registro de asistencia' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }

    // Eliminar el registro
    const sql = 'DELETE FROM Asistencia_actividad WHERE id_asistencia_actividad = ?';
    mysqlConnection.query(sql, [id_asistencia_actividad], (err, results) => {
      if (err) {
        console.error('Error al eliminar asistencia:', err);
        return res.status(500).json({ error: 'Error al eliminar el registro de asistencia' });
      }

      res.json({ mensaje: 'Registro de asistencia eliminado correctamente' });
    });
  });
});
// Manejador de error de conexión
mysqlConnection.on('error', (err) => {
    console.error('Error de conexión MySQL:', err.code);
});

module.exports = router;