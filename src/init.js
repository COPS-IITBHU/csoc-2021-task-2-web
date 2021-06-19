import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

var arr = []

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        headers: {Authorization: 'Token ' + localStorage.getItem('token'),},
        url: API_BASE_URL + 'todo/',
        method: 'get',
    })
    .then(function ({data}) {arr = data;})
}

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function ({ data, status }) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
})

function resync() {
    arr = [];
    let displ = document.querySelector('.strict-tasks');
    displ.innerHTML = '';
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function ({ data, status }) {
        arr = data;
        for (let i = 1; i <= arr.length; i++) {
            displ.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <input id="input-button-${i}" type="text" class="form-control todo-edit-task-input hideme"
                placeholder="Edit The Task">
                <div id="done-button-${i}" class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button"
                id="updateDone-${i}">Done</button>
                </div>
                <div id="task-${i}" class="todo-task">
                ${arr[i - 1].title}
                </div>
                
                <span id="task-actions-${i}">
                <button style="margin-right:5px;" type="button" id="taskedit-${i}" class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
                </button>
                <button type="button" class="btn btn-outline-danger" id="taskDelete-${i}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
                </button>
                </span>
                </li>`
        }
    })
}