/***
 * @todo Redirect the user to login page if token is not present.
 */

const authToken = localStorage.getItem('token');
if (!authToken) {
    window.location.href = '/login/';
} 

