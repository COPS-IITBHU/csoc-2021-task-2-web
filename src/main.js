import axios from 'axios';
import {makeTask} from './init';

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

function loginFieldsAreValid(userName, password) {
    if (userName === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */

    const userName = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (loginFieldsAreValid(userName, password)) {
        displayInfoToast("Please wait...");

        const userData = {
            username: userName,
            password: password
        };

        axios({
            url : API_BASE_URL + 'auth/login/',
            method : 'post',
            data : userData
        })
        .then(user => {
            localStorage.setItem('token', user.data.token);
            window.location.href = '/';
        })
        .catch(error => {
            displayErrorToast('Please Enter the Correct Credentials.');
        })
    }
}

function taskIsValid(task) {
    if (task === '') {
        displayErrorToast("Task Title Cannot Be Empty.");
        return false;
    }
    return true;
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    const task = document.getElementById('add-task-field').value.trim();

    if (taskIsValid(task)) {
        displayInfoToast("Please wait...");
        const token = localStorage.getItem('token');

        const taskData = {
            title : task
        }
    
        axios({
            method : 'post',
            data : taskData,
            url : API_BASE_URL + 'todo/create/',
            headers : {
                'Authorization' : 'Token ' + token
            }
        })
        .then(res => {
            return (
                axios({
                    url : API_BASE_URL + 'todo/',
                    method : 'get',
                    headers : {
                        'Authorization' : 'Token ' + token
                    }
                })
            );
        })
        .then(tasks => {

            const tasksContainer = document.querySelector('.todo-available-tasks');
            const addedTask = tasks.data[tasks.data.length-1];
            const taskContainer = makeTask(addedTask);
            tasksContainer.appendChild(taskContainer);

        })
        .catch(error => {
            displayErrorToast('Could Not Add Task.');
        })
    }
}

function editTask(id) {

    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');

    

}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
}

function updateTask(id) {

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}

export {
    updateTask,
    deleteTask,
    editTask,
    addTask,
    login,
    register,
    logout
}

