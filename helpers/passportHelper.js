const PASSPORT = require('passport');
const LOCALSTRATEGY = require('passport-local').Strategy;
let User = require('../models/user');

PASSPORT.serializeUser((user, done)=>{console.log('serialize');
  done(null, user.id);
});

PASSPORT.deserializeUser((id,done)=>{console.log('deserialize');
  //Todo: Implementar modelo de BD
  User.findById(id).then(user=>{
    //console.log('user '+user);
    return (null, user);
  })
})


PASSPORT.use(new LOCALSTRATEGY({passwordField:'pass'},
  (username, password, done)=>{
    console.log('Datos recibidos ->' + username);
    User.findOne({where:{username: username, pass: password}})
    .then(user=>{console.log('user'+user);
      if(!user) return done(null, false, {message: 'El usuario no ha sido identificado'});
      return done(null, user);
    }).error(err=>{
      return done(err);
    })

  }
))

module.exports= PASSPORT;
