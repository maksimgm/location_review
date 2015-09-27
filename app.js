var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  db = require("./models"),
  session = require("cookie-session");
  

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.use(session({
  maxAge: 3600000,
  secret: 'iwillnevertell',
  name: "snickerdoddle"
}));

app.use(loginMiddleware);

var url = "https://api.mapbox.com/v4/geocode/mapbox.places/";
apiKey = "ILL NEVER TELL";

// **********User*************
app.get('/users/index', routeMiddleware.preventLoginSignup, function(req,res){
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

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});



// **********Post*************
// index
app.get("/posts",function(req,res){

});

// new
app.get("/post/new",function(req,res){

});

// show
app.get("/posts/show",function(req,res){

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

// listening to server
app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});