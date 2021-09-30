/***
 * @todo Redirect the user to main page if token is present.
 */
var accessTokenObj = JSON.parse(localStorage.getItem("token"));

if (accessTokenObj.length >= 6) {
  window.location.href = '/'
}