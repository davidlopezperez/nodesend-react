const express = require('express');
const router = express();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

//Subida de archivos

router.post('/', 
    auth,
    fileController.upFile
);
router.get('/:file',
    fileController.dowmloadFile,
    fileController.deleteFile
);


module.exports = router;