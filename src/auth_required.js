/***
 * @todo Redirect the user to login page if token is not present.
 */
var token = localStorage.getItem("token");
console.log("token = ", token);

if (token == undefined || token == null) window.location = "./login/";
