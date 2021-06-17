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


function addTask() {

    const inputTask = document.getElementById('taskForm').value.trim();
    const dataForApiRequest = {
        title: inputTask,
    }
    console.log(inputTask)
    axios({
        url: API_BASE_URL + 'todo/create/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'post',
        data: dataForApiRequest,
    }).then(function({data, status}) {

        var elem = document.querySelector('.list-group-item');
        var clone = elem.cloneNode(true);
        // clone.id = 'elem2';
        // clone.classList.add('text-large');
        elem.before(clone);

        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function({data, status}) {   
        const tasks = document.getElementsByClassName('todo-task');
        tasks[0].innerHTML=inputTask;    
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
