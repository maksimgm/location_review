var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mongo_zoo_app");

module.exports.User = require("./user");
module.exports.Post = require("./post");
module.exports.Post = require("./comment");