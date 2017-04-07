var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");

//ROUTES: COMMENTS
//NEW
//show new form to create comments:
router.get('/photos/:id/comments/new', isLoggedIn, function(req, res) {
  Photo.findById(req.params.id, function(err, foundPhoto) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new.ejs', {photo: foundPhoto});
    }
  });
});

//CREATE
router.post('/photos/:id/comments', isLoggedIn, function(req, res){
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

//middleware for logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
