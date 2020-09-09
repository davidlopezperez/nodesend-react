const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if(authHeader){
        //En caso de que exista un header autenticado, es decir que venga con un Bearer token to do..
        //Lo obtenemos y como al recibir el token también viene la palabra Bearer y un ' ' con ese codigo
        //nos traemos solo el valor del token sin espacios ni palabras raras.
        const token = authHeader.split(' ')[1];

        //Comprobar el jwt
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
        } catch (error) {
            console.log(error);
        }
    }
    return next();
}