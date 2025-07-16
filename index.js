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


// Osman  Modulo Personas                  Se hace de esta forma por que utilizo una funcion para exportarlo 
// ejemplo de un get                       http://localhost:3000/personas/1
app.use('/personas', require('./Metodos_Crud/Personas.js')(mysqlConnection));


// Dilmer Modulo Geolocalizacion           En mi  caso lo tengo como lo hizo el lic 
// ejemplo de un get                       http://localhost:3000/Geolocalizacion/direcciones_geograficas/2     
const GeolocalizacionRoutes = require('./Metodos_Crud/Geolocalizacion.js');
app.use('/Geolocalizacion', GeolocalizacionRoutes);


// Sarai Modulo Reservas        
const ReservasRoutes = require('./Metodos_Crud/Reservas.js');
app.use('/reservas', ReservasRoutes);
// Sarai Modulo Servcios       
const ServicioRoutes = require('./Metodos_Crud/Servicio.js');
app.use('/servicios', ServicioRoutes);


//Elizabeth Modulo Reportes          
const Reporte_Generadosrouter = require ('./Metodos_Crud/reportes.js');
app.use('/reportes', Reporte_Generadosrouter);


// Henrry Modulo Eventos      get  http://localhost:3000/eventos
const EventosRoutes = require('./Metodos_Crud/Eventos.js');
app.use('/Eventos', EventosRoutes);
// Henrry Modulo Actividades   
const ActividadesRoutes = require('./Metodos_Crud/Actividades.js');
app.use('/Actividades', ActividadesRoutes);
// Henrry Modulo Asistencias   
const AsistenciasRouter = require('./Metodos_Crud/Asistencias.js');
app.use('/Asistencias', AsistenciasRouter);


// Daniel Rivera  Administracion y Control          
const Administracion_controlRoutes = require('./Metodos_Crud/Administracion_control.js');
app.use('/Administracion_control', Administracion_controlRoutes);
