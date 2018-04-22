const SEQUELIZE = require('sequelize');
let sequelize = new SEQUELIZE('viajes', 'root', 'mysql',
    {
        host: 'localhost',
        dialect: 'mysql',
        operatorAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

module.exports = sequelize;