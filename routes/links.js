const express = require('express');
const router = express();
const linksController = require('../controllers/linksController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/',
    [
        check('filename', 'Sube un archivo').not().isEmpty(),
        check('filename_original', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    linksController.newLink
);

router.get('/',
    linksController.LinksList
);

router.get('/:url',
    linksController.havePassword,
    linksController.getLink,
);

router.post('/:url',
    linksController.verifyPassword,
    linksController.getLink
);

module.exports = router;