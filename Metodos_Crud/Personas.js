
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bp = require('body-parser');
// obligatorio tener esto!!


// Exportar una función que recibe la conexión a la base de datos
module.exports = (mysqlconnection) => {

        router.get('/', (req, res) => {
        res.status(200).send('¡El endpoint base de personas está funcionando! Usa POST para insertar o GET /:id para buscar.');
    });

    // Endpoint para insertar personas (la ruta aquí es relativa a lo que se define en app.use en index.js)
    router.post('/', (req, res) => {
        const {
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            fecha_nacimiento,
            genero,
            nacionalidad,
            tipo_identificacion,
            numero_identificacion,
            estado_civil
        } = req.body;

        if (!primer_nombre || !primer_apellido || !fecha_nacimiento || !genero || !nacionalidad || !tipo_identificacion || !numero_identificacion || !estado_civil) {
            return res.status(400).send('Error: Faltan campos obligatorios para insertar la persona.');
        }

        const query = `
            SET @p_primer_nombre = ?;
            SET @p_segundo_nombre = ?;
            SET @p_primer_apellido = ?;
            SET @p_segundo_apellido = ?;
            SET @p_fecha_nacimiento = ?;
            SET @p_genero = ?;
            SET @p_nacionalidad = ?;
            SET @p_tipo_identificacion = ?;
            SET @p_numero_identificacion = ?;
            SET @p_estado_civil = ?;
            SET @id_persona_generada = NULL;
            CALL SP_InsertarPersona(
                @p_primer_nombre,
                @p_segundo_nombre,
                @p_primer_apellido,
                @p_segundo_apellido,
                @p_fecha_nacimiento,
                @p_genero,
                @p_nacionalidad,
                @p_tipo_identificacion,
                @p_numero_identificacion,
                @p_estado_civil,
                @id_persona_generada
            );
            SELECT @id_persona_generada AS id_persona;
        `;

        const values = [
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            fecha_nacimiento,
            genero,
            nacionalidad,
            tipo_identificacion,
            numero_identificacion,
            estado_civil
        ];

        mysqlconnection.query(query, values, (err, rows, fields) => {
            if (!err) {
                const newPersonaId = rows[rows.length - 1][0].id_persona;
                res.status(201).json({ message: 'Persona insertada con éxito.', id_persona: newPersonaId });
            } else {
                console.error('Error al insertar persona:', err);
                res.status(500).send('Error al insertar la persona en la base de datos.');
            }
        });
    });

     // Endpoint para seleccionar persona por ID
    router.get('/:id_persona', (req, res) => {
        // Capturar el ID de la persona desde los parámetros de la URL
        const id_persona = req.params.id_persona;

        // Validar que el ID sea un número
        if (isNaN(id_persona) || id_persona <= 0) {
            return res.status(400).send('Error: ID de persona inválido.');
        }

        // Consulta SQL para llamar al procedimiento almacenado SP_SeleccionarPersonaDetallePorID
        // Nota: Asegúrate de que este procedimiento exista en tu DB y retorne los datos esperados.
        const query = `CALL SP_SeleccionarPersonaDetallePorID(?)`;

        // Valores para los parámetros de la consulta
        const values = [id_persona];

        // Ejecutar la consulta
        mysqlconnection.query(query, values, (err, rows, fields) => {
            if (!err) {
                // El resultado del procedimiento almacenado puede venir en un array anidado.
                // Generalmente, los datos que quieres están en rows[0].
                const persona = rows[0];

                if (persona.length === 0) {
                    res.status(404).send('Persona no encontrada.');
                } else {
                    res.status(200).json(persona[0]); // Devuelve el primer (y único) resultado
                }
            } else {
                console.error('Error al seleccionar persona por ID:', err);
                res.status(500).send('Error al obtener los datos de la persona.');
            }
        });
    });

        // Endpoint para actualizar una persona
    router.put('/:id_persona', (req, res) => {
        // Capturar el ID de la persona desde los parámetros de la URL
        const id_persona = req.params.id_persona;

        // Extraer los datos actualizados del cuerpo de la solicitud (req.body)
        // Usamos desestructuración para hacer el código más limpio.
        // Los campos deben coincidir con los parámetros de tu SP_ActualizarPersona
        const {
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            fecha_nacimiento,
            genero,
            nacionalidad,
            tipo_identificacion,
            numero_identificacion,
            estado_civil
        } = req.body;

        // Validar que el ID sea un número válido
        if (isNaN(id_persona) || id_persona <= 0) {
            return res.status(400).send('Error: ID de persona inválido para la actualización.');
        }

        // Validar que al menos un campo a actualizar no sea null/undefined (opcional, pero buena práctica)
        if (!primer_nombre && !segundo_nombre && !primer_apellido && !segundo_apellido &&
            !fecha_nacimiento && !genero && !nacionalidad && !tipo_identificacion &&
            !numero_identificacion && !estado_civil) {
            return res.status(400).send('Error: No se proporcionaron datos para actualizar la persona.');
        }

        // Consulta SQL para llamar al procedimiento almacenado SP_ActualizarPersona
        // Los parámetros deben ir en el orden exacto que espera tu procedimiento.
        const query = `CALL SP_ActualizarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Los valores para los parámetros de la consulta
        const values = [
            id_persona,            // El ID de la persona a actualizar (primer parámetro del SP)
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            fecha_nacimiento,
            genero,
            nacionalidad,
            tipo_identificacion,
            numero_identificacion,
            estado_civil
        ];

        // Ejecutar la consulta
        mysqlconnection.query(query, values, (err, results) => { // 'results' en lugar de 'rows, fields' si no esperas resultados
            if (!err) {
                // MySQL devuelve 'affectedRows' si la operación fue exitosa
                // Para los SP de UPDATE, results[0].affectedRows suele ser 1 si se actualizó, 0 si no se encontró el ID.
                if (results && results[0] && results[0].affectedRows === 1) {
                    res.status(200).json({ message: `Persona con ID ${id_persona} actualizada con éxito.` });
                } else {
                    // Si affectedRows es 0, significa que el ID no fue encontrado o no hubo cambios.
                    res.status(404).send(`Persona con ID ${id_persona} no encontrada o no hubo cambios.`);
                }
            } else {
                console.error('Error al actualizar persona:', err);
                res.status(500).send('Error al actualizar la persona en la base de datos.');
            }
        });
    });

    return router;
};