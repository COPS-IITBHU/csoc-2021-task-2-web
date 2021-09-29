/***
 * @todo Redirect the user to login page if token is not present.
 */
console.log(localStorage.length);
if(!localStorage.length){
    window.location.href = '/login/';
}