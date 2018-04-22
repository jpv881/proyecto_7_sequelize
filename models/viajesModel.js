let conn = require('../connection/mysqlconnection');
//let Viajes = {};
const CONNECTOR = require('../config/connector');
const SEQUELIZE = require('sequelize');

const Viaje = CONNECTOR.define('travels', {
    travel: {
        type: SEQUELIZE.STRING
    },
    description: {
        type: SEQUELIZE.STRING
    },
    active: {
        type: SEQUELIZE.BOOLEAN
    },
    price: {
        type: SEQUELIZE.DOUBLE
    },
    type: {
        type: SEQUELIZE.STRING
    },
    path: {
        type: SEQUELIZE.STRING
    }
});

Viaje.fetchAll = (cb)=>{
    Viaje.findAll().then(viajes=>{
        return cb(null, viajes);
    }).error(err=>{
        return cb(err);
    });
}

//Borrar destinos
Viaje.deleteTravel = (id, cb) => {

    Viaje.destroy({
        where: {
            id: id
        }
    }).then(result=>{console.log(result);
        return cb(null, result);
    }).error(err=>{
        return cb(err);
    })
}

//Recoger un destino por id
Viaje.fetchSingleById = (id, cb) => {
    Viaje.findAll({where: {id: id}}).then(viajes=>{
        return cb(null, viajes);
    }).error(err=>{
        return cb(err);
    });
}
/*
Viajes.updateTravel = (travel, cb)=>{
    var active;
    travel.active === 'on' ? active = true : active = false;

    if (!conn) return cb("Error en la conexión");

    let sql = "update travels set travel='"+travel.travel+"', description='"+travel.description+"', type='"+travel.type+"', active="+travel.active+", price='"+travel.price+"', path='"+travel.path+"' where id="+travel.id+";";

    conn.query(sql, (err, result)=>{
        if(err) return cb(err);
        else return cb(null, result);
    });
}*/

Viaje.insertViaje = (travel, cb)=>{
    Viaje.create(travel).then(createdTravel=>{
        return cb(null, createdTravel);
    }).error(error=>{
        return cb(error);
    });
}

Viaje.paginate = (offset, limit, cb)=>{
    if(conn){
        conn.query("select * from travels limit ?, ?", [offset, limit], (error, rows)=>{
            if(error){
                return cb(error);
            }else{
                conn.query("select count(*) as total from travels", (error, count)=>{
                    if(error){
                        return cb(error);
                    }else{
                        return cb(null, {count,rows});
                    }
                })
            }
        });
    }
};

module.exports = Viaje;