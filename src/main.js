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

//const for logout button since the previous onclick method was giving uncaught referenceerror
const logout_button = document.getElementById('logoutButton');
if(logout_button) logout_button.addEventListener('click',logout);
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
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

//const for register button since the previous onclick method was giving uncaught referenceerror
const register_button = document.getElementById('registerButton');
if(register_button) register_button.addEventListener('click',register);
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
          console.log('register');
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

//const for login button since the previous onclick method was giving uncaught referenceerror
const login_button = document.getElementById('loginButton');

if(login_button) login_button.addEventListener('click',login);
function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    console.log('login');
    //const for username and password
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    
    const dataForApiRequest = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function({data, status}){
        localStorage.setItem('token', data.token);
        window.location.href = '/';
        console.log('authorised user');
      }).catch(function(err) {
        displayErrorToast('The user is not authorised');
        window.location.href = '/register/';
      })
}
//const for add task button since the previous onclick method was giving uncaught referenceerror
const addTask_button = document.getElementById('addTaskButton');

if(addTask_button) addTask_button.addEventListener('click',addTask);
function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const taskTitle = document.getElementById('inputTask').value.trim();
    axios({
        headers:{
            Authorization: 'Token '+ localStorage.getItem('token'),
        },
        url: API_BASE_URL+'todo/create/',
        method: 'post',
        data: {
            title: taskTitle
        },
    }).then(function(response){
        axios({
            headers: {
                Authorization: 'Token '+ localStorage.getItem('token'),
            },
            url: API_BASE_URL+'todo/',
            method: 'get',
        }).then(function({data,status}){
            const newTaskId = data[data.length-1].id
            showTask(newTaskId,taskTitle)
        });
    });
    document.getElementById('inputTask').value ="";
    if(taskTitle!="") displaySuccessToast("Task was added successfully!");
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
    console.log(id);
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    console.log("deleting ",id);

     axios({
        headers: {
            Authorization: 'Token '+ localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'delete',
    }).then(function({data, status}){
        document.querySelector(`#todo-${id}`).remove();
        displaySuccessToast("Task was deleted successfully!");
    }).catch(function(err){
        displayErrorToast("task could not be deleted!");
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const newTaskTitle = document.getElementById('input-button-'+id).value;
    if(!newTaskTitle){
        displayErrorToast("Input field is empty!");
        return;
    }
    axios({
        headers: {
            Authorization: 'Token '+ localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'patch',
        data: {
            title: newTaskTitle
        }
    }).then(function({ data, status }){
        document.getElementById('task-' + id).classList.remove('hideme');
        document.getElementById('task-actions-' + id).classList.remove('hideme');
        document.getElementById('input-button-' + id).classList.add('hideme');
        document.getElementById('done-button-' + id).classList.add('hideme');
        document.getElementById('task-'+id).innerText = newTaskTitle;
    }).catch(function(err){
        displayErrorToast("Task could not be updated!");
    });
    displaySuccessToast("Task was updated successfully!");
}

function showTask(id,title){
    const tasksList = document.getElementById('tasksList');
    const task = document.createElement('li');
    task.className = "list-group-item d-flex justify-content-between align-items-center";
    task.innerHTML=`
    <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${id}"  class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask-${id}">Done</button>
    </div>
    <div id="task-${id}" class="todo-task">
        ${title}
    </div>
    <span id="task-actions-${id}">
        <button style="margin-right:5px;" type="button" id="editTask-${id}" class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger" id="deleteTask-${id}">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
        </button>
    </span>
    `
    task.id = `todo-${id}`;
    tasksList.appendChild(task);
    const deleteButton = document.getElementById(`deleteTask-${id}`);
    const editButton = document.getElementById(`editTask-${id}`);
    const updateButton = document.getElementById(`updateTask-${id}`);


    deleteButton.addEventListener('click',() => deleteTask(id) );
    editButton.addEventListener('click',() => editTask(id));
    updateButton.addEventListener('click',() => updateTask(id) );
}


export {showTask};