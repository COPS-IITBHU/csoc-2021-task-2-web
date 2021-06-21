import axios from 'axios';
import { add2list } from "./main";

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
const auth ={
    headers: {
        Authorization: "Token " + localStorage.getItem("token")
    },
};

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function getTasks() {
    iziToast.info({
        title: "Info",
        message: "Loading all the To-Do(s)....  "
    });
    axios
    .get(API_BASE_URL + "todo/",auth)
    .then(function (response) {
        const { data } = response;
        iziToast.destroy();
        for (let entry of data) {
            add2list(entry);   
        }
    }).catch(function (err) {
        console.log(err);
        displayErrorToast('Some error has occured.');
    });
}

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function({data, status}) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
})