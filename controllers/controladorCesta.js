exports.verCesta = (req, res, next)=>{
    let precios = {};
    let numViajes = 0;
    if(req.session.cesta) numViajes = req.session.cesta.length;
    precios.total = 0;
    precios.totalIva = 0;
    precios.iva = 0;

    if(req.session.cesta){
        req.session.cesta.forEach((elem)=>{
            precios.total += elem.price * elem.viajeros;
        });

        precios.iva = precios.total * 0.21;
        precios.totalIva = precios.total + precios.iva;
    }

    res.render('cesta', {
        layout: 'layout',
        cesta: req.session.cesta,
        precios: precios,
        numViajes: numViajes
    });
}

exports.incrementar = (req, res, next)=> {
    let id = req.params.id;


    for(let i=0;i<req.session.cesta.length;i++){
        if(req.session.cesta[i].id == id){
            req.session.cesta[i].viajeros = req.session.cesta[i].viajeros+1;console.log(req.session.cesta[i].viajeros);
            break;
        }
    }

    res.redirect('/cesta');
}

exports.decrementar = (req, res, next)=> {
    let id = req.params.id;


    for(let i=0;i<req.session.cesta.length;i++){
        if(req.session.cesta[i].id == id && req.session.cesta[i].viajeros > 1){
            req.session.cesta[i].viajeros = req.session.cesta[i].viajeros-1;
            break;
        }
    }

    res.redirect('/cesta');
}

exports.eliminar = (req, res, next)=> {
    let id= req.params.id;
    let position = 0;

    for(let i=0;i<req.session.cesta.length;i++){
        if(req.session.cesta[i].id == id){
            position = i;
            break;
        }
    }

    req.session.cesta.splice(position, 1);
    res.redirect('/cesta');
}