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
const config={
    headers: {
        Authorization: "Token " + localStorage.getItem("token")
    },
};

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
        }).then(function ({ data, status }) {
           localStorage.setItem('token', data.token);
           window.location.href = '/';
        }).catch(function (err) {
           displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */

     const user_name = document.getElementById("inputUsername").value.trim();
     const user_pass = document.getElementById("inputPassword").value;
     if (user_name == "" || user_pass == "") {
         displayErrorToast("Please fill the empty fields.");
         return;
     }
 
     displayInfoToast("Checking credentials...");
     axios
         .post(API_BASE_URL + "auth/login/",{
             username: user_name,
             password: user_pass
         })
         .then(({ data, status }) => {
             displaySuccessToast("Successfully logged in!");
             localStorage.setItem("token", data.token);
             window.location.href = "/";
         })
         .catch((err) => {
             displayErrorToast("Cannot Login! :( Check credentials.");
         });
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

     const todoTxt = document.querySelector(".todo-add-task input").value.trim();
     if (!todoTxt) {
         return;
     }
     axios
         .post(API_BASE_URL + "todo/create/",{ title: todoTxt },config)    
         .then(function (response) {
             axios
             .get(API_BASE_URL + "todo/",config)
             .then(function ({ data, status }) {
                 const newTodo = data[data.length - 1];
                 const taskNo = newTodo.id;
                 addElement(todoTxt, taskNo);
                 displaySuccessToast("Task added!");
             });
         })
         .catch(function (err) {
             displayErrorToast("An error occurred!");
         });
}

function editTask(id) {
    document.getElementById("task-" + id).classList.add("hideme");
    document.getElementById("task-actions-" + id).classList.add("hideme");
    document.getElementById("input-button-" + id).classList.remove("hideme");
    document.getElementById("done-button-" + id).classList.remove("hideme");
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */

     axios
     .delete(API_BASE_URL + "todo/" + id + "/",config)
     .then(function ({ data, status }) {
         document.querySelector(`#todo-${id}`).remove();
         displaySuccessToast("Task deleted!");
     })
     .catch(function (err) {
         displayErrorToast("An error occurred!");
     });
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */

     const todoTxt = document.getElementById("input-button-" + id).value;
     if (!todoTxt) {
         return;
     }
     axios
         .patch(API_BASE_URL + "todo/" + id + "/",{ title: todoTxt },config)
         .then(function ({ data, status }) {
             document.getElementById("task-" + id).classList.remove("hideme");
             document.getElementById("task-actions-" + id).classList.remove("hideme");
             document.getElementById("input-button-" + id).classList.add("hideme");
             document.getElementById("done-button-" + id).classList.add("hideme");
             document.getElementById("task-" + id).innerText = todoTxt;
         })
         .catch(function (err) {
             displayErrorToast("An error occurred!");
         });
}

const loginbtn=document.querySelector('#login-btn');
if(loginbtn) loginbtn.onclick= login;
const registerbtn=document.querySelector('#register-btn');
if(registerbtn) registerbtn.onclick= register;

function checklgout() {
    if (localStorage.getItem("token") != undefined) {
        logout();
    }
};
const logoutbtn=document.querySelector('#logoutbtn');
if(logoutbtn) logoutbtn.onclick= checklgout;

function checkaddtask() {
    if (localStorage.getItem("token") != undefined) {
        addTask();
    }
};
const add_task_btn=document.querySelector('#task_add');
if(add_task_btn) add_task_btn.onclick=  checkaddtask;

function addElement(todoTxt, taskno) {
    const container = document.querySelector('.todo-available-tasks');
    const newtask = document.createElement("li");
    newtask.innerHTML =
        `
            <input id="input-button-${taskno}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${taskno}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${taskno}">Done</button>
            </div>
            <div id="task-${taskno}" class="todo-task">
                ${todoTxt}
            </div>
            
            <span id="task-actions-${taskno}">
                <button style="margin-right:5px;" type="button" id="edit-task-${taskno}"
                class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                
                <button type="button" class="btn btn-outline-danger" id="delete-task-${taskno}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    `;
    newtask.id = `todo-${taskno}`;
    newtask.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    container.appendChild(newtask);

    document.querySelector(`#edit-task-${taskno}`)
        .addEventListener("click", () => editTask(taskno));
    document.querySelector(`#update-task-${taskno}`)
        .addEventListener("click", () => updateTask(taskno));
    document.querySelector(`#delete-task-${taskno}`)
        .addEventListener("click", () => deleteTask(taskno));
    document.getElementById("input-button-" + taskno).value = todoTxt;
}

export { editTask, updateTask, deleteTask, addElement};
