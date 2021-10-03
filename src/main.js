import axios from 'axios'

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

function loginFieldsCheck(userid, pass) {

    if (userid === "" || pass === "") {
        displayErrorToast("Please fill all the fields.");
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

function login() {
    const userid = document.getElementById('inputUsername').value.trim();
    const pass = document.getElementById('inputPassword').value;

    if (loginFieldsCheck(userid, pass)) {
        displayInfoToast("Please wait...");

        const ApiReq = {
            username: userid,
            password: pass

        }

        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: ApiReq,
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function (err) {
            displayErrorToast('Invalid login details.Please register if you have not');
        })



        /*** Fcn is Completed
         * @todo Complete this function.
         * @todo 1. Write code for form validation.
         * @todo 2. Fetch the auth token from backend and login the user.
         */
    }
}

function addTask() {

    const newTask = document.querySelector(".form-control").value.trim();
    if (newTask === "") { displayErrorToast("Please enter a non-empty task name"); }

    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: {
            title: newTask
            },
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function (status) {
        axios({
            url: API_BASE_URL + 'todo/',
            method: 'get',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            },
        }).then(function ({ data, status }) {
            const newdata = data[data.length - 1]
            console.log('Adding ' + newdata.title + ' id:' + newdata.id)
            enterNewData(newdata)
            displaySuccessToast('Successfully added given task')
        })
    }).catch(function (err) {
        displayErrorToast('Failed to add Task');
    })

    document.querySelector(".form-control").value = ''
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
}


export function enterNewData(newdata) {
    let list = document.createElement('li')
    list.className = 'list-group-item d-flex justify-content-between align-items-center'
    list.innerHTML =
        `<input id="input-button-${newdata.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
     <div id="done-button-${newdata.id}"  class="input-group-append hideme">
         <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask(${newdata.id})">Done</button>
     </div>
     <div id="task-${newdata.id}" class="todo-task">
         ${newdata.title}
     </div>
     <span id="task-actions-${newdata.id}">
         <button style="margin-right:5px;" type="button" id="editTask(${newdata.id})"
             class="btn btn-outline-warning">
             <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                 width="18px" height="20px">
         </button>
         <button type="button" class="btn btn-outline-danger" id="deleteTask(${newdata.id})">
             <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                 width="18px" height="22px">
         </button>
     </span>`
    /*Above taken from sample task in index.html*/

    list.id = 'list-' + newdata.id
    document.getElementById('completeList').appendChild(list)
    document.getElementById('deleteTask(' + newdata.id + ')').addEventListener('click', function () {
        deleteTask(newdata.id)
    })
    document.getElementById('editTask(' + newdata.id + ')').addEventListener('click', function () {
        editTask(newdata.id)
    })
    document.getElementById('updateTask(' + newdata.id + ')').addEventListener('click', function () {
        updateTask(newdata.id)
    })
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
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ data, status }) {
        
        const delTask = document.getElementById('list-' + id)
        console.log('Deleting ' + delTask.id)
        delTask.remove()
        displaySuccessToast('Successfully deleted the selected task ')
    }).catch(function (err) {
        displayErrorToast('Failed to delete the selected Task');
    })
}


function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const update = document.getElementById('input-button-' + id).value.trim()
    if (update === '') {
        displayErrorToast('Please enter a valid, non-empty task')
        return
    }
    const dataForApiRequest = {
        title: update
    }

    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'patch',
        data: dataForApiRequest,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ data, status }) {
        const updateTask = document.getElementById('task-' + id)
        console.log('Updating ' + updateTask.id)
        updateTask.innerHTML = update
        displaySuccessToast('Successfully updated the selected task')
    }).catch(function (err) {
        displayErrorToast('Failed to update the selected Task');
    })
    document.getElementById('input-button-' + id).value = ''
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}




if (document.getElementById('log_bttn')) {
    document.getElementById('log_bttn').onclick = login;
}

if (document.getElementById('log_out')) {
    document.getElementById('log_out').onclick = logout;
}

if (document.getElementById('register_btn')) {
    document.getElementById('register_btn').onclick = register;
}

if (document.getElementById('editTask')) {
    document.getElementById('editTask').onclick = editTask;
}

if (document.getElementById('AddTask')) {
    document.getElementById('AddTask').onclick = addTask;
}