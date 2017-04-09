var middlewareObj = {};
var Photo = require("../models/photo");
var Comment = require("../models/comment");

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        console.log('author', foundComment.author.id);
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash("error", "Please login first!");
    res.redirect("back");
  }
};

middlewareObj.checkPhotoOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
      Photo.findById(req.params.id, function(err, foundPhoto) {
        if (err) {
          ref.flash("error", "Photo not found");
          res.redirect('back');
          console.log (err);
        } else {
          if (foundPhoto.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that.");
          }
        }
      });
    } else {
      req.flash("error", "Please login first!");
      res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect('/login');
};


module.exports = middlewareObj;
