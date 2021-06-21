import axios from 'axios';

const registerButton = document.querySelector("#register-button");
const loginButton = document.querySelector("#login-button");
const logoutButton= document.querySelector("#logout-button");
const addButton= document.querySelector("#add-task");


if (registerButton)
    registerButton.addEventListener('click',register);

if (loginButton)
    loginButton.addEventListener('click',login);


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
    if (username === "" || password === "")
    {
        displayErrorToast("Please fill all the required details..");
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
     if (loginFieldsAreValid(username, password))
     {
     const Api_data = {username: username,password: password}
     axios({
        url: API_BASE_URL + "auth/login/",
        method: "post",
        data: Api_data,
      })
        .then( ({ data, status })=> {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        })
        .catch( (err) =>{
            displayErrorToast("Access Denied, Try again!!!");
        });
     }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const  todo_text = document.querySelector(".todo-add-task input").value.trim();

    if (!todo_text)
        return;
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: { title: todo_text }
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
                new_todo_List(todo_text, taskNo);
            });
        })
        .catch(function (err) {
            displayErrorToast("Try Again!!!!");
        });
}

function new_todo_List(Text, Number)
{
    const availableTasks = document.querySelector(".todo-available-tasks");
    const New_entry = document.createElement("li");
    New_entry.id = `todo-${Number}`;
    New_entry.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
    New_entry.innerHTML = `
        <input id="input-button-${Number}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${Number}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${Number}">Done</button>
        </div>

        <div id="task-${Number}" class="todo-task">
            ${Text}
        </div>
        <span id="task-actions-${Number}">
            <button style="margin-right:5px;" type="button" id="edit-task-${Number}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="delete-task-${Number}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
        `;

    availableTasks.appendChild(New_entry);
    document.querySelector(".todo-add-task input").value="";
    document.getElementById("input-button-" + Number).value = Text;
    document.querySelector(`#update-task-${Number}`).addEventListener("click", () => updateTask(Number));
    document.querySelector(`#delete-task-${Number}`).addEventListener("click", () => deleteTask(Number));
    document.querySelector(`#edit-task-${Number}`).addEventListener("click", () => editTask(Number));
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
        displayErrorToast("Try Again!!!!");
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
        displayErrorToast("Try Again!!!!");
    });
}


export {new_todo_List}
