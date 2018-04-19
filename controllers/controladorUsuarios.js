var Usuario = require('../models/usersModel');
var controladorUsuarios = {};
let bcrypt = require('../helpers/crypto');
const Email = require('../config/emailConf');
const Hbs = require('nodemailer-express-handlebars');
var hbs = require('hbs');
const Path = require('path'); //Módulo para registrar el path

exports.login = (req, res, next)=>{
    res.render('login', {
        title: 'Agencia Viajes',
        layout: 'layoutSinFooter'
    });
};

exports.logout = (req, res, next)=>{
    req.session.destroy();
    res.redirect('/');
};

exports.registro = (req, res, next)=>{
    res.render('registro', {
        title: 'Agencia Viajes',
        layout: 'layoutSinFooter'
    });
};

exports.autenticar = (req, res, next)=>{
    const USUARIO = {
        "email": req.body.email,
        "password": req.body.password
    };

    Usuario.getUsuarioByEmail(USUARIO.email, (error, usuario)=>{
        if(error) return res.status(500).json(error);
        let errores = true;
        let template = '';
        let layout = '';

        if(usuario.length > 0){
            if(bcrypt.compare(USUARIO.password, usuario[0].password)){
                errores = false;

                if(usuario[0].tipo === 1) req.session.rol = 1;
                else{
                    req.session.rol = 0;
                }

                var conectado;
                if(req.session.rol) conectado = true;
                else conectado = false;
            }
        }



        if(errores){
            template = 'login';
            layout = 'layoutSinFooter';
        }else{
            template = 'destinos';
            layout = 'layout';
            if( req.session.rol === 1) res.redirect('/admin');
        }

        res.render(template, {
            title: 'Agencia Viajes',
            layout: layout,
            email: USUARIO.email,
            erroresLogin: errores,
            conectado: conectado
        });
    });
}

exports.insertar = (req, res, next)=>{
    const USUARIO = {
        "email": req.body.email,
        //"password": req.body.password1,
        "password": bcrypt.encrypt(req.body.password1),
        "hash": bcrypt.encrypt(req.body.email),
    };

    Usuario.getUsuarioByEmail(USUARIO.email, (error, usuario) => {
        if (error) return res.status(500).json(error);

        if (usuario.length >  0) {
            res.render('registro', {
                title: 'Agencia Viajes',
                layout: 'layoutSinFooter',
                existeEmail: true
            });
        } else {
            Usuario.insert(USUARIO, (error, insertID) => {
                if (insertID) {
console.log('hash en usuario al insertar '+USUARIO.hash);
                    res.redirect('/send?id='+insertID.insertId+'&email='+USUARIO.email+'&hash='+USUARIO.hash);
                    // res.redirect('/send/'+USUARIO.email+'/'+USUARIO.hash);

                }else{
                    res.status(500).json('Error al guardar ' + error);
                }

            });
        }
    });
}

exports.registro = (req, res, next)=>{
    res.render('registro', {
        title: 'Agencia Viajes',
        layout: 'layoutSinFooter'
    });
}

exports.verUsuarios = (req, res, next)=>{
    if(req.session.rol === 0 || req.session.rol === undefined){
        res.redirect('/');
    }else{
        Usuario.verTodos((error, rows)=>{
           if(error) return res.status(500).json(error);

           res.render('listaUsuarios', {
               layout: 'admin',
               title: 'Administracion',
               rows
           })
        });
    }
}

//el administrador puede activar un usuario manualmente
exports.activar = (req, res, next)=>{
    let id = req.params.id;
    Usuario.getUsuarioById(id, (error1, usuarios)=>{
        if(error1) return res.status(500).json(error1);

        Usuario.activarUsuario(id, !usuarios[0].active, (error2, rows)=>{
            if(error2) return res.status(500).json(error2);
            res.redirect('/admin/usuarios');
        });
    });
}

//ruta que recibe la url de activacion
exports.activarUsuario = (req, res, next)=>{
    let id = req.query.id;
    let hash = req.query.hash;

    Usuario.getUsuarioById(id, (error1, usuarios)=>{
        if(error1) return res.status(500).json(error1);

        if(hash === usuarios[0].hash){
            Usuario.activarUsuario(id, !usuarios[0].active, (error2, rows)=>{
                if(error2) return res.status(500).json(error2);
                res.redirect('/admin/usuarios');
            });
        }
    });
};

exports.enviarEmail = (req, res, next)=>{
    let id = req.query.id;
    let email = req.query.email;
    let hash = req.query.hash;console.log('hash al crear el email '+hash);
    // let link = '<a href="http://localhost:3000/activar-usuario?id='+id+'&hash='+hash+'">Activar Usuario</a>';
    let link = 'http://localhost:3000/activar-usuario?id='+id+'&hash='+hash;

    Email.transporter.use('compile', Hbs ({
        viewEngine: 'hbs',
        extName:'.hbs',
        viewPath: Path.join(__dirname,'../views/email-templates')
    }));
    let message= {
        to:email,
        subject : 'Activación de cuenta',
        template:'email',
        context: {
            texto:
                'Hola '+email+', esto es un email de activación, sigue el siguiente link para activar tu cuenta:\n',
            id: id,
            hash: hash,
            link: link,
            email: email,
        },
        attachments:[
            // {
            //     filename:'super.jpeg',
            //     path:__dirname +'/../public/images/super.jpeg',
            //     cid: 'imagen'
            // },
            // {
            //     filename:'super.jpeg',
            //     path:__dirname +'/../public/images/super.jpeg'
            // }
        ]
    }


    Email.transporter.sendMail(message,(error,info) =>{
        if(error){
            res.status(500).send(error, message);
            return;
        }
        Email.transporter.close();
        //res.status(200).send('Respuesta "%s"' + info.response);

    })
    res.redirect('/');

}

exports.cambiar = (req, res, next)=>{
    let id = req.params.id;

    Usuario.getUsuarioById(id, (error1, usuarios)=>{
        if(error1) return res.status(500).json(error1);

        let email = usuarios[0].email;
        let hash = usuarios[0].hash;

        Email.transporter.use('compile', Hbs ({
            viewEngine: 'hbs',
            extName:'.hbs',
            viewPath: Path.join(__dirname,'../views/email-templates')
        }));
        let message= {
            to:email,
            subject : 'Cambio de contraseña',
            template:'emailPassword',
            context: {
                texto:
                'Hola '+email+', esto es un email para cambiar tu contraseña de acceso.\n',
                id: id,
                hash: hash,
                email: email,
            },
            attachments:[
                // {
                //     filename:'super.jpeg',
                //     path:__dirname +'/../public/images/super.jpeg',
                //     cid: 'imagen'
                // },
                // {
                //     filename:'super.jpeg',
                //     path:__dirname +'/../public/images/super.jpeg'
                // }
            ]
        }


        Email.transporter.sendMail(message,(error,info) =>{
            if(error){
                res.status(500).send(error, message);
                return;
            }
            Email.transporter.close();
            //res.status(200).send('Respuesta "%s"' + info.response);

        })

    });
};




//module.exports = controladorUsuarios;