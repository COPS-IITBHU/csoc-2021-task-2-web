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


// LOGOUT FUNCTION
var el = document.getElementById('logout_btn');
if(el){
  el.addEventListener('click', logout, false);
}
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
    console.log('logout success');
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


// REGISTRATION FUNCTION
var el = document.getElementById('register_btn');
if(el){
  el.addEventListener('click', register, false);
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

// LOGIN FUNCTION
var el = document.getElementById('login_btn');
if(el){
  el.addEventListener('click', login, false);
}
function login() {

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
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
      displayErrorToast('Cannot Login!');
    })
}


// ADDING A NEW TASK
const ul = document.getElementById('task_list');
const listItems = ul.getElementsByTagName('li');

var el = document.getElementById('add_task_btn');
if(el){
  el.addEventListener('click', addTask, false);
}
function addTask() {
    
     var new_task = document.getElementById('new_task').value;
    //  console.log(new_task);
     var node = document.createElement("div");
    if(new_task){
        const id = listItems.length+1;
            // console.log(id);
            document.getElementById("task_list").appendChild(node).innerHTML=`
                 <li class="list-group-item d-flex justify-content-between align-items-center">
                       <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                       <div id="done-button-${id}" class="input-group-append hideme">
                           <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(2)">Done</button>
                       </div>
   
                       <div id="task-${id}" class="todo-task">
                        ${new_task}
                       </div>
                       <span id="task-actions-${id}">
                           <button style="margin-right:5px;" type="button" onclick="editTask(2)"
                               class="btn btn-outline-warning">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                   width="18px" height="20px">
                           </button>
                           <button type="button" class="btn btn-outline-danger" onclick="deleteTask(2)">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                   width="18px" height="22px">
                           </button>
                       </span>
                </li>`;

                axios({
                    headers: {Authorization: "Token " + localStorage.getItem('token')},
                    url: API_BASE_URL + 'todo/create/',
                    method: 'post',
                    data: {title:new_task},
                }).then(function({data, status}) {
                    // console.log("task added")
                    displaySuccessToast("New Task Added!!")

                }).catch(function(err) {
                        displayErrorToast('Task cannot be added!');
                })

               
    }else{
        displayErrorToast("Empty task cannot be added!");
    }
}
// EDITING TASK 

function editTask(id) {
    // const id = listItems.length;
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
        headers: {Authorization: "Token " + localStorage.getItem('token')},
        url: API_BASE_URL + 'todo'+id+'/',
        method: 'delete',
        
    }).then(function({data, status}) {
        document.querySelector(`#todo-${id}`).remove();        
        displaySuccessToast("Task Deleted!!")

    }).catch(function(err) {
            displayErrorToast('Task cannot be deleted!');
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
