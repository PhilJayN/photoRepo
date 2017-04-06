var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Photo", photoSchema);
