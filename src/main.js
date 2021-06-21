
/// USERNAME : BlackFlames
/// PASSWORD : amaterasu

import axios from 'axios';

/////////////////////////////////////////////////////
if(id("login")) {
    id("login").addEventListener("click",login);
}

if(id("register")) {
    id("register").addEventListener("click",register);
}

if(id("logout")) {
    id("logout").addEventListener("click",logout);
}

if(id("addTask")) {
    id("addTask").addEventListener("click",addTask);
}




//////////////////////////////////////////////////////
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
    const firstName = id('inputFirstName').value.trim();
    const lastName = id('inputLastName').value.trim();
    const email = id('inputEmail').value.trim();
    const username = id('inputUsername').value.trim();
    const password = id('inputPassword').value;

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
          displayErrorToast('something went wrong');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
        
    let usrname = id("inputUsername").value.trim();
    let pass = id("inputPassword").value.trim();
    if(usrname!=null && pass!=null) {
        displayInfoToast("loading");
        let dataForApiRequest = {
            username: usrname,
            password: pass
        }
        
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('something went wromg');
        })
    }
 
}

export function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    if(!id("add").value || id("add").value == "") {
        //displayErrorToast("empty title");
        return;
    }

    displayInfoToast("loading");
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: {
            title: id("add").value.trim()
        },
    }).then(function({data, status}) {
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token")
            },
            url: API_BASE_URL + "todo/",
            method: "get"
        }).then(function ({ data, status }) {

            const latest = data[data.length - 1];
            displayTask(latest);
    
            displaySuccessToast("done!");
        });
    }).catch(function(err) {
        displayErrorToast("something went wrong")
        
    })

    id("add").value = "";
    
}



export function displayTask(task) {
    let display = document.createElement("li");
    display.className = "list-group-item d-flex justify-content-between align-items-center";
    display.id = "display-" + task.id;
    display.innerHTML = `
    <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${task.id}"  class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-${task.id}">Done</button>
    </div>
    <div id="task-${task.id}" class="todo-task">
        ${task.title}
    </div>

    <span id="task-actions-${task.id}">
        <button style="margin-right:5px;" type="button" id="edit-${task.id}"
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger" id="delete-${task.id}">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>`;
    id("tasklist").appendChild(display);
    id("delete-" + task.id).addEventListener("click",function(){
        deleteTask(task.id);
    });
    id("edit-" + task.id).addEventListener("click",function(){
        editTask(task.id);
    });
    id("update-" + task.id).addEventListener("click",function(){
        updateTask(task.id);
    });
}


export function editTask(i) {
    id('task-' + i).classList.add('hideme');
    id('task-actions-' + i).classList.add('hideme');
    id('input-button-' + i).classList.remove('hideme');
    id('done-button-' + i).classList.remove('hideme');
  
}

export function deleteTask(i) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */

  
    axios({
        url: API_BASE_URL + "todo/"+i+"/",
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        method: "delete",

    }).then(function({data, status}) {
        
        let toBeDel = id("display-" + i);
        toBeDel.parentNode.removeChild(toBeDel);

        // id("input-button-" + i).remove();
        // id("delete-" + i).remove();
        // id("edit-" + i).remove();
        // id("done-button-" + i).remove();
        // id("task-actions-" + i).remove();
        // id("task-" + i).remove();
    }).catch(function(err) {
      displayErrorToast("something went wrong");
     
    })
}

export function updateTask(i) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */


    if(id("input-button-" + i).value.trim()) {
        axios({
            url: API_BASE_URL + "todo/"+i+"/",
            headers: {
                Authorization: "Token " + localStorage.getItem("token"),
            },
            method: "patch",
            data: {
                id: i,
                title: id("input-button-" + i).value.trim(),
            }
    
        }).then(function({data, status}) {
            id("task-"+ i).innerHTML = id("input-button-" + i).value.trim();
            id("input-button-" + i).value = "";
            displaySuccessToast("done");
        }).catch(function(err) {
            displayErrorToast("something went wrong");
        })
    } else {
        displayErrorToast("no title entered");
    }



    id('task-' + i).classList.remove('hideme');
    id('task-actions-' + i).classList.remove('hideme');
    id('input-button-' + i).classList.add('hideme');
    id('done-button-' + i).classList.add('hideme');
    
}

//////////////////// ********************************** \\\\\\\\\\\\\\\\\\\\\\\\\\

function id(string) {
    return document.getElementById(string);
}


