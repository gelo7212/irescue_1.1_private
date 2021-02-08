/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
var express = require('express');
var router = express.Router();
var User = require('./../../function/client/user')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook')
var auth = require('./../../function/auth/auth')
//client_android
passport.use(new FacebookStrategy(
    {
      clientID: 697587307284926,
      clientSecret: 'bdcd44f89bc9a60a927245b6d89d0b9d',
      callbackURL: "http://localhost:3000/login/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email','address'],
      passReqToCallback : true,
    },
    ( req, accessToken, refreshToken, profile, done ) => {
    let data = profile._json;
    User.newUser(data);
    console.log(data)
    /* console.log({
            provider: 'facebook',
            name: data.name,
            email: data.email,
            profile_picture: data.picture.data.url,
            meta: {
              provider: 'facebook',
              id: profile.id,
              token: accessToken,
            }
          }) */
    }
  ));
  let FacebookRoutes = {
    authenticate: () => {
        return passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_location'] });
      },
    callback: () => {
        return passport.authenticate('facebook', {
          failureRedirect: '/auth/failed'
      });
    }
  }



router.post('/facebook', FacebookRoutes.authenticate());
router.post('/auth/failed',function(req,res,next){
    res.send(404)
});
router.get('/auth/facebook/callback', FacebookRoutes.callback());
//Admin
router.get('/',auth.isCookieAvailable, function(req, res, next) {
    res.render('includes/login', { title: 'Express' });
});

module.exports = router;
