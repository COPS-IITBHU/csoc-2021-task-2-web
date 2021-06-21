import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
import { makeEntry } from "./main";

function getTasks() {
    const token = localStorage.getItem('token');
     axios({
        headers: {Authorization: "Token " + token},
        method: "get",
        url: API_BASE_URL + "todo/"
    }).then(function (response) {
        const { data, status } = response;
        for (let task of data) {
            const taskid = task.id;
            const tasknaam = task.title;
            makeEntry(tasknaam, taskid);
        }
    })
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