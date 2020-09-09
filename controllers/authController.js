const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')
require('dotenv').config({path: 'variables.env'});


//Función del controlador que se encarga de autenticar el usuario
exports.authenticateUser = async (req, res, next) => {

    //Revisar si hay errores
    //Mostrar mensajes de error de express validator

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status('400').json({erros: errors.array()})
    }
    //Buscar el usuario
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        res.status(401).json({msg : 'Usuario no existe'})
        return next();  
    }

    //Verificar el password y autenticar el password si el usuario existe
    if(bcrypt.compareSync(password, user.password)){
        //Crear un jwt JSON WEB TOKEN
        //Toma dos parametros, uno es el cuerpo en el cual especificamos con que valor
        //o a partir de que valor vamos a crear el jwt, en este caso usamos el 'name' como referencia y ese jwt va a llevar
        //guardada toda la informacion que coloquemos en el cuerpo de la firma con la función sign()
        //luego el segundo parametro es una variable "SECRETA" que se configura en el archivo de variables de entorno
        //en este caso variables.env y la variable en este caso es SECRET al cual le asignamos una palabra secreta,
        //en realidad se puede colocar cualquier cosa y con eso realiza el json web token que requerimos para la autenticación
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: '8h'
        } );
        //Esta sintaxis es lo contrario a un destructuring, es decir en vez de extraer la información, la envia y coloca el objeto todo junto.
        res.json({token});
    }else {
        res.status(401).json({msg : 'Password incorrecto'});
        return next();
    }
}
//Función que se encarga de devolver el usuario ya autenticado
exports.authenticatedUser = async (req, res) => {
    res.json({user: req.user});
}