import axios from 'axios';
if(document.getElementById("reg")){
    document.getElementById("reg").addEventListener("click",register);
}

if(document.getElementById("login")){
    document.getElementById("login").addEventListener("click",login);
}

if(document.getElementById("logout")){
    document.getElementById("logout").addEventListener("click",logout);
}

if(document.getElementById("addtask")){
    document.getElementById("addtask").addEventListener("click",addTask);
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

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
     let usrname = document.getElementById("inputUsername").value.trim();
     let pass = document.getElementById("inputPassword").value.trim();
     if(usrname!=null && pass!=null) {
         
         axios({
             url: API_BASE_URL + 'auth/login/',
             method: 'post',
             data: {
                username: usrname,
                password: pass
            },
         }).then(function({data, status}) {
           localStorage.setItem('token', data.token);
           console.log(data.token);
           window.location.href = '/';
         }).catch(function(err) {
           displayErrorToast('error');
           console.log(err);
         })
     }
}

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    let n=0;
    export function addTask(){
        n++;
        console.log(n);
        console.log(document.getElementById("add").value);
        if( !document.getElementById("add").value || document.getElementById("add").value===""){
           // displayErrorToast('No Title');
            return;
        }
        displayInfoToast('please wait');
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token"),
            },
            url: API_BASE_URL + "todo/create/",
            method: "post",
            data: {
                title: document.getElementById("add").value.trim()
            },
        }).then(function({data, status}) {
            axios({
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                },
                url: API_BASE_URL + "todo/",
                method: "get"
            }).then(function ({ data, status }) {
                console.log(data);
                const latest = data[data.length - 1];
                displayTask(latest);
                console.log(latest);
                displaySuccessToast("sucessfully completed!!");
            });
        }).catch(function(err) {
            displayErrorToast("something went wrong")
            console.log(err);
        })
        document.getElementById("add").value="";
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
    document.getElementById("tsklist").appendChild(display);
    document.getElementById("delete-" + task.id).addEventListener("click",function(){
        deleteTask(task.id);
    });
    document.getElementById("edit-" + task.id).addEventListener("click",function(){
        editTask(task.id);
    });
    document.getElementById("update-" + task.id).addEventListener("click",function(){
        updateTask(task.id);
    });
}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

 export function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
     console.log("deleteee")
     console.log(document.getElementById("task-" + id));
     axios({
         url: API_BASE_URL + "todo/"+id+"/",
         headers: {
             Authorization: "Token " + localStorage.getItem("token"),
         },
         method: "delete",
 
     }).then(function({data, status}) {
 
         let toBeDel = document.getElementById("display-" + id);
         toBeDel.parentNode.removeChild(toBeDel);
     }).catch(function(err) {
       displayErrorToast("something went wrong");
       
     })
}

export function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     if(document.getElementById("input-button-" + id).value.trim()) {
        axios({
            url: API_BASE_URL + "todo/"+id+"/",
            headers: {
                Authorization: "Token " + localStorage.getItem("token"),
            },
            method: "patch",
            data: {
                id: id,
                title: document.getElementById("input-button-" + id).value.trim(),
            }

        }).then(function({data, status}) {
            document.getElementById("task-"+ id).innerHTML =document.getElementById("input-button-" + id).value.trim();
            document.getElementById("input-button-" + id).value = "";
            displaySuccessToast("Sucessful");
        }).catch(function(err) {
            displayErrorToast("something went wrong");
        })
    } else {
        displayErrorToast("Enter a title");
    }



    document.getElementById('task-' + i).classList.remove('hideme');
    document.getElementById('task-actions-' + i).classList.remove('hideme');
    document.getElementById('input-button-' + i).classList.add('hideme');
    document.getElementById('done-button-' + i).classList.add('hideme');
}

function id(string) {
    return document.getElementById(string);
}