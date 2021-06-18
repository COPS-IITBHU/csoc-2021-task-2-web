import axios from "axios";
function displaySuccessToast(message) {
    iziToast.success({
        title: "Success",
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: "Error",
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: "Info",
        message: message
    });
}

const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";


const registerButton = document.querySelector("#register-button");
if (registerButton) 
{
    registerButton.addEventListener('click',register)
}
const loginButton = document.querySelector("#login-button");
if (loginButton)
{
    loginButton.addEventListener('click',login)
}


if (localStorage.getItem("token")) {
   const logoutButton= document.querySelector("#logout-button");
   logoutButton.addEventListener('click',logout);

   const addButton= document.querySelector("#add-task");
   addButton.addEventListener('click',addTask);

   
}


function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login/";
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === "" || lastName === "" || email === "" || username === "" || password === "") {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        displayErrorToast("Please enter a valid email address.");
        return false;
    }
    return true;
}

function loginFieldsAreValid(username, password) {
    if (username === "" || password === "") {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById("inputFirstName").value.trim();
    const lastName = document.getElementById("inputLastName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
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
                console.log(data.token);
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            })
            .catch(function (err) {
                displayErrorToast("An account using same email or username is already created");
            });
    }
}

function login() {
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");

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
                displayErrorToast("Either username or password is incorrect.");
            });
    }
}

function addTask() {
    const  textmain = document.querySelector(".todo-add-task input").value.trim();

    if (!textmain) {
        return;
    }
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: { title: textmain }
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
                newList(textmain, taskNo);
            });
        })
        .catch(function (err) {
            displayErrorToast("An error occurred");
        });
}

function newList(Text, listNo) {
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newTaskNode = document.createElement("li");
    newTaskNode.innerHTML = `
        <input id="input-button-${listNo}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${listNo}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${listNo}">Done</button>
        </div>
    
        <div id="task-${listNo}" class="todo-task">
            ${Text}
        </div>
        <span id="task-actions-${listNo}">
            <button style="margin-right:5px;" type="button" id="edit-task-${listNo}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="delete-task-${listNo}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    newTaskNode.id = `todo-${listNo}`;
    newTaskNode.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    availableTasks.appendChild(newTaskNode);

    document.querySelector(`#edit-task-${listNo}`).addEventListener("click", () => editTask(listNo));
    document.querySelector(`#update-task-${listNo}`).addEventListener("click", () => updateTask(listNo));
    document.querySelector(`#delete-task-${listNo}`).addEventListener("click", () => deleteTask(listNo));
    document.getElementById("input-button-" + listNo).value = Text;
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
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
        method: "delete"
    })
        .then(function ({ data, status }) {
            document.querySelector(`#todo-${id}`).remove();
        })
        .catch(function (err) {
            displayErrorToast("An error occurred");
        });
}

function updateTask(id) {
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
            displayErrorToast("An error occurred");
        });
}






export { newList };
