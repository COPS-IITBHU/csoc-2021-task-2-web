import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

const registerOption = document.querySelector("#registerid");
const loginOption = document.querySelector("#loginid");

if(registerOption) registerOption.onclick = register;
if(loginOption) loginOption.onclick = login;
if(localStorage.getItem("token")){
    document.querySelector("#logout").onclick = logout;
    document.querySelector("#addTask").onclick = addTask;
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
            displaySuccessToast("registration is done");
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function loginFieldsAreValid(username, password){
    if(username === "" || password === ""){
        displayErrorToast("INVALID DETAILS!!");
        return false;
    }
    return true;
}

function login() {
    const uname = document.getElementById("inputUsername").value.trim();
    const pass = document.getElementById("inputPassword").value;
    if(loginFieldsAreValid(uname,pass)){
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            username: uname,
            password: pass
        }

        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest
        })
        .then(function({data, status}){
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        })
        .catch(function(err){
            displayErrorToast("No such account exists. Register Now to Login!");
        })
    }
}

function taskIsValid(task){
    if(task === ''){
        displayErrorToast("Enter Name of the task");
        return false;
    }
    return true;
}

function addTask() {
    const task = document.getElementById("EnterTaskHere").value.trim()
    if(taskIsValid(task)){
        const token = localStorage.getItem("token");
        const DataInput = {
            title: task
        }
        axios({
            headers : {'Authorization' : 'Token ' + token},
            method: "post",
            data: DataInput,
            url: API_BASE_URL + "todo/create/"
        }).then(function(response){
            axios({
                headers: {Authorization: "Token " + localStorage.getItem("token")},
                method: "get",
                url: API_BASE_URL + "todo/"
            }).then(function({data,status}){
                const tasknaam = data[data.length - 1];
                const taskid = tasknaam.id;
                makeEntry(tasknaam, taskid);
            })
        }).catch(function(err){
            displayErrorToast("ERROR !!!");
        })
        document.getElementById("EnterTaskHere").value = "";
    }
}

function editTask(id){
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    const token = localStorage.getItem("token");
    axios({
        headers: {Authorization: "Token " + token},
        method: "delete",
        url: API_BASE_URL + "todo/" + id + "/"
    }).then(res => {
        document.querySelector(`#todo-${id}`).remove();
    }).catch(function(err){
        displayErrorToast("ERROR!! Can't Delete");
    })
}

function updateTask(id) {
     const task = document.getElementById("input-button-" + id).value;
     if(taskIsValid(task)){
        const token = localStorage.getItem("token");
        axios({
            headers: {Authorization: "Token " +token},
            method: "patch",
            url: API_BASE_URL + "todo/" + id + "/",
            data: { title: task }
        }).then(function ({ data, status }) {
            document.getElementById("task-" + id).classList.remove("hideme");
            document.getElementById("task-actions-" + id).classList.remove("hideme");
            document.getElementById("input-button-" + id).classList.add("hideme");
            document.getElementById("done-button-" + id).classList.add("hideme");
            document.getElementById("task-" + id).innerText = task;
        }).catch(function (err) {
            displayErrorToast("ERROR !! Can't Update task");
        })
     }
}

function makeEntry(tasknaam, taskid){
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newEntryTask = document.createElement("F");
    newEntryTask.innerHTML = `
        <input id="input-button-${taskid}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${taskid}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskBtn-${taskid}">Done</button>
        </div>
    
        <div id="task-${taskid}" class="todo-task">
            ${tasknaam}
        </div>
        <span id="task-actions-${taskid}">
            <button style="margin-right:5px;" type="button" id="editTaskBtn-${taskid}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn-${taskid}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    newEntryTask.id = `todo-${taskid}`;
    newEntryTask.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    availableTasks.appendChild(newEntryTask);

    document.querySelector(`#editTaskBtn-${taskid}`).addEventListener("click", () => editTask(taskid));
    document.querySelector(`#updateTaskBtn-${taskid}`).addEventListener("click", () => updateTask(taskid));
    document.querySelector(`#deleteTaskBtn-${taskid}`).addEventListener("click", () => deleteTask(taskid));
    document.getElementById("input-button-" + taskid).value = tasknaam;
 };

 export { makeEntry };