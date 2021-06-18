import axios from 'axios';
function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.replace("/");
}


if( document.getElementById('logoutButton')){
    document.getElementById('logoutButton').onclick = logout;
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {

    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }

    
}

if( document.getElementById('registerButton')){
    document.getElementById('registerButton').onclick = register;
}



function login() {

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

     
    displayInfoToast("Please wait...");
    const dataForApiRequest = {
        username: username,
        password: password
    }
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function({data, status}) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    }).catch(function(err) {
      displayErrorToast('Wrong username or password');
    })


}

if( document.getElementById('loginButton')){
    document.getElementById('loginButton').onclick = login;
}


function getTodoList(){
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data, status}) {   
        return data;
    })
}

const initialTasks= getTodoList;

function addTask() {

    const inputTask = document.getElementById('taskForm').value.trim();
    const dataForApiRequest = {
        title: inputTask,
    }
    
    axios({
        url: API_BASE_URL + 'todo/create/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'post',
        data: dataForApiRequest,
    }).then(function({data, status}) {
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function({data, status}) {   
            const addedTask=data[data.length - 1]
            addRow(addedTask);
            
        })
    }).catch(function(err) {
      displayErrorToast('Erron in adding the task');
    })


    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
}
function addRow(task) {
    const taskID=task.id;
    const taskTitle=task.title;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
    <input id="input-button-${taskID}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${taskID}" class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button>
    </div>

    <div id="task-${taskID}" class="todo-task">
        ${taskTitle}
    </div>

    <span id="task-actions-${taskID}" >
        <button style="margin-right:5px;" type="button" id="edit-button-${taskID}" 
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger delete-btn" id="delete-task-${taskID}" >
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>
    `;
  
    document.getElementById('ul').appendChild(li);
    document.getElementById('delete-task-'+taskID).addEventListener("click", function(){
        deleteTask(taskID);   
    })
    document.getElementById('done-button-'+taskID).addEventListener("click", function(){
        updateTask(taskID);   
    })
    document.getElementById('edit-button-'+taskID).addEventListener("click", function(){
        editTask(taskID);   
    })
  }



if( document.getElementById('addTaskButton')){
    document.getElementById('addTaskButton').onclick = addTask;
}


function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {

    let item = document.getElementById("input-button-"+id);
    let listItem = item.parentElement;
    listItem.parentNode.removeChild(listItem);
    {
    axios({
        url: API_BASE_URL + 'todo/'+id+'/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'delete',
    
    }).then(function({data, status}) {

    }).catch(function(err) {
      displayErrorToast('Erron in deleting the task');
    })
}

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
}



function updateTask(id) {

    const updatedTask=document.getElementById('input-button-'+id).value.trim();
    const dataForApiRequest = {
        title: updatedTask,
    }
    axios({
        url: API_BASE_URL + 'todo/'+id+'/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'patch',
        data: dataForApiRequest

    }).then(function({data, status}) {
        document.getElementById('task-'+ id).innerHTML=updatedTask;
    }).catch(function(err) {
      displayErrorToast('Erron in updating the task');
    })


    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}

export function addROW(task){
    addRow(task);
};
