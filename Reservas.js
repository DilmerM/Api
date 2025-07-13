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

// GET todas las reservas http://localhost:3000/reservas        trae todas las reservas 
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Reservas', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// GET una reserva por ID   http://localhost:3000/reservas/26    trae la reserva de cliente por id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('CALL SP_SeleccionarReservaDetallePorID(?)', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// POST crear una nueva reserva  http://localhost:3000/reservas
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


// PUT actualizar reserva por ID http://localhost:3000/reservas/26  <-- reemplaza el (26) por id cualquiera
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

// Eliminar una reserva por ID desde la API       http://localhost:3000/reservas/26
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_EliminarReserva(?)";

    mysqlConnection.query(sql, [id], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Reserva eliminada correctamente" });
        } else {
            console.error("Error al eliminar la reserva:", err);
            res.status(500).send('Error al eliminar la reserva');
        }
    });
});

module.exports = router;