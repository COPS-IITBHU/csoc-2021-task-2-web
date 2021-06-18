/***
 * @todo Redirect the user to login page if token is not present.
 */

 // import axios from 'axios';

 const axios = require("axios");

 axios.get("/").then((response) => {
     window.location.href = '/register/';
 })
