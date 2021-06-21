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

var valueCurr,valueNew;
const regButton = document.querySelector("#register-button");
const logInButton = document.querySelector("#login-button");

if(regButton) {

    regButton.onclick = register;
}

if(logInButton) {

    logInButton.onclick = login;
}
if (localStorage.getItem("token")) {
    document.querySelector("#logout-button").onclick = logout;
    document.querySelector("#addTasks").onclick = addTask;
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
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value; 

     if (logFieldsCheck(username, password)) {
         displayInfoToast("We are processing your request.");

         const dataForApiRequest = {
             username: username,
             password: password
         }

         axios({
             url: API_BASE_URL + 'auth/login/',
             method: 'post',
             data: dataForApiRequest,
         }).then(function({data, status}) {
           localStorage.setItem('token', data.token);
           window.location.href = '/';
         }).catch(function(err) {
           displayErrorToast('Account does not Exist ! PLease try making a new one.');
         })
    }
     
}

function addTask() {
    const taskEntry = document.querySelector(".todo-add-task input").value.trim();
    


     if (!taskEntry) {
         displayErrorToast("No Task entered. Please enter task.")
         return;
     }

     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/create/",
         method: "post",
         data: { title: taskEntry }
     })
         .then(function (response) {
             axios({
                 headers: {
                     Authorization: "Token " + localStorage.getItem("token")
                 },
                 url: API_BASE_URL + "todo/",
                 method: "get"
             }).then(function ({ data, status }) {
                 const newtask = data[data.length - 1];
                 const taskNo = newtask.id;
                 newEntry(taskEntry, taskNo)
             });
         })
         .catch(function (err) {
             console.log(err)
             displayErrorToast("Error encountered");
         });

         document.getElementById('added-task').value='';
         console.log("Added Task - " + taskEntry )
         console.log("Task added successfully")
}

function editTask(id) {
    valueCurr=document.getElementById('input-button-' + id).value;
    console.log("Previous Value - " + valueCurr)
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
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
            displaySuccessToast("Task Deleted");
            console.log("Task successfully Deleted !")
        })
        .catch(function (err) {
            console.log(err)
            displayErrorToast("Error Encountered while deleting");
        });
}

function updateTask(id) {
    let updateText = document.getElementById("input-button-" + id);
    let taskBody = document.getElementById("task-" + id);
    let taskButton = document.getElementById("task-actions-" + id);
    let updateButton = document.getElementById("done-button-" + id);

    valueNew= updateText.value;
    console.log("Updated Value - " + valueNew)
    console.log("Tasked Edited and Updated")
     const editEntry = updateText.value;
     displaySuccessToast("Task Updated");

     if (!editEntry) 
     {
         return;
     }

     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: { title: editEntry }
     })
         .then(function ({ data, status }) {
             taskBody.classList.remove("hideme");
             taskButton.classList.remove("hideme");
             updateText.classList.add("hideme");
             updateButton.classList.add("hideme");
             taskBody.innerText = editEntry;
             
             
         })
         .catch(function (err) {
             console.log(err)
             displayErrorToast("An error occurred");
             taskBody.classList.remove("hideme");
             taskButton.classList.remove("hideme");
             updateText.classList.add("hideme");
             updateButton.classList.add("hideme");
         });
         
}

function logFieldsCheck(username,password){
    if (username === '' || password === '') {
        displayErrorToast("Uh Oh ! Looks Like Fields are not filled properly.");
        return false;
    }
    return true;

}


function newEntry(editEntry, taskNo){
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newEntryTask = document.createElement("li");
    newEntryTask.innerHTML = `
        <input id="input-button-${taskNo}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${taskNo}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskBtn-${taskNo}">Done</button>
        </div>
    
        <div id="task-${taskNo}" class="todo-task">
            ${editEntry}
        </div>
        <span id="task-actions-${taskNo}">
            <button style="margin-right:5px;" type="button" id="editTaskBtn-${taskNo}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn-${taskNo}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    
    newEntryTask.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    
    availableTasks.appendChild(newEntryTask);
    newEntryTask.id = `todo-${taskNo}`;

    document.querySelector(`#editTaskBtn-${taskNo}`).addEventListener("click", () => editTask(taskNo));
    document.querySelector(`#updateTaskBtn-${taskNo}`).addEventListener("click", () => updateTask(taskNo));
    document.querySelector(`#deleteTaskBtn-${taskNo}`).addEventListener("click", () => deleteTask(taskNo));
    document.getElementById("input-button-" + taskNo).value = editEntry;
 };


 export {newEntry};
