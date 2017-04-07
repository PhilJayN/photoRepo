var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");

//ROUTES: COMMENTS
//NEW
//show new form to create comments:
router.get('/photos/:id/comments/new', function(req, res) {
  Photo.findById(req.params.id, function(err, foundPhoto) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new.ejs', {photo: foundPhoto});
    }
  });
});

router.post('/photos/:id/comments', function(req, res){
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

module.exports = router;
