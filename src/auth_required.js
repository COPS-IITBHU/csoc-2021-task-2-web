/***
 * @todo Redirect the user to login page if token is not present.
 */
// code for the above condition is here 

 if (!localStorage.getItem("token")) {
    window.location.href = "/login/";
}
