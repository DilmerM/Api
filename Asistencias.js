const express = require('express');
const app = express();
const PORT = 3000;

var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});

app.use(express.json());

// Datos simulados
let eventos = [
    { id_evento: 1, nombre_evento: "Conferencia Tech 2025" },
    { id_evento: 2, nombre_evento: "Feria de Ciencias" }
];

let asistencias = [
    { id_registro_asistencia: 1, id_evento: 1, estado_asistencia: "Registrado" },
    { id_registro_asistencia: 2, id_evento: 1, estado_asistencia: "Asistió" },
    { id_registro_asistencia: 3, id_evento: 1, estado_asistencia: "Canceló" },
    { id_registro_asistencia: 4, id_evento: 2, estado_asistencia: "No Asistió" },
];

//GET: Estadísticas de asistencia por evento
app.get('/eventos/:id/asistencia', (req, res) => {
    const id_evento = parseInt(req.params.id);
    const evento = eventos.find(e => e.id_evento === id_evento);
    if (!evento) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    const registros = asistencias.filter(a => a.id_evento === id_evento);

    const total_registrados = registros.filter(a => a.estado_asistencia === "Registrado").length;
    const total_asistentes = registros.filter(a => a.estado_asistencia === "Asistió").length;
    const total_no_asistentes = registros.filter(a => a.estado_asistencia === "No Asistió").length;
    const total_cancelaciones = registros.filter(a => a.estado_asistencia === "Canceló").length;
    const total_registros = registros.length;

    res.json({
        nombre_evento: evento.nombre_evento,
        total_registrados,
        total_asistentes,
        total_no_asistentes,
        total_cancelaciones,
        total_registros
    });
});

//POST: Registrar una nueva asistencia
app.post('/asistencias', (req, res) => {
    const nueva = {
        id_registro_asistencia: asistencias.length + 1,
        id_evento: req.body.id_evento,
        estado_asistencia: req.body.estado_asistencia
    };
    asistencias.push(nueva);
    res.status(201).json(nueva);
});

// 👉 PUT: Actualizar una asistencia existente
app.put('/asistencias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const registro = asistencias.find(a => a.id_registro_asistencia === id);
    if (!registro) {
        return res.status(404).json({ mensaje: 'Registro de asistencia no encontrado' });
    }

    registro.estado_asistencia = req.body.estado_asistencia;
    res.json(registro);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
