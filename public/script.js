$(document).ready(function(){
function getLocation() {
    if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition(showPosition));
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("This does not work");
    }
}

function loadComments(){
  $getJSON(url).done(function(data){
    var comments = data.comments;
    comments.forEach(function(comment){
      $("#comments").append("<h5><li>"+ comment.body +"</li>"+comment.user.username+"<h5>");
    });
  });
}


loadComments();
// function showPosition(position) {
//   console.log(position.coords.latitude) + (position.coords.longitude);  
// }
});