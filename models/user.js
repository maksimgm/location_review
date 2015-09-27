var mongoose = require("mongoose");
var Post = require("./post");
var Comment = require("./comment");

var userSchema = new mongoose.Schema({
  username:{
    type:String, 
    required: true,
    lowercase: true,
    unique: true
  },
  password:{type:String,required:true},
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});

userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
      username: formData.username
    },
    function (err, user) {
      console.log(user);
      if (user === null){
        callback("Invalid username or password",null);
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

userSchema.pre("remove",function(next){
  Post.remove({user: this._id}).exec();
  next();
});

var User = mongoose.model("User",userSchema);
module.exports = User;