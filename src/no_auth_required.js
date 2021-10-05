/***
 * @todo Redirect the user to main page if token is present.
 */

//redirecting user to main page if he is authorised
window.onload = function(){
    if(localStorage.getItem('token')){
        window.location.href = '/';
        console.log('authorised user');
    }
}