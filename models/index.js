var mongoose = require("mongoose");
var User = require("./user");
var Post = require("./post");

var commentSchema = new mongoose.Schema({
  content:{type:String,required:true},
  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

var Comment = mongoose.model("Comment", animalSchema);
module.exports = Comment;