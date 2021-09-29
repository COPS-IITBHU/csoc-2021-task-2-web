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

const loginb=document.getElementById('login');
const registerb=document.getElementById('register');
const logoutb=document.getElementById('logout');
const addTaskb= document.getElementById('addtask');

if(loginb)
{
    loginb.onclick = login;
}
if(registerb)
{
    registerb.onclick = register;
}
if(logoutb)
{
    logoutb.onclick = logout;
}
if(addTaskb){
    addTaskb.onclick = addTask;
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

function loginFieldsAreValid(username,password)
{
    if (username!="" && password!="")
    {
          return true;
    }
    if (password=="")
    {
        displayErrorToast("Password is empty !")
    }
    if (username=="")
    {
          displayErrorToast("Username is empty !")
    }
    return false;

}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;

    if(loginFieldsAreValid(username,password))
    {
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
        .then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        })
        .catch(function(err) {
          displayErrorToast("Invalid Input !");
        })
    }

}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const add_task = document.querySelector(".todo-add-task input").value.trim();


     if (!add_task) {
         displayErrorToast("Enter a valid task !")
         return;
     }
     const dataForApiRequest = {
         title: add_task
     }
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/create/",
         method: "post",
         data: dataForApiRequest
     })
         .then(function (response) {
             axios({
                 headers: {
                     Authorization: "Token " + localStorage.getItem('token')
                 },
                 url: API_BASE_URL + "todo/",
                 method: "get"
             })
             .then(function ({ data,status }) {
                 const new_task = data[data.length - 1];
                 //const idd = new_task.id;
                 add_new_task(add_task,new_task.id);
                 displaySuccessToast("Task Added !");
             });
         })
         .catch(function (err) {
             console.log(err);
             displayErrorToast("Not able to add task !");
         });

         document.getElementById('Enter_task').value='';
}

function add_new_task(add_task, idd){
    const available_tasks = document.querySelector(".todo-available-tasks");
    const new_task = document.createElement("li");
    new_task.innerHTML = `
        <input id="input-button-${idd}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${idd}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask_button-${idd}">Done</button>
        </div>

        <div id="task-${idd}" class="todo-task">
            ${add_task}
        </div>
        <span id="task-actions-${idd}">
            <button style="margin-right:5px;" type="button" id="editTask_button-${idd}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTask_button-${idd}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    new_task.id = `todo-${idd}`;
    new_task.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    available_tasks.appendChild(new_task);

    document.querySelector(`#editTask_button-${idd}`).addEventListener("click", () => editTask(idd));
    document.querySelector(`#updateTask_button-${idd}`).addEventListener("click", () => updateTask(idd));
    document.querySelector(`#deleteTask_button-${idd}`).addEventListener("click", () => deleteTask(idd));
    document.getElementById("input-button-" + idd).value = add_task;
 };

 export {  add_new_task };

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
        .then(function ({ data }) {
            document.querySelector(`#todo-${id}`).remove();
            displaySuccessToast("Task Deleted !")
        })
        .catch(function (err) {
            console.log(err)
            displayErrorToast("Not able to delete task !");
        });
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const update_text = document.getElementById("input-button-" + id).value;
     if (!update_text) {
         return;
     }
     const dataForApiRequest = {
         title: update_text
     }
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: dataForApiRequest
     })
         .then(function ({ data, status }) {
            document.getElementById("task-" + id).innerText = update_text;
             document.getElementById("task-" + id).classList.remove("hideme");
             document.getElementById("task-actions-" + id).classList.remove("hideme");
             document.getElementById("input-button-" + id).classList.add("hideme");
             document.getElementById("done-button-" + id).classList.add("hideme");
             displaySuccessToast("Task Updated !")
         })
         .catch(function (err) {
             displayErrorToast("Not able to update task !");
         });
}
