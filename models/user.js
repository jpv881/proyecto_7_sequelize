const CONECTOR = require('../config/connector');
const SEQUELIZE = require('sequelize');

const User = CONECTOR.define('usuarios',{
  email:{
    type: SEQUELIZE.STRING
  },
  password:{
    type: SEQUELIZE.STRING
  },
  tipo:{
    type: SEQUELIZE.INTEGER
  },
    active: {
    type: SEQUELIZE.BOOLEAN
    },
    hash: {
    type: SEQUELIZE.STRING
    }

});
module.exports = User;
