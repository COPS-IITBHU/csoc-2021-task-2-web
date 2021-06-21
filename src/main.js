// ATHARVA BHATT, ELECTRONICS ENGINEERING '24
import axios from 'axios';

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
const auth ={
    headers: {
        Authorization: "Token " + localStorage.getItem("token")
    },
};
var list = document.getElementById('tasks');
var numtask = 0;

// INTIALIZING SOME BUTTONS.
const registbtn=document.querySelector('#registbtn');
if(registbtn) registbtn.onclick= register;
const loginbtn=document.querySelector('#loginbtn');
if(loginbtn) loginbtn.onclick= login;
const logoutbtn=document.querySelector('#logoutbtn');
if(logoutbtn) logoutbtn.onclick= logout;
const addtaskbtn=document.querySelector('#addtaskbtn');
if(addtaskbtn) addtaskbtn.onclick= addTask;

if (localStorage.getItem('token')!=undefined) {
    getTask();
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

// LOG-OUT FUNCTION.
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

// REGISTER FUNCTION.
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

// LOGIN FUNCTION. 
function login() {
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;

    if (username == "" || password == "") {
        displayErrorToast("Please fill all the fields.");
        return;
    }
    displayInfoToast("Please wait...");

    const dataForApiRequest = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast("Invalid Credentials! Try Again.");
    })
}

// GET TASK FUNCTION.
function getTask() {
    displayInfoToast("Loading all the To-Do(s)....  ");
    axios
    .get(API_BASE_URL + "todo/",auth)
    .then(function (response) {
        const { data } = response;
        numtask = data.length;
        for (let entry of data) {
            const taskno = entry.id;
            const desc = entry.title;
            add2list(desc, taskno);   
        }
    }).catch(function (err) {
        displayErrorToast('Some error has occured.');
    });
}

// ADD TASK FUNCTION.
function addTask() {
    const desc = document.querySelector(".todo-add-task input").value.trim();
    if (!desc) {
        displayErrorToast("The task field is empty!")
        return;
    }
    axios
        .post(API_BASE_URL + "todo/create/",{ title: desc },auth)    
        .then(function (response) {
            displaySuccessToast("Task added!");
            numtask += 1;
            add2list(desc, numtask);
        })
        .catch(function (err) {
            displayErrorToast("Some error has occured.");
        });
}

// EDIT TASK FUNCTION.
function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

// DELETE TASK FUNCTION.
function deleteTask(id) {
    axios
    .delete(API_BASE_URL + "todo/" + id + "/", auth)    
    .then(function (data, status) {
        document.querySelector(`#todo-${id}`).remove();
        displaySuccessToast("Task removed.");
    }).catch(function (err) {
        displayErrorToast("Some error has occured. ");
    });
}

// UPDATE TASK FUNCTION.
function updateTask(id) {
    const desc = document.querySelector(".todo-edit-task-input").value.trim();
    if (!desc) {
        displayErrorToast("The update task field is empty!")
        return;
    }
    axios
    .patch(API_BASE_URL+ "todo/" +id + "/",{ title: desc}, auth)
    .then(function (response) {
        displaySuccessToast("Task has been updated.")
    }).catch(function (err) {
        displayErrorToast("Some error has occured.")
    });

    document.getElementById("task-" + id).innerText = desc;
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}

// FUNCTION TO ADD ENTRIES INTO THE LIST OF TO-DO(s).
function add2list(desc, taskid) {
    document.getElementById("notask").classList.add('hideme');
    const entry = document.createElement('li');
    entry.innerHTML =
        `
        <li class="list-group-item d-flex justify-content-between align-items-center">
                    <input id="input-button-${taskid}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                    <div id="done-button-${taskid}"  class="input-group-append hideme">
                        <button class="btn btn-outline-secondary todo-update-task" type="button" id="updtbtn${taskid}">Done</button>
                    </div>
                    <div id="task-${taskid}" class="todo-task">
                        ${desc}
                    </div>
                    <span id="task-actions-${taskid}">
                        <button style="margin-right:5px;" type="button" id="editbtn${taskid}"
                            class="btn btn-outline-warning">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                width="18px" height="20px">
                        </button>
                        <button type="button" class="btn btn-outline-danger" id="deletebtn${taskid}">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                width="18px" height="22px">
                        </button>
                    </span>
            </li>
        `;
    entry.id = `todo-${taskid}`;
    list.appendChild(entry);
    document.querySelector(`#deletebtn${taskid}`).addEventListener("click", () => deleteTask(taskid));
    document.querySelector(`#editbtn${taskid}`).addEventListener("click", () => editTask(taskid));
    document.querySelector(`#updtbtn${taskid}`).addEventListener("click", () => updateTask(taskid));
}