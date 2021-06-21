import axios from 'axios';

const registerButton = document.querySelector("#register-button");
const loginButton = document.querySelector("#login-button");
const logoutButton= document.querySelector("#logout-button");
const addButton= document.querySelector("#add-task");

if (registerButton)
registerButton.addEventListener('click',register)

if (loginButton)
loginButton.addEventListener('click',login)

if (localStorage.getItem("token"))
{
   logoutButton.addEventListener('click',logout);
   addButton.addEventListener('click',addTask);
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
        };

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

function loginFieldsAreValid(username, password)
{
    if (username === "" || password === "") {
        displayErrorToast("Fill all the required details");
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
     const username = document.getElementById("inputUsername").value.trim();
const password = document.getElementById("inputPassword").value;
if (loginFieldsAreValid(username, password)) {
    const dataForApiRequest = {

        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + "auth/login/",
        method: "post",
        data: dataForApiRequest,
    })
        .then( ({ data, status })=> {

            localStorage.setItem("token", data.token);
            window.location.href = "/";
        })
        .catch( (err) =>{
            displayErrorToast("Invalid details, Try again!!!");
        });
}
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const  todoText = document.querySelector(".todo-add-task input").value.trim();

        if (!todoText) {
            return;
        }
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token")
            },
            url: API_BASE_URL + "todo/create/",
            method: "post",
            data: { title: todoText }
        })
            .then(function (response) {
                axios({
                    headers: {
                        Authorization: "Token " + localStorage.getItem("token")
                    },
                    url: API_BASE_URL + "todo/",
                    method: "get"
                }).then(function ({ data, status }) {

                    const taskNo = data[data.length - 1].id;
                    new_todo_List(todoText, taskNo);
                });
            })
            .catch(function (err) {
                displayErrorToast("Try Again!!!");
            });
    }

    function new_todo_List(Text, number) {
        const availableTasks = document.querySelector(".todo-available-tasks");
        const newTask = document.createElement("li");
        newTask.id = `todo-${number}`;
        newTask.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
        newTask.innerHTML = `
            <input id="input-button-${number}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${number}" class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${number}">Done</button>
            </div>

            <div id="task-${number}" class="todo-task">
                ${Text}
            </div>
            <span id="task-actions-${number}">
                <button style="margin-right:5px;" type="button" id="edit-task-${number}"
                    class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button type="button" class="btn btn-outline-danger" id="delete-task-${number}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>`;
        availableTasks.appendChild(newTask);
        document.getElementById("input-button-" + number).value = Text;
        document.querySelector(".todo-add-task input").value="";
        document.querySelector(`#edit-task-${number}`).addEventListener("click",editTask(number));
        document.querySelector(`#update-task-${number}`).addEventListener("click",updateTask(number));
        document.querySelector(`#delete-task-${number}`).addEventListener("click",deleteTask(number));
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
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "delete"
     })
         .then(function ({ data, status }) {
             document.querySelector(`#todo-${id}`).remove();
         })
         .catch(function (err) {
             displayErrorToast("Try Again!!!");
         });
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const Text = document.getElementById("input-button-" + id).value;
     if (!Text) {
         return;
     }
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: { title: Text }
     })
         .then(function ({ data, status }) {
             document.getElementById("task-" + id).classList.remove("hideme");
             document.getElementById("task-actions-" + id).classList.remove("hideme");
             document.getElementById("input-button-" + id).classList.add("hideme");
             document.getElementById("done-button-" + id).classList.add("hideme");
             document.getElementById("task-" + id).innerText = Text;
         })
         .catch(function (err) {
             displayErrorToast("Try Again!!!");
         });
}


export { new_todo_List }
