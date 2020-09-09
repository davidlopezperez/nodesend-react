const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

//Se crea una función para conectar a la base de datos

const connectToDB = async () => {

    try {
        //Utilizamos mongoose para conectar a la base de datos con sus funciones
        await mongoose.connect(process.env.DB_URL, {
            //Se le pasa una configuración para que no haya errores
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log('db connected');
    } catch (error) {
        console.log('Hubo un error' + error);
        //Esta función detiene el servidor en caso de que haya un error
        process.exit(1);
    }
};

module.exports = connectToDB;