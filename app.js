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
var sunset = new Photo({
  name: "Sunset",
  image: "Url image",
  description: "Beautiful orange sunset"
});

sunset.save(function (err, photo ) {
  if (err) {
    console.log('ERR!');
  } else {
    console.log('Saved to db!!');
    console.log('here is photo', photo);
  }
});

Photo.find({}, function(err, photos){
  if (err) {
    console.log('errrrr!');
  } else {
    console.log(photos);
  }
});

app.get('/', function (req, res) {
  console.log('landing pg!');
  res.render('landing.ejs');
});

app.get('/photos', function (req, res) {
  res.render('photos.ejs');
});

app.get('/photos/new', function (req, res) {
  res.render('new.ejs');
});

app.get('*', function (req, res) {
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
