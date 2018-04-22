var express = require('express');
var router = express.Router();
var session = require('express-session');
let usersModel = require('../models/usersModel');
let bcrypt = require('../helpers/crypto');
var controladorUsuarios = require('../controllers/controladorUsuarios');
var controladorViajes = require('../controllers/controladorViajes');
var controladorCesta = require('../controllers/controladorCesta');

/* GET home page. */
// router.get('/', function (req, res, next) {
//     let email = '';
//
//     res.render('destinos', {
//         title: 'Agencia Viajes',
//         layout: 'layout',
//         email: email || ''
//     });
// });

router.get('/', controladorViajes.inicio);

/* GET login page. */
router.get('/login', controladorUsuarios.login);

router.get('/logout',controladorUsuarios.logout);

router.post('/login/autenticar', controladorUsuarios.autenticar);

router.get('/registro', controladorUsuarios.registro);

router.post('/registro/insertar', controladorUsuarios.insertar);

router.get('/send', controladorUsuarios.enviarEmail);

router.get('/activar-usuario', controladorUsuarios.activarUsuario);

router.get('/cambiar-contraseña', controladorUsuarios.cambiar);

router.get('/ver-destino/:id', controladorViajes.verViaje);

router.get('/comprar/:id', controladorViajes.comprarViaje);

router.get('/cesta', controladorCesta.verCesta);

router.get('/incrementar-viajeros/:id', controladorCesta.incrementar);

router.get('/decrementar-viajeros/:id', controladorCesta.decrementar);

router.get('/eliminar-viaje/:id', controladorCesta.eliminar);

//para borrar
router.get('/sesion', (req, res, next) => {
    res.status(200).json(req.session);
});
module.exports = router;
