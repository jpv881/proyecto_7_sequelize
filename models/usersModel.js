let conn = require('../connection/mysqlconnection');
let Usuarios = {};


Usuarios.insert = (usuario, callback)=>{
    if(!conn) return cb("Error en la conexión");
    conn.query('insert into usuarios set ?', [usuario], (error, result)=>{
       if(error) return callback(error);
       return callback(null, result);
    });
}

Usuarios.getUsuarioByEmail = (usuario, callback)=>{
    if(!conn) return callback("Error en la conexión");
    const SQL = 'select * from usuarios where email = "'+usuario+'"';
    conn.query(SQL, (error, rows)=>{
       if(error) return callback(error);
       else {
           return callback(null, rows);
       }
    });
};

Usuarios.getUsuarioById = (id, callback)=>{
    if(!conn) return callback("Error en la conexión");
    const SQL = 'select * from usuarios where id = "'+id+'"';
    conn.query(SQL, (error, rows)=>{
        if(error) return callback(error);
        else {
            return callback(null, rows);
        }
    });
};

Usuarios.verTodos = (cb)=>{
    if(!conn) return cb("error en la conexión");
    let sql = "select * from usuarios";
    conn.query(sql, (error, rows)=>{
        if(error) return cb(error);
        else return cb(null, rows);
    });
}

Usuarios.activarUsuario = (id, activo, cb)=>{
    if(!conn) return cb("error en la conexión");
    let sql = "update usuarios set active ="+activo+" where id ="+id;
    conn.query(sql, (error, rows)=>{
        if(error) return cb(error);
        else return cb(null, rows);
    })
}

module.exports = Usuarios;