// var router = express.Router({mergeParams: true});
var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");

//INDEX route: display all photos from DB in index pg
router.get('/photos', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('photos/index.ejs', {photos: allPhotos});
    }
  });
});

//NEW Route: Show form to create new photo
router.get('/photos/new', middleware.isLoggedIn, function(req, res){
  res.render('photos/new.ejs');
});

//CREATE Route: add to DB
//when there's a POST request to /photos/addPhoto...
router.post('/photos', middleware.isLoggedIn, function (req, res) {
  //run these codes:
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  //takes data from variables name and image, and stores into an obj:
  var newImage = {name: name, image: image, description: description, author: author};
  Photo.create(newImage, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      console.log('newlyCreated', newlyCreated);
      res.redirect('/photos');
    }
  });
});

//SHOW Route: Show more info about one photo
router.get('/photos/:id', function (req, res){
  //name :id with anything you want.
  Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto) { //foundPhoto is a object, so you can use dot notation on it.
    if (err) {
      console.log(err);
    } else {
      res.render('photos/show.ejs', {photo: foundPhoto});
    }
  });
});

//EDIT
router.get('/photos/:id/edit', middleware.checkPhotoOwnership, function(req, res) {
    Photo.findById(req.params.id, function(err, foundPhoto) {
      res.render('photos/edit.ejs', {photo: foundPhoto});
    });
});

//UPDATE
router.put('/photos/:id', middleware.checkPhotoOwnership, function(req, res) {
  Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto) {
    if (err) {
      res.redirect('/photos');
    } else {
      res.redirect('/photos/' + req.params.id);
    }
  });

});

//DESTROY
router.delete('/photos/:id', middleware.checkPhotoOwnership, function(req, res) {
  Photo.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/photos");
    } else {
      res.redirect("/photos");
    }
  });
});

router.get('/secret', middleware.isLoggedIn, function (req, res) {
  res.render('secret.ejs');
  // console.log('user stuff', req.user);
});

module.exports = router;
