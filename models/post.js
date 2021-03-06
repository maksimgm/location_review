var mongoose = require("mongoose");
var User = require("./user");
var Comment = require("./comment");

// var date = new Date("now");
// var date = new DateTimezone("PST");
// .setTimezone("PST")
var postSchema = new mongoose.Schema({
  title: {type:String, required:true},
  date: {type:String, default: new Date()},
  image: {type:String},
  description: {type:String, required:true},
  location: {type:String},
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

postSchema.pre('remove', function(next) {
    Comment.remove({post: this._id}).exec();
    next();
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;