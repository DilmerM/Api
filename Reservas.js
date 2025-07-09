const mysql = require('mysql');
const express = require('express');
const router = express.Router();

var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});

// POST crear una nueva reserva
router.post('/', (req, res) => {
    const datos = req.body;
    const sql = 'CALL SP_InsertarReserva(?, ?, ?, ?, ?, ?, ?, ?, ?, @id_reserva); SELECT @id_reserva AS id_reserva;';
    mysqlConnection.query(
        sql,
        [
            datos.id_servicio,
            datos.id_persona_reserva,
            datos.id_ubicacion_reserva,
            datos.id_evento,
            datos.id_actividad,
            datos.fecha_hora_inicio,
            datos.fecha_hora_fin,
            datos.estado_reserva,
            datos.costo_total
        ],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Reserva creada', id_reserva: results[1][0].id_reserva });
        }
    );
});

// GET todas las reservas
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Reservas', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// GET una reserva por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('CALL SP_SeleccionarReservaDetallePorID(?)', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// PUT actualizar reserva por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const datos = req.body;
    mysqlConnection.query(
        'CALL SP_ActualizarReserva(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            id,
            datos.id_servicio,
            datos.id_persona_reserva,
            datos.id_ubicacion_reserva,
            datos.id_evento,
            datos.id_actividad,
            datos.fecha_hora_inicio,
            datos.fecha_hora_fin,
            datos.estado_reserva,
            datos.costo_total
        ],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Reserva actualizada correctamente' });
        }
    );
});

module.exports = router;