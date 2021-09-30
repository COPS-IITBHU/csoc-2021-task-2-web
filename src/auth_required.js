/***
 * @todo Redirect the user to login page if token is not present.
 */
var accessTokenObj = JSON.parse(localStorage.getItem("token"));

if (!(accessTokenObj >= 6)) {
  window.location.href = '/login/'
}
