//metodo post
app.post('/api/reservas', (req, res) => {
  const {
    id_servicio,
    id_persona_reserva,
    id_ubicacion_reserva,
    id_evento,
    id_actividad,
    fecha_hora_inicio,
    fecha_hora_fin,
    estado_reserva,
    costo_total
  } = req.body;

  const sql = `CALL SP_InsertarReserva(?, ?, ?, ?, ?, ?, ?, ?, ?, @p_id_reserva); SELECT @p_id_reserva AS id_reserva;`;

  db.query(sql, [
    id_servicio,
    id_persona_reserva,
    id_ubicacion_reserva,
    id_evento,
    id_actividad,
    fecha_hora_inicio,
    fecha_hora_fin,
    estado_reserva,
    costo_total
  ], (err, results) => {
    if (err) {
      console.error("Error al insertar reserva:", err);
      return res.status(500).json({ error: 'Error al insertar la reserva' });
    }

    const id_reserva = results[1][0].id_reserva;
    res.status(201).json({ message: 'Reserva creada correctamente', id_reserva });
  });
});

//metodo get
app.get('/api/reservas/:id', (req, res) => {
  const id_reserva = req.params.id;

  const sql = 'CALL SP_SeleccionarReservaDetallePorID(?)';

  db.query(sql, [id_reserva], (err, results) => {
    if (err) {
      console.error('Error al obtener detalle de reserva:', err);
      return res.status(500).json({ error: 'Error al obtener detalle de reserva' });
    }

    // El resultado de un CALL es un array de arrays, tomamos el primero.
    const detalleReserva = results[0][0];

    if (!detalleReserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json(detalleReserva);
  });
});

//metodo put
app.put('/api/reservas/:id', (req, res) => {
  const {
    id_servicio,
    id_persona_reserva,
    id_ubicacion_reserva,
    id_evento,
    id_actividad,
    fecha_hora_inicio,
    fecha_hora_fin,
    estado_reserva,
    costo_total
  } = req.body;

  const id_reserva = req.params.id;

  const sql = `CALL SP_ActualizarReserva(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    id_reserva,
    id_servicio,
    id_persona_reserva,
    id_ubicacion_reserva,
    id_evento,
    id_actividad,
    fecha_hora_inicio,
    fecha_hora_fin,
    estado_reserva,
    costo_total
  ], (err, result) => {
    if (err) {
      console.error("Error al actualizar reserva:", err);
      return res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
    res.json({ message: 'Reserva actualizada correctamente' });
  });
});

//rutas
const express = require('express');
const router = express.Router();
const db = require('./db'); // este archivo conecta a MySQL

// ▶️ GET todas las reservas
router.get('/', (req, res) => {
  db.query('SELECT * FROM Reservas', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ▶️ GET una reserva por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('CALL SP_SeleccionarReservaDetallePorID(?)', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// ▶️ POST crear una nueva reserva
router.post('/', (req, res) => {
  const datos = req.body;
  db.query(
    'CALL SP_InsertarReserva(?, ?, ?, ?, ?, ?, ?, ?, ?, @id_reserva); SELECT @id_reserva AS id_reserva;',
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

// ▶️ PUT actualizar reserva por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  db.query(
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

