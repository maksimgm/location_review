var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/location_review");

module.exports.User = require("./user");
module.exports.Post = require("./post");
module.exports.Comment = require("./comment");