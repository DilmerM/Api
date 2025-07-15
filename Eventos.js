const express = require('express');
const app = express();
const PORT = 3000;
 const mysql = require('mysql');
const router = express.Router();

var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});

// POST: Insertar nuevo evento
router.post('/', (req, res) => {
    const {
        nombre_evento,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_ubicacion_evento,
        id_organizador_persona,
        presupuesto,
        estado,
        tipo_evento
    } = req.body;

    const sql = 'CALL SP_InsertarEvento(?, ?, ?, ?, ?, ?, ?, ?, ?, @p_id_evento)'; 

    mysqlConnection.query(sql, [
        nombre_evento,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_ubicacion_evento,
        id_organizador_persona,
        presupuesto,
        estado,
        tipo_evento
    ], (err, results) => {
        if (err) {
            console.error('Error al insertar evento:', err);
            return res.status(500).json({ error: 'Error al insertar el evento' });
        }
        const id_evento = results[1][0].id_evento;
        res.status(201).json({
            message: 'Evento creado correctamente',
            id_evento
        });
    });
});

// GET: Obtener un evento por ID
router.get('/:id', (req, res) => {
    const id_evento = req.params.id;
    const sql = 'CALL SP_SeleccionarEventoPorID(?)';

    mysqlConnection.query(sql, [id_evento], (err, results) => {
        if (err) {
            console.error('Error al obtener evento:', err);
            return res.status(500).json({ error: 'Error al obtener el evento' });
        }

        const evento = results[0][0];
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(evento);
    });
});

// PUT: Actualizar evento por ID
router.put('/:id', (req, res) => {
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
        tipo_evento
    } = req.body;

    const sql = 'CALL SP_ActualizarEvento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    mysqlConnection.query(sql, [
        id_evento,
        nombre_evento,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_ubicacion_evento,
        id_organizador_persona,
        presupuesto,
        estado,
        tipo_evento
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar evento:", err);
            return res.status(500).json({ error: 'Error al actualizar el evento' });
        }
        res.json({ message: 'Evento actualizado correctamente' });
    });
});

// GET: Todos los eventos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Eventos';
    mysqlConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// DELETE: Eliminar un evento por ID
router.delete('/:id', (req, res) => {
    const id_evento = req.params.id;
    const sql = "CALL SP_EliminarEvento(?)";

    mysqlConnection.query(sql, [id_evento], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Evento eliminado correctamente" });
        } else {
            console.error("Error al eliminar el evento:", err);
            res.status(500).send('Error al eliminar el evento');
        }
    });
});

// Manejador de error de conexión
mysqlConnection.on('error', (err) => {
    console.error('Error de conexión MySQL:', err.code);
});

module.exports = router