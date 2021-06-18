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
    localStorage.removeItem("token");
    window.location.href = "/login/";
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
        }).then(function ({ data, status }) {
            localStorage.setItem("token", data.token);
            window.location.href = '/';
        }).catch(function (err) {
            displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    let userName = document.getElementById("inputUsername").value;
    let pswd = document.getElementById("inputPassword").value;

    axios({
        url: API_BASE_URL + "auth/login/",
        method: "POST",
        data: {
            username: userName,
            password: pswd,
        },
    }).then(function ({ data }) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
    }).catch(function () {
        pswd.value = "";
        displayErrorToast("Invalid Credentials Provided..");
    })

}

function addTask() {
    let inputText = document.getElementById("added-task");
    let task = inputText.value;
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/create/",
        method: "POST",
        data: {
            title: task,
        },
    }).then(function () {

        inputText.value = ""
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token"),
            },
            url: API_BASE_URL + "todo/",
            method: "GET",
            dataType: "json",
        }).then(function ({ data }) {
            newCard(data[data.length - 1])
        })

    }).catch(function({error}){
        displayErrorToast(`${error} entry`);
    })

}

function editTask(id) {
    document.getElementById("task-" + id).classList.add("hideme");
    document.getElementById("task-actions-" + id).classList.add("hideme");
    document.getElementById("input-button-" + id).classList.remove("hideme");
    document.getElementById("done-button-" + id).classList.remove("hideme");
}

function deleteTask(id) {
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: "DELETE",
    }).then(function () {
        document.getElementById("task-" + id).parentElement.remove();
    })


}

function updateTask(id) {
    let updateText = document.getElementById("input-button-" + id);
    let taskBody = document.getElementById("task-" + id);
    let taskButton = document.getElementById("task-actions-" + id);
    let updateButton = document.getElementById("done-button-" + id);

    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: "PUT",
        data: {
            title: updateText.value,
        },
    }).then(function ({ data }) {

        taskBody.textContent = data.title;
        updateText.value = "";
        taskBody.classList.remove("hideme");
        taskButton.classList.remove("hideme");
        updateText.classList.add("hideme");
        updateButton.classList.add("hideme");
    }).catch(function ({ error }) {
        displayErrorToast(`${error} entry`);
        taskBody.classList.remove("hideme");
        taskButton.classList.remove("hideme");
        updateText.classList.add("hideme");
        updateButton.classList.add("hideme");
    })
}

function newCard(data) {

    const list = document.querySelector('.todo-available-tasks')
    let sect = document.createElement('li')
    sect.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    sect.innerHTML = `<input id="input-button-${data.id}" type="text" class="form-control todo-edit-task-input hideme"
            placeholder="Edit The Task" />
          <div id="done-button-${data.id}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task done-task" type="button" id="up-task-${data.id}">
              Done
            </button>
          </div>
          <div id="task-${data.id}" class="todo-task">
            ${data.title}
          </div>
          <span id="task-actions-${data.id}">
            <button style="margin-right: 5px;" type="button" id="task-edit-${data.id}" class="btn btn-outline-warning edit-task">
              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px"
                height="20px" >
            </button>
            <button type="button" class="btn btn-outline-danger del-task" id="delete-Task-${data.id}">
              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px"
                height="22px" >
            </button>
          </span>`
    list.appendChild(sect);
    const done_task = document.querySelector(`#up-task-${data.id}`);
    done_task.addEventListener("click", () => {
        let str = edit_task.id.split("-");
       
        let num = str[2];
        updateTask(parseInt(num));

    })

    const edit_task = document.querySelector(`#task-edit-${data.id}`);

    edit_task.addEventListener("click", () => {
        let str = done_task.id.split("-");

        let num = str[2];
        editTask(parseInt(num));
    })

    const del_task = document.querySelector(`#delete-task-${data.id}`);

    del_task.addEventListener("click", () => {
        let str = del_task.id.split("-");

        let num = str[2];
        deleteTask(parseInt(num));
    })
}


const log_out = document.querySelector("#logout-button");
if (log_out) {
    log_out.addEventListener("click", () => {
        console.log("asfd");
        logout();
    })
}
const add_task = document.getElementById("addTasks");
if (add_task) add_task.addEventListener("click", addTask);
const regB = document.getElementById("register");
if (regB) regB.addEventListener("click", register);
const log_in = document.getElementById("log-in");
if (log_in) log_in.addEventListener("click", login);



