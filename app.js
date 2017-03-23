var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/photos_app");

var photoSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Photo = mongoose.model("Photo", photoSchema);

//add to DB:
Photo.create({
  name: "red",
  image: "http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg",
  description: "description"
}, function(err, photo) {
  if (err) {
    console.log("ERR");
  } else {
    console.log(photo);
  }
});


app.get('/', function (req, res) {
  console.log('landing pg!');
  res.render('landing.ejs');
});

//main page
app.get('/photos', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('photos.ejs', {photos: allPhotos});
    }
  });
});

app.post('/photos/new', function (req, res) {
  // res.render('new.ejs');

});


app.get('*', function (req, res) {
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
