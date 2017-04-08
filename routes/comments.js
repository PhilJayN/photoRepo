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
                    // console.log('user name is: ', req.user.username);
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          console.log('resulting comment', comment);

          photo.comments.push(comment);
          photo.save();
          res.redirect("/photos/" + photo._id);
        }
      });
    }
  });
});

//EDIT
router.get('/photos/:id/comments/:comment_id/edit', checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    res.render('comments/edit.ejs', {photo_id: req.params.id, comment: foundComment});
  });
});

//UPDATE
router.put('/photos/:id/comments/:comment_id', function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/photos/' + req.params.id);
    }
  });
});

//DELETE
router.delete('/photos/:id/comments/:comment_id', function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/photos/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        console.log('author', foundComment.author.id);
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send("you don't have permission to do that!");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
