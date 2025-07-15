// exportar datos para trabajar las apis
const mysql = require ('mysql');
const express = require('express');
const router = express.Router(); 

// conexion para probar la base de Datos 
const mysqlConnection = mysql.createConnection({
 host: '142.44.161.115',
 user: '25-1700P4PAC2E2',
password: '25-1700P4PAC2E2#e67',
database: '25-1700P4PAC2E2',
port: 3306,
 multipleStatements: true
})


// creacion del get  tabla reporte de eventos 
router.get("/getreporte", (req, res)=>{
    const { tabla, id} = req.query;
    const sql = "CALL SP_ReporteEventosPorEstadoYFecha (?,?)";
    mysqlconnection.query(sql,[tabla || "Reportes_Generados", id || 0 ], (er, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            res.status(500).send("Error al seleccionar reportes.");
        }
    });
});
// creacion de post  de la tabla reporte de eventos 
router.post("/postreporte", (req, res) =>{
    const { tabla, id} = req.body;
    const sql = "CALL SP_ReporteEventosPorEstadoYFecha (?,?,?,?,?,?)";
    console.log("Datos recibidos", Reporte_Generados);
    mysqlconnection.query(
        sql,
      [
         E.id_evento,
        E.nombre_evento,
        E.descripcion,
        E.fecha_inicio,
        E.fecha_fin,
        E.presupuesto,
        E.estado,
        E.tipo_evento,
        P.primer_nombre,
        P.primer_apellido,
        DG.calle_numero ,
        DG.ciudad ,
        DG.pais 
      ],
       (err, rows, fields) => {
            if (!err) {
                console.log("Respuesta de la base de datos:", rows);  // Depuración
                res.send("Reporte ingresado correctamente!");
            } else {
                console.log("Error al insertar reporte:", err);
                res.status(500).send("Error al insertar reporte.");
            }
        }
    );
   });

   //creacion del put para la tabla de reporte de eventos 
   router.put("/putreporte", (req, res) =>{
    const reporte = req.body;
    const reporteId = req.params.id;
    const sql = "CALL SP_ReporteEventosPorEstadoYFecha(?, ?, ?, ?, ?, ?, ?)";
    mysqlConnection.query(
        sql,
        [ reporteId, 
            reporte.nombre_evento,
             reporte.descripcion, 
             reporte.fecha_inicio,
              reporte.fecha_fin, 
             reporte.presupuesto, 
             reporte.estado
            ],
            (err, rows, fields) => {
            if (!err) {
                res.status(200).send("Reporte actualizado correctamente!");
            } else {
                res.status(500).send("Error al actualizar reporte.");
            }
        }
    );
});
 
// creacion del get para la tabla de reporte de reservas
router.get("/getreporte reserva",(req,res)=>{
    const { tabla, id} = req.query;
    const sql = "CALL SP_ReporteReservasPorEstadoYFecha (?,?)";
    mysqlconnection.query(sql,[tabla || "Reservas", id || 0 ], (er, rows,fields)=>{
        if (!err) {
            res.status(200).json(rows[0]);
            } else {
                res.status(500).send("Error al seleccionar reportes");
                }
     });
});     
// Exportamos el router para que pueda ser usado en index.js
module.exports = router;