import axios from 'axios';

// $("#registerbtn").click(() => {
//     window.location.href = '/login/';
// })

// $("#loginbtn").click(() => {
//     window.location.href = '/';
// })

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

function login() {

    const userName = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (!(username === '' || password === '')) {
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
            displayErrorToast('Login details are incorrect!');
        })
    }
}

function addTask() {    // 25 points (3)
    // /**
    //  * @todo Complete this function.
    //  * @todo 1. Send the request to add the task to the backend server.
    //  * @todo 2. Add the task in the dom.
    //  */
    const task = document.getElementById("taskInput").value.trim();
    console.log("addtask clicked!");

    if(task !== ''){
        const token = localStorage.getItem('token');

        axios({
            url: API_BASE_URL + 'todo/create/',
            method: 'post',
            data: {
                title: task
            },
            headers: {
                Authorization: 'Token ' + token
            }
        }).then(response => {
            console.log(response);
        }).catch(error => {
            displayErrorToast("Could not add task!")
        })

    }
}

function editTask(id) {     // 35 points (5)
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {   // 35 points (6)
    // /**
    //  * @todo Complete this function.
    //  * @todo 1. Send the request to delete the task to the backend server.
    //  * @todo 2. Remove the task from the dom.
    //  */

    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        data: {
            id: id
        },
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(response => {
        displayInfoToast("Removed Task!");
        $(".list-item-" + id).remove();
    }).catch(error => {
        displayErrorToast("Couldn't remove Task");
        console.log(error);
    })

}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}

function removeTask(id){

}

function putTask(task){
    var taskString = `<li class="list-group-item d-flex justify-content-between align-items-center list-item-${task.id}">
            <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${task.id}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${task.id})">Done</button>
            </div>
            <div id="task-${task.id}" class="todo-task">
                ${task.title}
            </div>

            <span id="task-actions-${task.id}">
                <button style="margin-right:5px;" type="button" id="edit-task-${task.id}" onclick="editTask(${task.id})" class="btn btn-outline-warning edit-btn">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button type="button" id="delete-task-${task.id}" onclick="deleteTask(${task.id})" class="btn btn-outline-danger delete-btn">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    </li>`

    $("ul").append(taskString);
}

export {
    login,
    register,
    addTask,
    putTask,
    deleteTask,
    updateTask,
    editTask,
    logout
}
