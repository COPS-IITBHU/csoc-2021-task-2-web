import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
let arr = [];
let reg = document.getElementById('register')
if (reg != null) {
    reg.addEventListener('click', () => register())
}
let forLogout = document.getElementById('logout')
if (forLogout != null) {
    displaySuccessToast('You are Logged In.')
    forLogout.addEventListener('click', () => logout())
}
let forLogin = document.getElementById('login')
if (forLogin != null) {
    forLogin.addEventListener('click', () => login())
}
document.getElementById(`taskAdd`).addEventListener('click', () => checkTask())

function resync() {
    arr = [];
    let displ = document.querySelector('.strict-tasks');
    displ.innerHTML = '';
    axios({
        headers: {Authorization: 'Token ' + localStorage.getItem('token'),},
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
        for (let i = 1; i <= arr.length; i++) {
            (function (index) {
                document.getElementById(`taskedit-${index}`).addEventListener('click', function () { editTask(index) });
                document.getElementById(`updateDone-${index}`).addEventListener('click', function () { updateTask(index) });
                document.getElementById(`taskDelete-${index}`).addEventListener('click', function () { deleteTask(index) });
            })(i)
        }
    })
}
function checkTask() { 
    if(document.querySelector('.form-control').value != '') addTask(arr.length)
}

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

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login/index.html';
    displaySuccessToast('Logged Out!')
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
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function (err) {
            displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const inputUsername = document.getElementById('inputUsername').value.trim()
    const inputPassword = document.getElementById('inputPassword').value
    if (inputUsername === '' || inputPassword === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return;
    }
    displayInfoToast("Please wait...");
    const dataForApiRequest = {
        username: inputUsername,
        password: inputPassword
    }
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast('The Username or Password you entered isn\'t connected to an account.');
    })
}

function addTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    let str = document.querySelector('.form-control').value
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'post',
        url: API_BASE_URL + 'todo/create/',
        data: {
            title: str
        }
    }).then(function ({ data, status }) {
        displaySuccessToast('Element added successfully!');
        document.querySelector('.form-control').value = ''
        resync()
    }).catch((err) => displayErrorToast('Cannot Add Todo'))
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
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function ({ data, status }) {
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/' + (data[id - 1].id) + '/',
            method: 'delete',
        }).then(function(){displaySuccessToast('Deleted Todo Successfully');resync();})
    }).catch((err) => console.log('Cannot be done'))
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
    if (document.getElementById('input-button-' + id).value != '') {
        document.getElementById('task-' + id).innerHTML = document.getElementById('input-button-' + id).value;
        axios({
            headers: {Authorization: 'Token ' + localStorage.getItem('token'),},
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function ({ data, status }) {
            axios({
                headers: {Authorization: 'Token ' + localStorage.getItem('token'),},
                url: API_BASE_URL + 'todo/' + (data[id - 1].id) + '/',
                method: 'patch',
                data: {
                    title: document.getElementById('input-button-' + id).value
                }
            }).then(() => displaySuccessToast('Todo Updated!'))
        }).catch((err) => displayErrorToast('Todo couldn\'t be Updated'))
    }
}
resync()