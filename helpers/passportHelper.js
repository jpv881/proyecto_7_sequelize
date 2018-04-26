const PASSPORT = require('passport');
const LOCALSTRATEGY = require('passport-local').Strategy;
let User = require('../models/user');
let bcrypt = require('../helpers/crypto');

PASSPORT.serializeUser((usuario, done)=>{
  done(null, usuario.id);
});

PASSPORT.deserializeUser((id,done)=>{
  //Todo: Implementar modelo de BD
  User.findOne({where: {id:id}}).then(usuario=>{
    return (null, usuario);
  }).error(err=>{
  })
})


PASSPORT.use(new LOCALSTRATEGY({usernameField:'email'},
  (username, password, done)=>{
    //console.log('Datos recibidos ->' + username+' '+password);
    // User.findOne({where:{email: username}})
    // .then(user=>{console.log('user'+JSON.stringify(user));
    //  // if(!user) return done(null, false, {message: 'El usuario no ha sido identificado'});
    //  // if(!(bcrypt.compare(password, user.password))) return done(null, false, {message: 'El usuario no ha sido identificado'});
    //   return done(null, user);
    // }).error(err=>{
    //   return done(err);
    // })
      User.findOne({where:{email:username}}).then(usuario=>{
console.log(usuario);
          return done(null,usuario);
      })

  }
))

module.exports= PASSPORT;
