var express = require("express"),
  app = express();
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var morgan = require('morgan');
var MapboxClient = require('mapbox');
var db = require("./models");
var session = require("cookie-session");
var loginMiddleware = require("./middleware/loginHelper");
var routeMiddleware = require("./middleware/routeHelper");
require('dotenv').load();


app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(loginMiddleware);

app.use(session({
  maxAge: 3600000,
  secret: 'iwillnevertell',
  name: "snickerdoddle"
}));

  
// var url = "https://api.mapbox.com/v4/geocode/mapbox.places/";
apiKey = "pk.eyJ1IjoibWFrc2ltbWFtcmlrb3YiLCJhIjoiY2lmMjE1ZTJ1MTFubHNxbTNlZjF5MTJrNyJ9.4SroRHM54MMtWp1NmrMbLA";
var client = new MapboxClient(apiKey);
// // **********User*************

app.get('/  ', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/index');
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/login');
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err);
      res.render('users/login', {err:err});
    }
  });
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/signup');
});

app.post('/signup', function(req,res){
   db.User.create(req.body.user, function(err, user){
    if (user) {
      console.log(user);
      req.login(user);
      res.redirect('/posts');
    } else {
      console.log(err);
      res.render('errors/404');
    }
  });
});

app.get("/location/:location", function (req, res) {
  req.logout();
  res.redirect("/");
});



// **********Post*************

// include location query in the app.post.....("")
// client.geocodeForward(req, function(err, res) {
//   console.log(res);

// });

// index
app.get("/posts", function(req,res){
  // user refers to key in post.js model
  // username refers to key in user.js model
  db.Post.find({}.populate("user","username").exec(function(err,posts){
    // cookie.session.id
    if(err){
      console.log(err);
    }else{
      if (req.session.id===null) {
        res.render("/posts/index",{posts:posts,currentUser:""});
      }else{
      db.User.findById(req.session.id,function(err,user){
        res.render("/posts/index",{posts:posts,currentUser:user.username});
        console.log(user.username);
      });
      }
    }
  }));
});

// new
app.get("/post/new",routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.create(function(err,post){
    if (err) {
      console.log(err);
    }else{
      console.log(user_id);
      res.render("posts/new",{user_id : session.id});
    }
  });
});

// show
app.get("/posts/show",function(req,res){
  db.Post.findById(function(err,post){

  });
});

// create
app.post("/posts",function(req,res){

});

// update
app.get("/posts/:id/edit",function(req,res){

});

app.put("/posts/:id",function(req,res){

});

// delete
app.delete("/posts/:id",function(req,res){

});

// **********Comment*************
// index
app.get("/posts/:post_id/comments",function(req,res){

});

// new
app.get("/posts/:post_id/comments/new",function(req,res){

});

// show
app.get("/posts/:post_id/comments/show",function(req,res){

});

// create
app.post("/posts/:post_id/comments",function(req,res){

});

// update
app.get("/posts/:post_id/comments/:id/edit",function(req,res){

});

app.put("/posts/:post_id/comments/:id",function(req,res){

});

// delete
app.delete("/posts/:post_id/comments/:id",function(req,res){

});

// catch all
app.get("*",function(req,res){

});
client.geocodeForward('Chester, NJ', function(err, res) {
  // 
  //
  //
  //
});
// listening to server
app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});