import axios from 'axios';
const config={
    headers: {
        Authorization: "Token " + localStorage.getItem("token")
    },
};

function displaySuccessToast(message) 
{
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message)
{
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) 
{
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() 
{
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) 
{
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

function register() 
{
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
        })
        .then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        })
        .catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function validateLogin(username, password)
{
    if(username === "" || password === "")
    {
        displayErrorToast("Invalid Credentials! Please Try Again.");
        return false;
    }
    return true;
}

function login() 
{
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
    if (!validateLogin(username,password)) return ;

    displayInfoToast("Hang on..While we log you in to the system!");
    axios({
        url: API_BASE_URL + "auth/login/",
        method: "post",
        data: { username, password }
    })
    .then(({ data, status }) => {
        displaySuccessToast("Logged in successfully!");
        localStorage.setItem("token", data.token);
        window.location.href = "/";
    })
    .catch((err) => {
        displayErrorToast("Log in failed! Please check your credentials.");
    });
}

function addTask() 
{
    const newTodo = document.querySelector(".form-control");
    if (newTodo.value.trim() === "") { return ; }
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: { title: newTodo.value.trim() }
    })
    .then(function (response) {
        fetchNewTask(newTodo);
        newTodo.value = "";

    })
    .catch(function (err) {
        displayErrorToast("An error occurred!");
    });
}


function fetchNewTask(newtodo)
{
    axios({
        headers: 
        {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/",
        method: "get"
    })
    .then(function ({ data, status }) {
        createNewElement(data[data.length - 1]); 
        displaySuccessToast("Task Added Successfully");
    })
    .catch(err => {
        displayErrorToast("We are unable to process the request. Try Again Later");
    });
}

function editTask(id) 
{
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) 
{
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
        method: "delete"
    })
    .then(function ({ data, status }) {
        document.querySelector(`#todo-${id}`).remove();
        displaySuccessToast("Task deleted Successfully!");
    })
    .catch(function (err) {
        displayErrorToast("We are unable to process the request. Please try again later!");
    });
}

function updateTask(id) 
{
    const updateText = document.getElementById("input-button-" + id).value;
    const todoText = document.getElementById(`task-${id}`).innerText.trim();
    if (updateText === "") { return; }                 // If new todo is empty or same as previous one,
    if (updateText === todoText)                       //              no backend req is made
    {
        document.getElementById("task-" + id).classList.toggle("hideme");
        document.getElementById("task-actions-" + id).classList.toggle("hideme");
        document.getElementById("input-button-" + id).classList.toggle("hideme");
        document.getElementById("done-button-" + id).classList.toggle("hideme");
        displaySuccessToast("Task Updated Successfully");
        return ;
    }
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
        method: "patch",
        data: { title: updateText }
    })
    .then(function ({ data, status }) {
        document.getElementById("task-" + id).classList.toggle("hideme");
        document.getElementById("task-actions-" + id).classList.toggle("hideme");
        document.getElementById("input-button-" + id).classList.toggle("hideme");
        document.getElementById("done-button-" + id).classList.toggle("hideme");
        document.getElementById("task-" + id).innerText = updateText;
        displaySuccessToast("Task Updated Successfully");
    })
    .catch(function (err) {
        displayErrorToast("We are unable to process the request. Please try again later!");
    });
}

const loginbtn=document.querySelector("#loginButton");
if(loginbtn) loginbtn.addEventListener("click",login);

const registerbtn=document.querySelector("#registerButton");
if(registerbtn) registerbtn.addEventListener("click",register);

const logoutbtn=document.querySelector("#logoutButton");
if(logoutbtn) logoutbtn.addEventListener("click",logout);

const addtaskbtn=document.querySelector('#addTaskButton');
if(addtaskbtn) addtaskbtn.onclick = addTask;

function createNewElement(todo) {
    const tasksContainer = document.querySelector('.todo-available-tasks');
    const newNode = document.createElement("li");
    newNode.innerHTML =
        `
            <input id="input-button-${todo.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${todo.id}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${todo.id}">Done</button>
            </div>
            <div id="task-${todo.id}" class="todo-task">
                ${todo.title}
            </div>
            
            <span id="task-actions-${todo.id}">
                <button style="margin-right:5px;" type="button" id="edit-task-${todo.id}"
                class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                
                <button type="button" class="btn btn-outline-danger" id="delete-task-${todo.id}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    `;
    newNode.id = `todo-${todo.id}`;
    newNode.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    tasksContainer.appendChild(newNode);

    document.querySelector(`#edit-task-${todo.id}`)
        .addEventListener("click", () => editTask(todo.id));
    document.querySelector(`#update-task-${todo.id}`)
        .addEventListener("click", () => updateTask(todo.id));
    document.querySelector(`#delete-task-${todo.id}`)
        .addEventListener("click", () => deleteTask(todo.id));
    document.getElementById("input-button-" + todo.id).value = todo.title;
}

export { createNewElement}; 