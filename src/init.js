import axios from 'axios';
import { createNewElement } from "./main";

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() 
{
    iziToast.info({
        title: "Info",
        message: "Please wait while we load your todos!"
    });
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/",
        method: "get"
    })
    .then(function ({data}) {
        iziToast.destroy();
        data.forEach((element) => createNewElement(element));
    })
    .catch(function (err) {
        console.log(err)
        iziToast.error({
            title: 'Error',
            message: "Oops Something went wrong!"
        });
    });
}

axios({
    headers : {
        Authorization: "Token " + localStorage.getItem("token")
    },
    url : API_BASE_URL + "auth/profile/",
    method : "get"
})
.then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
});

