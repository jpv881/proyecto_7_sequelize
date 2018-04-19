var express = require('express');
var router = express.Router();
let usersModel = require('../models/usersModel');
let bcrypt = require('../helpers/crypto');
var controladorUsuarios = require('../controllers/controladorUsuarios');

/* GET login page. */
router.get('/login', controladorUsuarios.login);

/* GET registro page. */
router.get('/registro', controladorUsuarios.registro);

// POST insertar usuario
router.post('/insertar-usuario', function (req, res, next) {

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

router.post('/autenticar-usuario', function (req, res, next) {
    const USUARIO = {
        "email": req.body.email,
        "password": req.body.password
    };

    usersModel.getUsuarioByEmail(USUARIO.email, (error, usuario)=>{
        if(error) return res.status(500).json(error);
        let errores = true;
        let template = '';
        let layout = '';

        if(usuario.length > 0){
            if(bcrypt.compare(USUARIO.password, usuario[0].password)){
                errores = false;
            }
        }

        if(errores){
            template = 'login';
            layout = 'layoutSinFooter';
        }else{
            template = 'destinos';
            layout = 'layout';
        }

        res.render(template, {
            title: 'Agencia Viajes',
            layout: layout,
            email: USUARIO.email,
            erroresLogin: errores
        });
    });
});

module.exports = router;