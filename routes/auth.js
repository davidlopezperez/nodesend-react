const express = require('express');
const router = express();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty()
    ],
    authController.authenticateUser
    
);

router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;