import axios from 'axios';
import { editTask, deleteTask, updateTask } from './main';

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
let listData;

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        method: 'get',
        url: API_BASE_URL + 'todo',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        }
    })
        .then(({ data, status }) => {
            listData = data;

            const items = document.getElementById('items');
            data.forEach((e) => {
                const index = e.id
                const listItem = document.createElement('li')
                listItem.innerHTML = `
                <input id="input-button-${index}" type="text" class="form-control todo-edit-task-input hideme"
                    placeholder="Edit The Task">
                <div id="done-button-${index}" class ="input-group-append hideme">
                <button id="update-task-${index}"class ="btn btn-outline-secondary todo-update-task" type ="button"
                >Done</button>
                </div>
                <div id="task-${index}" class ="todo-task">
                ${e.title}
                </div>

                <span id="task-actions-${index}">
                <button id="edit-task-${index}" style="margin-right:5px;" type ="button" class ="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
                </button>
                <button id="delete-task-${index}" type ="button" class ="btn btn-outline-danger">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
                </button>
                </span>`
                listItem.className = "list-group-item d-flex justify-content-between align-items-center"
                listItem.setAttribute('id', `li-task-${index}`)
                items.appendChild(listItem)
                document.getElementById(`edit-task-${index}`).addEventListener('click', () => { editTask(index) })
                document.getElementById(`delete-task-${index}`).addEventListener('click', () => { deleteTask(index) })
                document.getElementById(`update-task-${index}`).addEventListener('click', () => { updateTask(index) })
            });
        })
}


const userDetails = async () => {
    await axios({
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
}
userDetails();

