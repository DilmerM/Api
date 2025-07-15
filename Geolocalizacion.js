// Dilmer Eli Nuñez Moreira   N° 20221020048
// Equipo #2
const mysql = require('mysql');
const express = require('express');
const router = express.Router();



//conectando a la base de datos (mysql)   este si tiene esto ya que es direfente a la funcion
// la funcion de personas recibe directamente la conexion desde el index y esta la obtiene desde aqui.
// ojo si se elimina esta conexion no funcionara 
var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});


// Obtener detalle de direccion por ID  SELECT - GET
// antes  : app.get   
// despues: router.get   obligatorio
router.get('/direcciones/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_SeleccionarDireccionDetallePorID(?)";
    mysqlConnection.query(sql, [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
            res.status(500).send('Error al obtener el detalle de la dirección');
        }
    });
});

// Insertar una nueva direccion   INSERT POST
router.post('/direcciones', (req, res) => {
    const {
        id_persona,
        ciudad,
        estado,
        cod_postal,  
        pais,
        id_direccion_geo
    } = req.body;

    const sql = "CALL SP_InsertarDireccion(?, ?, ?, ?, ?, ?, @nuevo_id); SELECT @nuevo_id AS id_direccion;";
    mysqlConnection.query(
        sql,
        [
            id_persona,
            ciudad,
            estado,
            cod_postal,  
            pais,
            id_direccion_geo
        ],
        (err, results) => {
            if (!err) {
                res.json({
                    mensaje: "Dirección insertada correctamente",
                    id_direccion: results[1][0].id_direccion
                });
            } else {
                console.log(err);
                res.status(500).send('Error al insertar la dirección');
            }
        }
    );
});


// Actualizar una dirección   UPDATE PUT
router.put('/direcciones/:id', (req, res) => {
    const id = req.params.id;
    const {
        ciudad,
        estado,
        cod_postal,
        pais,
        id_direccion_geo
    } = req.body;

    const sql = "CALL SP_ActualizarDireccion(?, ?, ?, ?, ?, ?)";
    mysqlConnection.query(
        sql,
        [
            parseInt(id), // id_direccion
            id_direccion_geo,
            ciudad,
            estado,
            cod_postal,
            pais
        ],
        (err, results) => {
            if (!err) {
                res.json({ mensaje: "Dirección actualizada correctamente" });
            } else {
                console.log(err);
                res.status(500).send('Error al actualizar la dirección');
            }
        }
    );
});


// Eliminar una dirección por ID desde la API
router.delete('/direcciones/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_EliminarDireccion(?)";

    mysqlConnection.query(sql, [id], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Dirección eliminada correctamente" });
        } else {
            console.error("Error al eliminar la dirección:", err);
            res.status(500).send('Error al eliminar la dirección');
        }
    });
});

// INICIO DIRECCION GEOGRAFICA


// Obtener detalle de direccion geografica por ID // SELECT GET
router.get('/direcciones_geograficas/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_SeleccionarDireccionGeograficaDetallePorID(?)";
    mysqlConnection.query(sql, [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
            res.status(500).send('Error al obtener la dirección geográfica');
        }
    });
});



// Insertar una nueva dirección geografica   INSERT - POST
router.post('/direcciones_geograficas', (req, res) => {
    const {
        id_puntogeografico,
        calle_numero,
        colonia_barrio,
        ciudad,
        departamento_territorial, 
        municipio,
        estado_provincia,
        codigo_postal,
        pais,
        referencia
    } = req.body;

    const sql = "CALL SP_InsertarDireccionGeografica(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @nuevo_id); SELECT @nuevo_id AS id_direccion_geo;";
    mysqlConnection.query(
        sql,
        [
            id_puntogeografico,
            calle_numero,
            colonia_barrio,
            ciudad,
            departamento_territorial,  
            municipio,
            estado_provincia,
            codigo_postal,
            pais,
            referencia
        ],
        (err, results) => {
            if (!err) {
                res.json({
                    mensaje: "Dirección geográfica insertada correctamente",
                    id_direccion_geo: results[1][0].id_direccion_geo
                });
            } else {
                console.log(err);
                res.status(500).send('Error al insertar la dirección geográfica');
            }
        }
    );
});
// Actualizar una direccion geografica UPDATE - PUT

router.put('/direcciones_geograficas/:id', (req, res) => {
    const id = req.params.id;
    const {
        id_puntogeografico,
        calle_numero,
        colonia_barrio,
        ciudad,
        departamento_territorial,  
        municipio,
        estado_provincia,
        codigo_postal,
        pais,
        referencia
    } = req.body;

    const sql = "CALL SP_ActualizarDireccionGeografica(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    mysqlConnection.query(
        sql,
        [
            parseInt(id), // id_direccion_geo como entero
            id_puntogeografico,
            calle_numero,
            colonia_barrio,
            ciudad,
            departamento_territorial,
            municipio,
            estado_provincia,
            codigo_postal,
            pais,
            referencia
        ],
        (err, results) => {
            if (!err) {
                res.json({ mensaje: "Dirección geográfica actualizada correctamente" });
            } else {
                console.log(err);
                res.status(500).send('Error al actualizar la dirección geográfica');
            }
        }
    );
});

// Eliminar una dirección geográfica por ID desde la API
router.delete('/direcciones_geograficas/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_EliminarDireccionGeografica(?)";

    mysqlConnection.query(sql, [id], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Dirección geográfica eliminada correctamente" });
        } else {
            console.error("Error al eliminar la dirección geográfica:", err);
            res.status(500).send('Error al eliminar la dirección geográfica');
        }
    });
});

// FIN DIRECCION GEOGRAFICA;


//INICIO DE LOS METODOS DE LA TABLA PUNTOS GEOGRAFICOS

// Obtener un punto geografico por ID   SELECT - GET   http://localhost:3000/Geolocalizacion/puntos_geograficos/5
router.get('/puntos_geograficos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_SeleccionarPuntoGeograficoPorID(?)";
    mysqlConnection.query(sql, [id], (err, rows, fields) => {
        if (!err) {
            // El resultado viene como un array de arrays por el call
            res.json(rows[0]);
        } else {
            console.log(err);
            res.status(500).send('Error al obtener el punto geográfico');
        }
    });
});


// Insertar un nuevo punto geografico   INSERT - POST    http://localhost:3000/Geolocalizacion/puntos_geograficos
router.post('/puntos_geograficos', (req, res) => {
    const { latitud, longitud, nombre_punto, descripcion } = req.body;
    const sql = "CALL SP_InsertarPuntoGeografico(?, ?, ?, ?, @nuevo_id); SELECT @nuevo_id AS id_punto_geografico;";
    mysqlConnection.query(
        sql,
        [latitud, longitud, nombre_punto, descripcion],
        (err, results) => {
            if (!err) {
                res.json({
                    mensaje: "Punto geográfico insertado correctamente",
                    id_punto_geografico: results[1][0].id_punto_geografico
                });
            } else {
                console.log(err);
                res.status(500).send('Error al insertar el punto geográfico');
            }
        }
    );
});


// Actualizar un punto geografico   UPDATE - PUT   http://localhost:3000/Geolocalizacion/puntos_geograficos/6
router.put('/puntos_geograficos/:id', (req, res) => {
    const id = req.params.id;
    const { latitud, longitud, nombre_punto, descripcion } = req.body;
    const sql = "CALL SP_ActualizarPuntoGeografico(?, ?, ?, ?, ?)";
    mysqlConnection.query(
        sql,
        [id, latitud, longitud, nombre_punto, descripcion],
        (err, results) => {
            if (!err) {
                res.json({ mensaje: "Punto geográfico actualizado correctamente" });
            } else {
                console.log(err);
                res.status(500).send('Error al actualizar el punto geográfico');
            }
        }
    );
});

// Eliminar un punto geográfico por ID desde la API       http://localhost:3000/Geolocalizacion/puntos_geograficos/10
router.delete('/puntos_geograficos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL SP_EliminarPuntoGeografico(?)";

    mysqlConnection.query(sql, [id], (err, results) => {
        if (!err) {
            res.json({ mensaje: "Punto geográfico eliminado correctamente" });
        } else {
            console.error("Error al eliminar el punto geográfico:", err);
            res.status(500).send('Error al eliminar el punto geográfico');
        }
    });
});


// FIN PUNTO GEOGRAFICO;

module.exports = router;//obligatorio