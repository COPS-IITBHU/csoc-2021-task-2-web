import axios from 'axios';
import {
    putTask,
    deleteTask,
    editTask,
    displayErrorToast
} from '../src/main.js'

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(todos => {
        todos.data.forEach(todo => {
            putTask(todo, todo.title);
            addEventListener(todo);
        })
    }).catch(error => {
        displayErrorToast("There was an error while fetching tasks!");
        console.log(error);
    })
}

function addEventListener(task) {
    $("#delete-task-" + task.id).click(() => {
        deleteTask(task.id);
    })
    $("#edit-task-" + task.id).click(() => {
        editTask(task.id);
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
    console.log(status);
  getTasks();
})
