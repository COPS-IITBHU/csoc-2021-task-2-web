/***
 * @todo Redirect the user to login page if token is not present.
 */
//redirecting to login page based on availability of token
window.onload = function(){
    if(localStorage.getItem('token')===null){
        window.location.href = '/login/';
        console.log('unauthorised user');
    }
}