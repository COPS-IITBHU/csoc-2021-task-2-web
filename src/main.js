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

const login_button = document.querySelector('#login_button');
const registration_button = document.querySelector('#registration_button');
const logout_button = document.querySelector('#logout_button');
const addTask_button = document.querySelector('#addTask_button');

if(login_button)
{
    login_button.onclick = login;
}
if(registration_button)
{
    registration_button.onclick = register;
}
if(logout_button)
{
    logout_button.onclick = logout;
}
if(addTask_button)
{
    addTask_button.onclick = addTask;
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
    if(username === "" || password === ""){
    displayErrorToast("All fields have not been filled.")
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

    if(loginFieldsAreValid(username,password))
    {
        displayInfoToast("Please wait...");
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: {username,password}
        })
        .then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        })
        .catch(function(err) {
          displayErrorToast('ERROR! Provide correct input.');
        })
    }

}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const Entry_task = document.querySelector(".todo-add-task input").value.trim();


     if (!Entry_task) {
         displayErrorToast("ERROR! Invalid task.")
         return;
     }

     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/create/",
         method: "post",
         data: { title: Entry_task }
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
                 const task_no = new_task.id;
                 New_entry(Entry_task, task_no);
                 displaySuccessToast("Task added successfully.");
             });
         })
         .catch(function (err) {
             console.log(err);
             displayErrorToast("ERROR! Unable to add task.");
         });

         document.getElementById('Enter_task').value='';
}

function New_entry(Entry_task, task_no){
    const available_tasks = document.querySelector(".todo-available-tasks");
    const new_task = document.createElement("li");
    new_task.innerHTML = `
        <input id="input-button-${task_no}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${task_no}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask_button-${task_no}">Done</button>
        </div>
    
        <div id="task-${task_no}" class="todo-task">
            ${Entry_task}
        </div>
        <span id="task-actions-${task_no}">
            <button style="margin-right:5px;" type="button" id="editTask_button-${task_no}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTask_button-${task_no}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    new_task.id = `todo-${task_no}`;
    new_task.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    available_tasks.appendChild(new_task);

    document.querySelector(`#editTask_button-${task_no}`).addEventListener("click", () => editTask(task_no));
    document.querySelector(`#updateTask_button-${task_no}`).addEventListener("click", () => updateTask(task_no));
    document.querySelector(`#deleteTask_button-${task_no}`).addEventListener("click", () => deleteTask(task_no));
    document.getElementById("input-button-" + task_no).value = Entry_task;
 };

 export {  New_entry };

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
            displaySuccessToast("Task deleted succeessfully.")
        })
        .catch(function (err) {
            console.log(err)
            displayErrorToast("ERROR! Deletion unsuccessful.");
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
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: { title: update_text }
     })
         .then(function ({ data, status }) {
            document.getElementById("task-" + id).innerText = update_text;
             document.getElementById("task-" + id).classList.remove("hideme");
             document.getElementById("task-actions-" + id).classList.remove("hideme");
             document.getElementById("input-button-" + id).classList.add("hideme");
             document.getElementById("done-button-" + id).classList.add("hideme");
             displaySuccessToast("Task updated successfully.")
         })
         .catch(function (err) {
             displayErrorToast("ERROR! Updation unsuccessful.");
         });
}
