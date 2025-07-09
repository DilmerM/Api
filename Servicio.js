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

// POST crear un nuevo servicio
router.post('/', (req, res) => {
    const {
        nombre_servicio,
        descripcion,
        tipo_servicio,
        costo_base,
        duracion_promedio_minutos,
        disponible_online
    } = req.body;

    const sql = `CALL SP_InsertarServicio(?, ?, ?, ?, ?, ?, @p_id_servicio); SELECT @p_id_servicio AS id_servicio;`;

    mysqlConnection.query(sql, [
        nombre_servicio,
        descripcion,
        tipo_servicio,
        costo_base,
        duracion_promedio_minutos,
        disponible_online
    ], (err, results) => {
        if (err) {
            console.error('Error al insertar servicio:', err);
            return res.status(500).json({ error: 'Error al insertar el servicio' });
        }
        const id_servicio = results[1][0].id_servicio;
        res.status(201).json({
            message: 'Servicio creado correctamente',
            id_servicio
        });
    });
});

// GET un servicio por ID
router.get('/:id', (req, res) => {
    const id_servicio = req.params.id;
    const sql = 'CALL SP_SeleccionarServicioPorID(?)';
    mysqlConnection.query(sql, [id_servicio], (err, results) => {
        if (err) {
            console.error('Error al obtener servicio:', err);
            return res.status(500).json({ error: 'Error al obtener el servicio' });
        }
        const servicio = results[0][0];
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.json(servicio);
    });
});

// PUT actualizar servicio por ID
router.put('/:id', (req, res) => {
    const {
        nombre_servicio,
        descripcion,
        tipo_servicio,
        costo_base,
        duracion_promedio_minutos,
        disponible_online
    } = req.body;
    const id_servicio = req.params.id;
    const sql = `CALL SP_ActualizarServicio(?, ?, ?, ?, ?, ?, ?)`;
    mysqlConnection.query(sql, [
        id_servicio,
        nombre_servicio,
        descripcion,
        tipo_servicio,
        costo_base,
        duracion_promedio_minutos,
        disponible_online
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar servicio:", err);
            return res.status(500).json({ error: 'Error al actualizar el servicio' });
        }
        res.json({ message: 'Servicio actualizado correctamente' });
    });
});

// GET todos los servicios
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Servicio';
    mysqlConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

module.exports = router;