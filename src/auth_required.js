/***
 * @todo Redirect the user to login page if token is not present.
 */
 document.addEventListener('DOMContentLoaded', function() {

    var token = localStorage.getItem('token');
    if(token == null){
        window.location.href = '/login/';
    }else{
        document.getElementsByTagName("html")[0].style.visibility = "visible";
    }
}, false);