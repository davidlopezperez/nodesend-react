const express = require('express');
const router = express();
const userController = require('../../controllers/userController');
const { check } = require('express-validator')

router.post('/',
    //Aqui van las validaciones para que nuestro modelo reciba los datos que requiere
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Escribe un email válido').isEmail(),
        check('password', 'El password debe contener al menos 6 caracteres' ).isLength({min: 6})
    ],
    //Aqui van los metodos que estan definidos en el controlador.
    userController.newUser
);

module.exports = router;