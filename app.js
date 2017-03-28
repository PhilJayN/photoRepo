var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

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
app.get('/', function (req, res) {
  console.log('landing pg!');
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('landing.ejs');
    }
  });
});

//shows all photos from DB
app.get('/photos', function (req, res) {
  Photo.find({}, function(err, allPhotos){
    if (err) {
      console.log(err);
    } else {
      res.render('photos.ejs', {photos: allPhotos});
    }
  });
});

//add to DB on submit btn click:
//when there's a POST request to /photos/addPhoto...
app.post('/photos/addPhoto', function (req, res) {
  console.log('POST REQUEST START!');
  console.log('body parsed', req.body);
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

app.get('*', function (req, res) {
  res.redirect('/404');
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
