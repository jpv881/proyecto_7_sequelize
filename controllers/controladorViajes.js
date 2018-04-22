var viajesModel = require('../models/viajesModel');
const paginate = require('express-paginate');

exports.inicio = (req, res, next) => {
    let numViajes = 0;
    if (req.session.cesta) numViajes = req.session.cesta.length;
    viajesModel.fetchAll((error, viajes) => {
        if (error) return res.status(500).json(error);
        else {
            res.render('destinos', {
                title: 'Agencia Viajes',
                layout: 'layout',
                numViajes: numViajes,
                viajes
            });
        }
    });
}

exports.verTodos = (req, res, next) => {
    let page = (parseInt(req.query.page) || 1) - 1;
    let limit = 10;
    let offset = page * limit;
    /*if (req.session.rol === 0 || req.session.rol === undefined) {
        res.redirect('/');
    } else {*/
    viajesModel.paginate(offset, limit, (error, travels) => {
        if (error) {
            return res.status(500).send(error);
        }
        const currentPage = offset === 0 ? 1 : (offset / limit) + 1;
        const totalCount = travels.count[0].total;
        const pageCount = Math.ceil(totalCount / limit);
        const pagination = paginate.getArrayPages(req)(10, pageCount, currentPage);

        res.render('paginacion_destinos', {
            layout: 'admin',
            title: 'Administracion',
            travels: travels.rows,
            currentPage,
            links: pagination,
            hasNext: paginate.hasNextPages(pageCount),
            pageCount
        });
    })
    //}
};

// exports.verTodos = (req, res, next) => {
//     if (req.session.rol === 0 || req.session.rol === undefined) {
//         res.redirect('/');
//     } else {
//         viajesModel.fetchAll((error, travels) => {
//             if (error) return res.status(500).json(error);
//             else {
//                 res.render('listaDestinos', {
//                     layout: 'admin',
//                     title: 'Administracion',
//                     travels
//                 })
//             }
//         });
//     }
// };

exports.eliminar = (req, res, next) => {
    let id = req.params.id;
    viajesModel.deleteTravel(id, (error, result) => {
        if (error) return res.status(500).json(error);
        else {
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

exports.verViaje = (req, res, next) => {
    let id = req.params.id;
    let numViajes = 0;
    if (req.session.cesta) numViajes = req.session.cesta.length;
    viajesModel.fetchSingleById(id, (error, result) => {
        if (result) {
            res.render('ver-destino', {
                layout: 'layout',
                result: result[0].dataValues,
                numViajes: numViajes
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

    viajesModel.insertViaje(destino, (error, travel) => {
        if (travel) {
            res.redirect('/admin');
        } else {
            res.status(500).json('Error al guardar' + error);
        }
    });
}

exports.comprarViaje = (req, res, next) => {
    let id = req.params.id;

    viajesModel.fetchSingleById(id, (error, result) => {
        if (req.session.cesta === undefined) req.session.cesta = [];
        if (result) {
            result[0].dataValues.viajeros = 1;
            req.session.cesta.push(result[0].dataValues);

            res.redirect('/cesta');
        } else {
            return res.status(500).json(error);
        }
    })
}

//module.exports = controladorViajes;