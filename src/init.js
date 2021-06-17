import axios from 'axios';
import {updateTask, editTask, deleteTask} from './main';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function makeTask (task) {
    const taskContainer = document.createElement('li');
    taskContainer.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    taskContainer.innerHTML = `
    <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${task.id}"  class="input-group-append hideme">
        <button 
            class="btn btn-outline-secondary todo-update-task" 
            type="button" 
            id="update-task-${task.id}"
        >Done</button>
    </div>
    <div id="task-${task.id}" class="todo-task">
        ${task.title}
    </div>

    <span id="task-actions-${task.id}">
        <button 
            style="margin-right:5px;" 
            type="button" 
            id="edit-task-${task.id}"
            class="btn btn-outline-warning todo-edit-task"
        >
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button 
            type="button" 
            class="btn btn-outline-danger todo-delete-task" 
            id="delete-task-${task.id}"
        >
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>
    `

    return taskContainer;
}

function addEventListeners() {
    const updateButtons = document.getElementsByClassName('todo-update-task');
    const editButtons = document.getElementsByClassName('todo-edit-task');
    const deleteButtons = document.getElementsByClassName('todo-delete-task');

    for (let i=0; i<updateButtons.length; i++) {
        const updateButton = updateButtons[i];
        const editButton = editButtons[i];
        const deleteButton = deleteButtons[i];

        const id = updateButtons[i].id.replace('update-task-','');
        updateButton.onclick = () => updateTask(id);
        editButton.onclick = () => editTask(id);
        deleteButton.onclick = () => deleteTask(id);
    }
}

function getTasks() {

    const token = localStorage.getItem('token'); 

    axios({
        url : API_BASE_URL + 'todo/',
        method : 'get',
        headers : {
            'Authorization' : 'Token ' + token
        }
    })
    .then(tasks => {
        const tasksContainer = document.querySelector('.todo-available-tasks');
        while(tasksContainer.firstChild) {
            tasksContainer.removeChild(tasksContainer.firstChild);
        }

        tasks.data.forEach(task => {
            const taskContainer = makeTask(task);
            tasksContainer.appendChild(taskContainer);
        })

        addEventListeners();
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

export {makeTask};
