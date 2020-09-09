const express = require('express');
const connectToDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectamos el servidor con la base de datos
connectToDB();

//Habilitar CORS -> politicas de seguridad para permitir la conexion entre en backend y el fronted ya que manejan puertos distints
//BACKEND_PORT = 4000
//FRONTEND_PORT = 3000
//con cors habilitamos la comunicación de ambos.
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions));

//puerto de la app

const port = process.env.PORT || 4000;

//Habilitar la lectura de datos del body
app.use(express.json());

//Habilitar la carpeta pública

app.use(express.static('uploads'));

//Rutas de la app o endpoints, a estas rutas apuntan todas las consultas http que se comunican desde el frontend
//cada una hace su función, función que es definida por un controlador.
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

//Arrancar la app

app.listen(port, '0.0.0.0',()=>{
    console.log(`SERVIDOR FUNCIONANDO EN EL PUERTO ${port}`);
});

