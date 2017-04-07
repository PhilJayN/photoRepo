var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");

//ROUTES
router.get('/', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('landing.ejs');
    }
  });
});

//ROUTES: AUTHENTICATION
//show the sign up form
router.get('/register', function (req, res) {
  res.render('register.ejs');
});

//handlers user sign up:
router.post('/register', function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});


//ROUTES: LOGIN
router.get('/login', function(req, res) {
  res.render('login.ejs');
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/secret',
  failureRedirect: '/login' //make sure this is /login, and NOT login.ejs. it's a route
}), function(req, res) {
});


//ROUTES: LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//middleware for logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/demo', function (req, res) {
  res.render('demo.ejs');
});

router.get('*', function (req, res) {
  // res.redirect('/404');
  res.render('pagenotfound.ejs');
});

module.exports = router;
