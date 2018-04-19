var express = require('express');
var router = express.Router();
let controladorViajes = require('../controllers/controladorViajes');
let controladorUsuarios = require('../controllers/controladorUsuarios');

//multer
const Multer = require('multer');

const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
        // cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = Multer({storage});
//fin multer

router.get('/', controladorViajes.verTodos);

router.get('/eliminar-destino/:id', controladorViajes.eliminar);

router.get('/abrir-destino/:id', controladorViajes.abrirViaje);

router.post('/editar-destino', controladorViajes.editarViaje);

router.get('/crear-destino', controladorViajes.crearDestino);

router.post('/guardar-destino',upload.single('imagen'), controladorViajes.insertDestino);

router.get('/usuarios', controladorUsuarios.verUsuarios);

router.get('/activar-usuario/:id', controladorUsuarios.activar);

module.exports = router;