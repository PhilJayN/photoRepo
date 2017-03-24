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
// Photo.create({
//   name: "red",
//   image: "http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg",
//   description: "description"
// }, function(err, photo) {
//   if (err) {
//     console.log("ERR");
//   } else {
//     console.log(photo);
//   }
// });

//ROUTES
app.get('/404', function (req, res) {
  res.render('pagenotfound.ejs');
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

app.get('/photos/new', function(req, res){
  res.render('new.ejs');
});

//add to DB on submit btn click:
app.post('/photos', function (req, res) {
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

app.get('*', function (req, res) {
  res.redirect('/404');
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
