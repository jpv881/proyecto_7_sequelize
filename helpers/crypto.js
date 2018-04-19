var bcrypt = require('bcrypt');
let BCrypt = {};
const SALT = 12;
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("hola-mundo", salt);
// bcrypt.compareSync("hola-mundo", hash);
// bcrypt.compareSync("hola", hash);

BCrypt.encrypt = (pass)=>{
    return bcrypt.hashSync(pass, SALT);
};

BCrypt.compare = (pass, encryptedPass)=>{
    return bcrypt.compareSync(pass, encryptedPass);
}

module.exports = BCrypt;