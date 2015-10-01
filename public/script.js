$(document).ready(function(){
  // when the page loads grab the users late and long
  // THIS IS USING HTML5 GEOLOCATION API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data){
          // let's check and see if we got anything (IN THE CHROME CONSOLE)
          console.log(data.coords.latitude);
          console.log(data.coords.longitude);
          // NOW LETS SEND THIS DATA TO THE SERVER
        $.ajax({
          // WE ARE POSTING
          method: "POST",
          // AND SENDING SOME JSON
          dataType: "json",
          // TO A ROUTE ON OUR SERVER
          // that looks like this
            // app.post('/location')
          url: "/location",
          // we are sending some data from the client to the server in the following object
          data: { lat: data.coords.latitude, long: data.coords.longitude }  
          // we can see this on the server inside of req.body
            // in our app.js (req.body.lat === data.lat)
              // data.lat comes from above
        })
        //  when the ajax call is done
          .done(function(msg) {
              // if it is successful we will get back SOMETHING from the server that we will call msg
              // we will then find an input with an ID of location and give it a value of whatever msg.location is
            $("#location").val(msg.location);

          }).fail(function(err){
            // if we fail.....we log something
            console.log("something went wrong",err);
          });
      });  
        // navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("This does not work");
    }

// function loadComments(){
//   $.getJSON(url).done(function(data){
//     var comments = data.comments;
//     comments.forEach(function(comment){
//       $("#comments").append("<h5><li>"+ comment.body +"</li>"+comment.user.username+"<h5>");
//     });
//   });
// }


// loadComments();
// function showPosition(position) {
//   console.log(position.coords.latitude) + (position.coords.longitude);  
// }
});