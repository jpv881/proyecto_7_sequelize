const NodeMailer = require('nodemailer');
let email={};
email.transporter = NodeMailer.createTransport({
    service:'Gmail',
    auth: {
        user: 'javier.perez.avantio@gmail.com', //User de tu gmail que corresponde al correo completo de gmail
        pass: 'avantioavantio' //Pass de tu cuenta gmail
    },
  },
  {
    from:'', //Correo desde el que se envia.
    headers: {
    }
})




module.exports = email;
