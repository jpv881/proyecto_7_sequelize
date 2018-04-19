let conn = require('../connection/mysqlconnection');
let Viajes = {};

Viajes.fetchAll = (cb)=>{
    if(!conn) return cb("Error en la conexión");
    let sql = 'select * from travels';
    conn.query(sql, (error, rows)=>{
        if(error) return cb(error);
        else return cb(null, rows);
    })
}

//Borrar destinos
Viajes.deleteTravel = (id, cb) => {
    if (!conn) return cb("Error en la conexión");
    conn.query("delete FROM travels WHERE id=?", id, function (error, result) {
        if (error) return cb(error);
        else {
            conn.query("DELETE FROM travel WHERE id=?", id, function () {
                if (error) return cb(error);
                return cb(null, result);
            })
        }
    })
}

//Recoger un destino por id
Viajes.fetchSingleById = (id, cb) => {
    if (!conn) return cb("Error en la conexión");
    else {
        conn.query("SELECT * FROM travels WHERE id=?", [id], (error, result) => {
            if (error) return cb(error);
            else return cb(null, result);
        })
    }
}

Viajes.updateTravel = (travel, cb)=>{
    var active;
    travel.active === 'on' ? active = true : active = false;

    if (!conn) return cb("Error en la conexión");

    let sql = "update travels set travel='"+travel.travel+"', description='"+travel.description+"', type='"+travel.type+"', active="+travel.active+", price='"+travel.price+"', path='"+travel.path+"' where id="+travel.id+";";

    conn.query(sql, (err, result)=>{
        if(err) return cb(err);
        else return cb(null, result);
    });
}

Viajes.insertViaje = (travel, cb)=>{
    if (!conn) return cb("Error en la conexión");
    else {
        conn.query('INSERT INTO travels SET ?', travel, (error, result) => {
            if (error) return cb(error);
            else return cb(null, result);
        })
    }
}

module.exports = Viajes;