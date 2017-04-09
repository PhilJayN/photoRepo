var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//ROUTES: COMMENTS
//NEW
//show new form to create comments:
router.get('/photos/:id/comments/new', middleware.isLoggedIn, function(req, res) {
  Photo.findById(req.params.id, function(err, foundPhoto) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new.ejs', {photo: foundPhoto});
    }
  });
});

//CREATE
router.post('/photos/:id/comments', middleware.isLoggedIn, function(req, res){
  Photo.findById(req.params.id, function(err, photo) {
    if(err) {
      console.log(err);
    } else {
      console.log('req.body.comment input', req.body.comment);
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          req.flash("error", "Oops! Something went wrong.");
          console.log(err);
        } else {
          console.log('comment prior:', comment); //shows comment before anything added
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          console.log('resulting comment', comment);

          photo.comments.push(comment);
          photo.save();
          req.flash("success", "Successfully added new comment.");
          res.redirect("/photos/" + photo._id);
        }
      });
    }
  });
});

//EDIT
router.get('/photos/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    res.render('comments/edit.ejs', {photo_id: req.params.id, comment: foundComment});
  });
});

//UPDATE
router.put('/photos/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/photos/' + req.params.id);
    }
  });
});

//DELETE
router.delete('/photos/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash("success", "Comment deleted!");
      res.redirect('/photos/' + req.params.id);
    }
  });

});

module.exports = router;
