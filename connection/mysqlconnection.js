const MYSQL = require('mysql');
const CONN = MYSQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'viajes'
});

module.exports = CONN;