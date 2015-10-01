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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(loginMiddleware);
app.locals.moment = require('moment');

app.use(session({
  maxAge: 3600000,
  secret: 'iwillnevertell',
  name: "snickerdoddle"
}));

app.use(function(req, res, next) {
    if (req.session.id === undefined) {
      req.session.id = null;
    }
    next();
});

  
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

// THIS ROUTE IS SPECIFICALLY FOR AJAX REQUESTS
// when a user posts to /location....
app.post("/location", function (req, response) {
  // REVERSE GEOCODE
  // we use mapbox's reverse geocode method which takes in as its first parameter an object
  // if you are jonesing for the source (https://github.com/mapbox/mapbox-sdk-js/blob/master/lib/services/geocoder.js line 99)
  // the first parameter is an object with the keys longitude and latitude (THIS IS WHAT THE MAPBOX METHOD NEEDS!)
  // the values we assign in this object come from req.body 
    // req.body is populated through the data object which we sent in our AJAX request 
    // we ran into a problem, where the .geocodeReverse method needed the lat and long to be NUMBERS
      // problem was, the values in req.body always come in as a STRING - so to fix it, we called the Number function
  client.geocodeReverse({longitude:Number(req.body.long),latitude:Number(req.body.lat)}, function(err, res) {    
    // if anything goes wrong....log it here
    console.log("ERRORS?", err);
    // to see the response from the .geocodeReverse method we have this nice console.log
    console.log("RESULT", res);

    // we now NEED to tell our server how to respond and with what format
    response.format({
      // since we are making an AJAX call and are requesting JSON, we will respond with JSON as well
    'application/json': function(){
      console.log("request expects json!");
      // We are telling our express server to respond with an object with the key of location and value of whatever the address is
      response.send(
        {
          location: res.features[0].place_name
        }
        );
    },
    'default': function() {
      console.log("uh oh...");
      // If the request is ANYTHING except for JSON....log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
    });
  });
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
  // console.log("IT GOT THIS FAR!!!");
  console.log("someone has made a get for /posts");
  db.Post.find({}).populate({path:"user", select:"username"}).exec(function(err,posts){
    // cookie.session.id
    if(err){
      console.log(err);
    }else{
      if (req.session.id===null) {
        console.log("no one is logged in!!!");
        res.render("posts/index",{posts:posts,currentUser:""});
      } else {
        db.User.findById(req.session.id,function(err,user){
          if (err) {
            console.log(err);
          } else if (user === null) {
            console.log('the session id is not found', req.session.id);
          } else {
            console.log("found user based on session id!!!", user);
            res.render("posts/index",{posts: posts.reverse(), currentUser: user});
            // console.log(user.username);
          }
        });
      }
    }
  });
});

// new
app.get("/posts/new",routeMiddleware.ensureLoggedIn, function(req,res){
  res.render("posts/new");  
});

// create
app.post("/posts", function(req,res){
  // db.Post.create(req.body.id,function(err,post){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     post.save();
  //     res.redirect("/posts");
  //   }
  // });
  var post = new db.Post(req.body.post);
  console.log("POST*****", post);
  console.log("POST BODY",req.body.post);
  post.user = req.session.id;
  
  post.save();
  res.redirect("/posts");
});

// show
app.get("/posts/:id", routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.id).populate("comments").exec(function(err,post){
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
app.get("/posts/:id/edit", routeMiddleware.ensureLoggedIn,function(req,res){
  db.Post.findById(req.params.id, function(err,post){
    res.render("posts/edit",{post:post});
  });
});

app.put("/posts/:id",routeMiddleware.ensureLoggedIn, function(req,res){
  // console.log("POST EDIT");
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if (err){
      console.log(err);
    }else{
      console.log(req.body.post);
      res.redirect("/posts");
    }
  });
});

// delete
app.delete("/posts/:id",routeMiddleware.ensureLoggedIn, function(req,res){
  console.log("DELETE BEFORE DB");
  db.Post.findByIdAndRemove(req.params.id,function(err,post){
    if(err){
      console.log(err);
    }else{
      console.log("DELETE AFTER DB");
      res.redirect("/posts");
    }
  });
});


// **********Comment*************
// index
app.get("/posts/:post_id/comments",function(req,res){
  db.Comment.find({post:req.params.post_id}).populate("user").exec(function(err,comments){
    if(err){
      console.log(err);
    }else{
      res.render("comments/index",{comments:comments});
    }
  });
});

// new
app.get("/posts/:post_id/comments/new",routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.post_id, function(err,post){
    res.render("comments/new",{post:post, user_id:req.session.id});
  });
});

// show
// app.get("/posts/:post_id/comments/show",function(req,res){

// });

// create
app.post("/posts/:post_id/comments",routeMiddleware.ensureLoggedIn, function(req,res){
  // console.log("WRONG REDIRECTION IN NEW COMMENT");
  db.Comment.create(req.body.comment,function(err,comment){
    if(err){
      console.log("ERROR!!!!", err);
      res.render("comments/new");
    }else{
      db.Post.findById(req.params.post_id,function(err,post){
        post.comments.push(comment);
        comment.post = post.id;
        comment.user = req.session.id;
        comment.save();
        post.save();
        res.redirect("/posts/"+req.params.post_id+"/comments");
      });
    }
  });
});

// update
app.get("/comments/:id/edit",routeMiddleware.ensureCorrectUserForComment ,function(req,res){
  db.Comment.findById(req.params.id, function(err,comment){
    if(err){
      console.log(err);
    }else{
      res.render("comments/edit",{comment:comment});
    }
  });
});

app.put("/comments/:id",routeMiddleware.ensureCorrectUserForComment, function(req,res){
  db.Comment.findByIdAndUpdate(req.params.id,req.body.comment,function(err,comment){
  if(err){
    console.log(err);
  }else{
      res.redirect("/posts/"+comment.post+"/comments");
    }
  });
});

// delete
app.delete("/comments/:id",function(req,res){
  db.Comment.findByIdAndRemove(req.params.id,function(err,comment){
    if(err){
      console.log(err);
    }else{
      res.redirect("/posts/"+comment.post+"/comments");
    }
  });
});

// catch all
app.get("*",function(req,res){
  res.render("errors/404");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on port 3000");
});