//importar el modelo para poder leer los datos y recibirlos aqui en el controlador
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

//Aquí mandamos a llamar el modelo

exports.newUser = async (req, res) => {

    //Mostrar mensajes de error de express validator

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status('400').json({erros: errors.array()})
    }

    //Verificar si el usuario ya esta registrado

    const {email,password} = req.body;

    let user = await User.findOne({email});
    
    if(user){
        return res.status('400').json({msg: 'El usuario ya esta registrado'});
    }

    //Crear un nuevo usuario

    user = new User(req.body);
    //Hashear el password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }
    

    res.status(200).json({user: {email, password}});
    
}