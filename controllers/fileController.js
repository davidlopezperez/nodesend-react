const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Links = require('../models/Links');


exports.upFile = async (req, res, next) => {

    //Multer es una libreria que se encarga de la subida de archivos. y es necesario realizarle ciertas confuguraciones
    const multerConfig = {
    //Configuramos el limite del tamaño del archivo a subir y donde se va a guardar, eso en la primer configuración.
    //Después le cambiamos el nombre a los archivos ya que al subirlos vienen con un nombre raro, se le asigna un nuevo
    //nombre con shortid, muy importante, el nombre viene sin extension, para acceder a la extensión del archivo
    //requerimos acceder al mimetype que viene de esta forma ejemplo: 'image/JPG', es por ello que necesitamos de alguna forma
    //acceder solo al tipo de extensión, lo logramos utilizando la función split, y accedemos a la posicion que nos interesa
    //en este caso la posición [1] que nos retorna la extensión que luego concatenamos con el nombre generado con shortid.
    //la función split funciona, pero algunos archivos vienen una extensión rara, es decir que al subirse van a estar renombrados de una manera erronea
    //Para solucionarlo: 
    //En la parte del limite comprobamos si hay un usuario autenticado o no para asignar los limites ya que en nuestro proyecto
    //La persona que tenga una cuenta pues va a tener un limite más alto, auth = 10MB noAuth = 1MB.
    limits: {fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'/../uploads')
        },
        filename: (req, file, cb) => {
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
            cb(null, `${shortid.generate()}${extension}`);
            },

        })
    }

    const upload = multer(multerConfig).single('file');

    upload(req, res,  async (error)=>{

        if(!error){
            res.json({file: req.file.filename});
        }else {
            console.log(error);
            return next()
        }
    });
};

exports.deleteFile =  (req, res) => {
    console.log(req.file);
    try {
        fs.unlinkSync(__dirname + `/../uploads${req.file}`)
    } catch (error) {
        console.log(error);
    }
};

//Función que descarga los archivos

exports.dowmloadFile = async (req, res, next) => {

    //Obtiene el enlace
    const {file} = req.params;
    const links = await Links.findOne({filename: file});
    const fileDownload = __dirname + '/../uploads/' + file;
    res.download(fileDownload);

    //Eliminar el archivo y la entrada de la base de datos
    const {dowmloads, filename} = link;
    
    if(dowmloads === 1){

        //Eliminar el archivo
        req.file = filename;
        //Aqui pasamos al controlador de archivos, que tiene el metodo de elminar archivo con la instruccion next()
        
        //Eliminar la entrada de la base de datos
        await Links.findOneAndRemove(link.id);
        next();

    }else {
        link.dowmloads--;
        await link.save();
    }
}