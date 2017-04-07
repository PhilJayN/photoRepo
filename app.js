var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user");
var Photo = require("./models/photo");
var Comment = require('./models/comment');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var methodOveride = require("method-override");
app.use(methodOveride("_method"));
//middleware for logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


//require routes:
var photoRoutes = require("./routes/photos");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/photos_app");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "This is the super duper secrete hashing powder",
  resave: false,
  saveUninitialized: false
}));

//setup PASSPORT
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

//setup session, encoding, and decoding for passport:
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware: fxn will be called on every route:
//this way every page will have currentUser data
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(photoRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


app.listen(3000, function () {
  console.log('listening on port 3000!');
});
