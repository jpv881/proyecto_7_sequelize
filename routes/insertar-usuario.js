var express = require('express');
var session = require('express-session');
var router = express.Router();
let usersModel = require('../models/usersModel');
let bcrypt = require('../helpers/crypto');
var app = express();

router.post('/', function (req, res, next) {

    const USUARIO = {
        "email": req.body.email,
        //"password": req.body.password1,
        "password": bcrypt.encrypt(req.body.password1),
    };

    usersModel.getUsuarioByEmail(USUARIO.email, (error, usuario) => {
        if (error) return res.status(500).json(error);

        if (usuario.length >  0) {
            res.render('registro', {
                title: 'Agencia Viajes',
                layout: 'layoutSinFooter',
                existeEmail: true
            });
        } else {
            usersModel.insert(USUARIO, (error, insertID) => {
                if (insertID) {
                    //res.status(200).send('Añadido usuario');
                    // return res.redirect('/');

                    res.render('destinos', {
                        title: 'Agencia Viajes',
                        layout: 'layout',
                        email: USUARIO.email,
                    });
                }else{
                    res.status(500).json('Error al guardar ' + error);
                }

            });
        }
    });
});


module.exports = router;