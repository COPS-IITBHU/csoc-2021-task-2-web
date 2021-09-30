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
    window.location.href = '/login/';
}
const logoutButton = document.getElementById('logout-button')
if (logoutButton) {
    logoutButton.addEventListener('click', logout)
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

function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
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
const el = document.getElementById('register');
if (el) {
    el.addEventListener('click', register);
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            username: username,
            password: password
        }
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        })
            .then((res, status) => {
                localStorage.setItem('token', res.data.token);
                window.location.href = '/';
            })
            .catch(e => {
                displayErrorToast('No Auth');
            })

    }
}
const ele = document.getElementById('login');
if (ele) {
    ele.addEventListener('click', login);
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    const dataForApiRequest = {
        title: document.getElementById('add-new-task').value
    }
    if (dataForApiRequest.title && dataForApiRequest.title.length < 256) {
        axios({
            url: API_BASE_URL + 'todo/create/',
            data: dataForApiRequest,
            method: 'post',
            headers: {
                Authorization: `Token ${localStorage.token}`
            }
        })
            .then((data, status) => {
                displaySuccessToast("Added Task")
                window.location.href = '/'
            })
            .catch(e => {
                console.error(e)
            })
    } else {
        displayErrorToast("Enter valid task")
    }

}
const addTaskButton = document.getElementById('add-task')
if (addTaskButton) addTaskButton.addEventListener('click', addTask)

function editTask(id) {
    //  hides the task as well as task-actions
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    //  shows the inputs and done button
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */

    const dataForApiRequest = {
        id: id,
    }
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        data: dataForApiRequest,
        method: 'delete',
        headers: {
            Authorization: `Token ${localStorage.token}`
        }
    })
        .then(data => {
            document.getElementById(`li-task-${id}`).remove();
            displaySuccessToast("Deleted Task")
        })
        .catch(e => console.error(e))
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */

    const dataForApiRequest = {
        id: id,
        title: document.getElementById(`input-button-${id}`).value
    }
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        data: dataForApiRequest,
        method: 'put',
        headers: {
            Authorization: `Token ${localStorage.token}`
        }
    })
        .then(({ data, status }) => {
            document.getElementById(`task-${id}`).innerHTML = data.title;
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            //  shows the inputs and done button
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
            displaySuccessToast("Updated Task")
        })
        .catch(e => console.error(e))

}
export { editTask, deleteTask, updateTask };