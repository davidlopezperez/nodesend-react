const Links = require('../models/Links');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.newLink = async (req, res, next) => {
    
    //Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status('400').json({errors: errors.array()})
    }
    //creamos el objeto de nuevo enlace 
    //Extraemos los datos
    const {filename_original, filename} = req.body;

    const link = new Links();
    link.url = shortid.generate();
    link.filename = filename;
    link.filename_original = filename_original;
    
    //verificamos que haya un usuario autenticado, esto para añadirle la funcionalidad de :
    //1) poder colocar un limite de descargas
    //2) colocarle password al enlace y sea más privado, todo esto es opcional
    if(req.user){
        const {password, dowmloads} = req.body;

        //Asignamos al modelo de enlaces el numero de descargas
        if(dowmloads){
            link.dowmloads = dowmloads;
        }
        //Asignamos al modelo de enlaces el password que el usuario le haya asignado
        if(password){
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }
        //Finalmente asignamos el autor del enlace
        link.author = req.user.id;
    }

    //Almacenamos en la BD
    try {   
        await link.save();
        return res.json({msg: `${link.url}`});
        next(); 
    } catch (error) {
        console.log(error);
    }
}

//Función que obtiene una lista de todos los enlaces, esto es para poder crear los diferentes
//sitios web estaticos.

exports.LinksList = async (req, res) => {

    try {
        
        const links = await Links.find({}).select('url -_id');
        res.json({links});
    } catch (error) {
        console.log(error);
    }
}

//Retorna si el enlace tiene password o no
exports.havePassword = async (req, res, next) =>{
    const {url} = req.params;

    //Verificar si existe el enlace
    const link = await Links.findOne({url : url});

    if(!link){
        res.status(404).json({msg: 'Enlace No Encontrado'});
        return next();
    }

    if(link.password){
        return res.json({password: true, link: link.url})
    }

    next();
};

//Verificar si el password que se envia desde el formulario para descargar el archivo es correcto
exports.verifyPassword = async (req, res, next) =>{
    
    const {url} = req.params;
    const {password} = req.body;
    const link = await Links.findOne({url: url});
    
    //Verificamos el password
    if(bcrypt.compareSync(password, link.password)){

        // Si los password son correctos entonces permitirle descargar el archivo
        //Eso lo logramos haciendo que se vaya al siguiente middleware con next
        next();
    }else {
        return res.status(401).json({msg: 'El password no es válido'})
    }
}

//Obtener el enlace para luego poderlo eliminar
exports.getLink = async (req, res, next) => {

    const {url} = req.params;

    //Verificar si existe el enlace
    const link = await Links.findOne({url : url});

    if(!link){
        res.status(404).json({msg: 'Enlace No Encontrado'});
        return next();
    }
    //Si el enlace existe
    res.json({file: link.filename, password: false});

    return next();

    //El siguiente paso es saber que cantidad de descargas disponibles tiene el archivo, si el usuario esta autenticado
    //Puede colocarle un limite de descargas mayor a 1
    //Si el usuario no esta autenticado solo se puede descargar 1 vez el mismo archivo
    //Extraemos las descargas del link

}