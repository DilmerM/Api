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
    const { id_evento, id_persona, estado_asistencia } = req.body;
    const sql = 'CALL SP_RegistrarAsistencia(?, ?, ?, @p_id_registro)';

    mysqlConnection.query(sql, [id_evento, id_persona, estado_asistencia], (err, results) => {
        if (err) {
            console.error('Error al registrar asistencia:', err);
            return res.status(500).json({ error: 'Error al registrar la asistencia' });
        }

        const id_registro_asistencia = results[1][0].id_registro_asistencia;
        res.status(201).json({
            mensaje: 'Asistencia registrada correctamente',
            id_registro_asistencia
        });
    });
});

// PUT: Actualizar estado de asistencia
router.put('/:id', (req, res) => {
    const id_registro_asistencia = req.params.id;
    const { estado_asistencia } = req.body;
    const sql = 'CALL SP_ActualizarEstadoAsistencia(?, ?)';

    mysqlConnection.query(sql, [id_registro_asistencia, estado_asistencia], (err, results) => {
        if (err) {
            console.error('Error al actualizar asistencia:', err);
            return res.status(500).json({ error: 'Error al actualizar la asistencia' });
        }

        res.json({ mensaje: 'Estado de asistencia actualizado correctamente' });
    });
});

// Manejador de error de conexión
mysqlConnection.on('error', (err) => {
    console.error('Error de conexión MySQL:', err.code);
});

module.exports = router;