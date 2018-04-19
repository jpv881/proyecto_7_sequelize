var viajesModel = require('../models/viajesModel');

//multer
// var express = require('express');
// var router = express.Router();
// const Multer = require('multer');
//
// const storage = Multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = Multer({storage});
//fin multer

exports.inicio = (req, res, next) => {
    viajesModel.fetchAll((error, travels) => {
        if (error) return res.status(500).json(error);
        else {
            res.render('destinos', {
                title: 'Agencia Viajes',
                layout: 'layout',
                travels
            });
        }
    });


}

exports.verTodos = (req, res, next) => {
    if (req.session.rol === 0 || req.session.rol === undefined) {
        res.redirect('/');
    } else {
        viajesModel.fetchAll((error, travels) => {
            if (error) return res.status(500).json(error);
            else {
                res.render('listaDestinos', {
                    layout: 'admin',
                    title: 'Administracion',
                    travels
                })
            }
        });
    }
};

exports.eliminar = (req, res, next) => {
    let id = req.params.id;
    viajesModel.deleteTravel(id, (error, travels) => {
        if (error) return res.status(500).json(error);
        else {
            // res.render('listaDestinos', {
            //     layout: 'admin',
            //     title: 'Administracion',
            //     travels
            // })
            res.redirect('/admin');
        }
    })
}

exports.abrirViaje = (req, res, next) => {
    let id = req.params.id;
    viajesModel.fetchSingleById(id, (error, result) => {
        if (result) {
            res.render('edicionDestino', {
                layout: 'admin',
                result: result[0]
            });
        } else {
            return res.status(500).json(error);
        }
    })
}

exports.crearDestino = (req, res, next) => {
    res.render('creacionDestino', {
        layout: 'admin',
    });
};

exports.editarViaje = (req, res, next) => {
    var active;
    req.body.active === 'on' ? active = true : active = false;

    let destino = {};
    destino.id = req.body.id;
    destino.travel = req.body.travel;
    destino.description = req.body.description;
    destino.type = req.body.type;
    destino.active = active;
    destino.price = req.body.price;
    destino.path = req.body.path;

    viajesModel.updateTravel(destino, (error, result) => {
        if (result) {
            res.redirect('/admin');
        } else {
            res.status(500).json('Error al editar' + error);
        }
    });
}

exports.insertDestino = (req, res, next) => {
    var active;
    req.body.active === 'on' ? active = true : active = false;

    let destino = {};
    destino.travel = req.body.travel;
    destino.description = req.body.description;
    destino.type = req.body.type;
    destino.active = active;
    destino.price = req.body.price;
    destino.path = '\\images\\' + req.file.originalname;
    destino.path = destino.path.replace(/\\/g, "/");

    viajesModel.insertViaje(destino, (error, insertID) => {
        if (insertID) {
            res.redirect('/admin');
        } else {
            res.status(500).json('Error al guardar' + error);
        }
    });
}

//module.exports = controladorViajes;