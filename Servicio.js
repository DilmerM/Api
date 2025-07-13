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

// POST insert crear un nuevo servicio
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

// GET un servicio por ID       http://localhost:3000/servicios/10   trae todos los servicios por id
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

// GET todos los servicios      http://localhost:3000/servicios trae todos los servicios 
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Servicio';
    mysqlConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Eliminar un servicio por ID desde la API http://localhost:3000/1 <-- reemplace el (1) por el id cualquiera
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_EliminarServicio(?)";

    mysqlConnection.query(sql, [id], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Servicio eliminado correctamente" });
        } else {
            console.error("Error al eliminar el servicio:", err);
            res.status(500).send('Error al eliminar el servicio');
        }
    });
});
mysqlConnection.on('error', (err) => {
    console.error('Error de conexión MySQL:', err.code);
});
module.exports = router;