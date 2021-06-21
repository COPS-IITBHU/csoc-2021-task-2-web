/***
 * @todo Redirect the user to login page if token is not present.
 */
 const Token = localStorage.getItem("token");
 if(!Token){
     window.location.href = "/login/";
 }