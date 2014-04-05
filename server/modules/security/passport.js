module.exports = function(passport, controller) {

  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    console.log("kaixo2");
    console.log(user);
    //var userN = {userId: user.userId, sessionId: user.sessionId, username: user.username, country: user.country};
    
    //console.log(userN);

    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log("kaixo");
    console.log(user);
    controller.getUserById(user, function (err, user) {
      console.log("kaixo3");
      console.log(user);
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
   
    function(username, password, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
         console.log("epa");
        controller.login({'username': username,'password': password}, function(err, udata) {
          console.log(err);
          if (err) {
            return done(null, false, {message: 'invalid-user-or-password'}); 
          }
          // else if(udata.roles.indexOf('ac_admin') === -1 &&
          //   udata.roles.indexOf('_admin') === -1){
          //   return done(null, false, {message: 'you-are-not-a-admin-user'});
          // } 
          return done(null, udata);
        })
      });
    }
  ));
}