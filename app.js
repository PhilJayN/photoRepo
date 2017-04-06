var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user");
var Photo = require("./models/photo");
var Comment = require('./models/comment');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

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

//ROUTES
app.get('/', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('landing.ejs');
    }
  });
});

//INDEX route: display all photos from DB in index pg
app.get('/photos', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('photos/index.ejs', {photos: allPhotos});
    }
  });
});

//NEW Route: Show form to create new photo
app.get('/photos/new', function(req, res){
  res.render('photos/new.ejs');
});

//CREATE Route: add to DB
//when there's a POST request to /photos/addPhoto...
app.post('/photos', function (req, res) {
  //run these codes:
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  //takes data from variables name and image, and stores into an obj:
  var newImage = {name: name, image: image, description: description};
  Photo.create(newImage, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      res.redirect('/photos');
    }
  });
});

//SHOW Route: Show more info about one photo
app.get('/photos/:id', function (req, res){
  //name :id with anything you want.
  Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto) { //foundPhoto is a object, so you can use dot notation on it.
    if (err) {
      console.log(err);
    } else {
      res.render('photos/show.ejs', {photo: foundPhoto});
    }
  });
});



app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret.ejs');
  console.log('user stuff', req.user);
});

//ROUTES: AUTHENTICATION
//show the sign up form
app.get('/register', function (req, res) {
  res.render('register.ejs');
});

//handlers user sign up:
app.post('/register', function (req, res) {
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

//ROUTES: COMMENTS
//NEW
//show new form to create comments:
app.get('/photos/:id/comments/new', function(req, res) {
  Photo.findById(req.params.id, function(err, foundPhoto) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new.ejs', {photo: foundPhoto});
    }
  });
});

app.post('/photos/:id/comments', function(req, res){
  Photo.findById(req.params.id, function(err, photo) {
    if(err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          photo.comments.push(comment);
          photo.save();
          res.redirect("/photos/" + photo._id);
        }
      });
    }
  });
});











//ROUTES: LOGIN
app.get('/login', function(req, res) {
  res.render('login.ejs');
});

app.post('/login', passport.authenticate("local", {
  successRedirect: '/secret',
  failureRedirect: '/login' //make sure this is /login, and NOT login.ejs. it's a route
}), function(req, res) {
});


//ROUTES: LOGOUT
app.get('/logout', function(req, res) {
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

app.get('/demo', function (req, res) {
  res.render('demo.ejs');
});

app.get('*', function (req, res) {
  // res.redirect('/404');
  res.render('pagenotfound.ejs');
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
