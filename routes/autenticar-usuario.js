var express = require('express');
var router = express.Router();
let usersModel = require('../models/usersModel');
let bcrypt = require('../helpers/crypto');
var app = express();

router.post('/', function (req, res, next) {
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