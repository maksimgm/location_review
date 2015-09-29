var express = require("express"),
  app = express();
require('dotenv').load();
var apiKey = process.env.APIKEY;
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var morgan = require('morgan');
var MapboxClient = require('mapbox');
var client = new MapboxClient(apiKey);
var db = require("./models");
var session = require("cookie-session");
var loginMiddleware = require("./middleware/loginHelper");
var routeMiddleware = require("./middleware/routeHelper");


app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(loginMiddleware);

app.use(session({
  maxAge: 3600000,
  secret: 'iwillnevertell',
  name: "snickerdoddle"
}));

  
// var url = "https://api.mapbox.com/v4/geocode/mapbox.places/";

// // **********User*************
app.get("/",function(req,res){
  res.redirect("/posts");
});

app.get('/users/index',routeMiddleware.preventLoginSignup, function(req,res){
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
  console.log("SIGNUP POST");
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

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// app.get("/location/:location", function (req, res) {
//   req.logout();
//   res.redirect("/");
// });



// **********Post*************

// include location query in the app.post.....("")
// client.geocodeForward(req, function(err, res) {
//   console.log(res);

// });

// index
app.get("/posts", function(req,res){
  // user refers to key in post.js model
  // username refers to key in user.js model
  // console.log("IT GOT THIS FAR!!!");
  db.Post.find({}).populate("user","username").exec(function(err,posts){
    // cookie.session.id
    if(err){
      console.log(err);
    }else{
      if (req.session.id===null) {
        console.log("USERNAME IS NULL!!!");
        res.render("posts/index",{posts:posts,currentUser:""});
      }else{
      db.User.findById(req.session.id,function(err,user){
        console.log("USERNAME IS NOT NULL!!!");
        res.render("posts/index",{posts:posts,currentUser:user.username});
        // console.log(user.username);
      });
      }
    }
  });
});

// new
app.get("/posts/new",routeMiddleware.ensureLoggedIn, function(req,res){
  console.log(user_id);
  res.render("posts/new",{user_id : session.id});  
});

// create
app.post("/posts", routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.create(req.body.id,function(err,post){
    if(err){
      console.log(err);
    }else{
      post.save();
      res.redirect("/posts");
    }
  });
});

// show
app.get("/posts/:id",function(req,res){
  db.Post.findById(req.param.id,function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("posts/show",{post:post});
    }
  });
});

// edit
// app.get("/posts/:id",function(req,res){

// });

// update
app.get("/posts/:id/edit",function(req,res){
  res.render("/posts/edit");
});

app.put("/posts/:id",function(req,res){
  db.Post.findByIdAndUpdate(req.param.id, req.body.id, function(err,post){
    if (err){
      console.log(err);
    }else{
      res.redirect("/posts",{post:post});
    }
  });
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