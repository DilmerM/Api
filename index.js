// Dilmer Eli Nuñez Moreira   N° 20221020048
// Equipo #2

//constante para el paquete de mysql
const mysql = require('mysql');

//constante para el paquete de express
// que es express? express es 
// un framework de Node.js que facilita la creacion de aplicaciones web y apis.
// Proporciona una serie de caracteristicas y herramientas para manejar rutas, solicitudes HTTP, middleware
const express = require('express');
//variable para los metodos de express
var app = express();

//constante para el paquete de bodyparser
const bp = require('body-parser');

//enviando datos JSON a NodeJS API
app.use(bp.json());

// Enviando datos JSON a NodeJS API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: '25-1700P4PAC2E2',
    password: '25-1700P4PAC2E2#e67',
    database: '25-1700P4PAC2E2',
    multipleStatements: true
});



// verificacion de la conexion a la base de datos 
mysqlConnection.connect((err) => {
    if (!err) {
        console.log('Conexión a la base de datos exitosa');
    } else {
        console.log('Error al conectar a la base de datos ',err);
    }
});
//ejecutar el server : en puerto 3000
app.listen(3000, () => console.log('Servidor en puerto 3000'));

//Osman  Modulo Personas         INICIO         se hace de esta forma por que utilizo una funcion para exportarlo 
// ejemplo de un get             http://localhost:3000/personas/1
app.use('/personas', require('./Personas.js')(mysqlConnection));
//Dilmer Modulo Geolocalizacion  INICIO         en mi  caso lo tengo como lo hizo el lic 
// ejemplo de un get             http://localhost:3000/Geolocalizacion/direcciones_geograficas/2     
const GeolocalizacionRoutes = require('./Geolocalizacion');
app.use('/Geolocalizacion', GeolocalizacionRoutes);





