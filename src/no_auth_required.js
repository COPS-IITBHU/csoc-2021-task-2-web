/***
 * @todo Redirect the user to main page if token is present.
 */
var token = localStorage.getItem("token");

// console.log(token);
if (token != undefined && token != null) window.location = "/";
