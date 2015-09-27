var mongoose = require("mongoose");
var User = require("./user");
var Comment = require("./comment");

var date = new Date();
var datePost = new Date(date.getMonth()+ "/"+ date.getDay()+"/"+date.getYear());

var postSchema = new mongoose.Schema({
  title: {type:String, required:true},
  date: {type:String, default:datePost},
  location: {type:String, required:true},
  image: {type:String, required:true},
  description: {type:String, required:true},
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