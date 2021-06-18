import axios from "axios";
const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

// function for logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login/";
}

// function to display iziToast on Error
function ErrorToast(message) {
    iziToast.error({
        title: "Error",
        message: message
    });
}

// function to display iziToast for showing Information
function InformationToast(message) {
    iziToast.info({
        title: "Info",
        message: message
    });
}




// function to check the authenticity of the entered fields
function CheckRegisteredFields(firstName, lastName, email, username, password) {
    if (firstName === "" || lastName === "" || email === "" || username === "" || password === "") {
        ErrorToast("Please fill details correctly !!!");
        return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        ErrorToast("Please enter a valid email address.");
        return false;
    }
    return true;
}

// function to check the authenticity for login
function CheckLoginValid(username, password) {
    if (username === "" || password === "") {
        ErrorToast("Please fill details correctly !!!");
        return false;
    }
    return true;
}

// function to register the new user
function register() {
    const firstName = document.getElementById("inputFirstName").value.trim();
    const lastName = document.getElementById("inputLastName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;

    if (CheckRegisteredFields(firstName, lastName, email, username, password)) {
        InformationToast("Please wait a little...");

        const dataForApiRequest = {
            name: firstName +" "+ lastName,
            email: email,
            username: username,
            password: password
        };

        axios({
            url: API_BASE_URL + "auth/register/",
            method: "post",
            data: dataForApiRequest
        })
            .then(function ({ data, status }) {
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            })
            .catch(function (err) {
                ErrorToast("An account using same email or username is already created");
            });
    }
}

// function to login 
function login() {
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
    if (CheckLoginValid(username, password)) {
        InformationToast("Please wait...");
        axios({
            url: API_BASE_URL + "auth/login/",
            method: "post",
            data: { username, password }
        })
            .then(function ({ data, status }) {
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            })
            .catch(function (err) {
                ErrorToast("Either username or password is incorrect.");
            });
    }
}

// function to add the task in todo 
function addTask() {
    const todoText = document.querySelector(".todo-add-task input").value.trim();

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
                const newTodo = data[data.length - 1];
                const taskNo = newTodo.id;
                newElement(todoText, taskNo);
            });
        })
        .catch(function (err) {
            ErrorToast("An error occurred");
        });
}


// function of edit the task in todo 
function editTask(id) {
    document.getElementById("task-" + id).classList.add("hideme");
    document.getElementById("task-actions-" + id).classList.add("hideme");
    document.getElementById("input-button-" + id).classList.remove("hideme");
    document.getElementById("done-button-" + id).classList.remove("hideme");
}


// function to delete the task from todo 
function deleteTask(id) {
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
            ErrorToast("An error occurred");
        });
}

// function to update the task in todo 
function updateTask(id) {
    const todoText = document.getElementById("input-button-" + id).value;
    if (!todoText) {
        return;
    }
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
        method: "patch",
        data: { title: todoText }
    })
        .then(function ({ data, status }) {
            document.getElementById("task-" + id).classList.remove("hideme");
            document.getElementById("task-actions-" + id).classList.remove("hideme");
            document.getElementById("input-button-" + id).classList.add("hideme");
            document.getElementById("done-button-" + id).classList.add("hideme");
            document.getElementById("task-" + id).innerText = todoText;
        })
        .catch(function (err) {
            ErrorToast("An error occurred");
        });
}


// function to add the new element in todo 
function newElement(todoText, taskNo) {
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newTaskNode = document.createElement("li");
    newTaskNode.innerHTML = `
        <input id="input-button-${taskNo}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${taskNo}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${taskNo}">Done</button>
        </div>
    
        <div id="task-${taskNo}" class="todo-task">
            ${todoText}
        </div>
        <span id="task-actions-${taskNo}">
            <button style="margin-right:5px;" type="button" id="edit-task-${taskNo}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="delete-task-${taskNo}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    newTaskNode.id = `todo-${taskNo}`;
    newTaskNode.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    availableTasks.appendChild(newTaskNode);

    document
        .querySelector(`#edit-task-${taskNo}`)
        .addEventListener("click", () => editTask(taskNo));
    document
        .querySelector(`#update-task-${taskNo}`)
        .addEventListener("click", () => updateTask(taskNo));
    document
        .querySelector(`#delete-task-${taskNo}`)
        .addEventListener("click", () => deleteTask(taskNo));
    document.getElementById("input-button-" + taskNo).value = todoText;
}

const registerButton = document.querySelector("#register-button");
if (registerButton) registerButton.onclick = register;
const loginButton = document.querySelector("#login-button");
if (loginButton) loginButton.onclick = login;

if (localStorage.getItem("token")) {
    document.querySelector("#logout-button").onclick = logout;
    document.querySelector("#add-task").onclick = addTask;
}

// exporting...
export { editTask, updateTask, deleteTask, newElement };
