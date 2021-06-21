/***
 * @todo Redirect the user to main page if token is present.
 */
 const Token = localStorage.getItem("token");
 if(Token){
     window.location.href = "/";
 }