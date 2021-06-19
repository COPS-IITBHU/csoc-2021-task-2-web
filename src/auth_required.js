/***
 * @todo Redirect the user to login page if token is not present.
 */
 const token=localStorage.getItem('token');
 if(token==null)window.location.href = '../login/index.html'
