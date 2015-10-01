var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/location_review");

mongoose.set("debug",true);

module.exports.User = require("./user");
module.exports.Post = require("./post");
module.exports.Comment = require("./comment");