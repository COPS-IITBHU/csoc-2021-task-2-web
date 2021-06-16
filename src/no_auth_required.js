/***
 * @todo Redirect the user to main page if token is present.
 */

 const authToken = localStorage.getItem('token');
 if (authToken) {
    window.location.href = '/';
 }