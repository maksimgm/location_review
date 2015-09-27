function getLocation() {
    if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition(showPosition));
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("This does nto work");
    }
}





// function showPosition(position) {
//   console.log(position.coords.latitude) + (position.coords.longitude);  
// }