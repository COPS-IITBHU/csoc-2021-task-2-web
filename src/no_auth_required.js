/***
 * @todo Redirect the user to main page if token is present.
 */
console.log(localStorage.getItem("token"));
if(localStorage.getItem("token"))
{
    window.location.href = "/";
}


