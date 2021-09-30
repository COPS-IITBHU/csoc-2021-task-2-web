import axios from 'axios';

const registerB= document.getElementById('register')
const loginB= document.getElementById('login')
const addTaskB= document.getElementById('addTask')
const logoutB= document.getElementById('logout')

if(registerB){
    registerB.onclick = register
}
if(loginB){
    loginB.onclick = login
}
if(addTaskB){
    addTaskB.onclick = addTask;
}
if(logoutB){
    logoutB.onclick = logout
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
function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
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
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;

    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");

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
        displayErrorToast('Invalid password or username!');
        })
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const addT = document.getElementById('form-control').value.trim()
     if(!addT){
         displayErrorToast('Please enter a valid task')
         return
     }
 
     const dataForApiRequest = {
         title: addT
     }
 
     axios({
         url: API_BASE_URL + 'todo/create/',
         method: 'post',
         data: dataForApiRequest,
         headers: {
             Authorization: 'Token '+localStorage.getItem('token')
         }
     }).then(function(status) {
         axios({
             url: API_BASE_URL + 'todo/',
             method: 'get',
             headers: {
                 Authorization: 'Token '+localStorage.getItem('token')   
             },
         }).then(function({data,status}){
         const newdata= data[data.length-1]
         console.log('Adding '+newdata.title+' id:'+newdata.id)
         enterNewData(newdata)
         displaySuccessToast('Successfully added task')
         })
     }).catch(function(err) {
         displayErrorToast('Failed to add Task');
     })
 
     document.getElementById('form-control').value=''
 }
 
 export function enterNewData(newdata){
     let list= document.createElement('li')
     list.className = 'list-group-item d-flex justify-content-between align-items-center'
     list.innerHTML = 
     `<input id="input-button-${newdata.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
     <div id="done-button-${newdata.id}"  class="input-group-append hideme">
         <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask(${newdata.id})">Done</button>
     </div>
     <div id="task-${newdata.id}" class="todo-task">
         ${newdata.title}
     </div>
     <span id="task-actions-${newdata.id}">
         <button style="margin-right:5px;" type="button" id="editTask(${newdata.id})"
             class="btn btn-outline-warning">
             <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                 width="18px" height="20px">
         </button>
         <button type="button" class="btn btn-outline-danger" id="deleteTask(${newdata.id})">
             <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                 width="18px" height="22px">
         </button>
     </span>`
     list.id = 'list-'+newdata.id
     document.getElementById('completeList').appendChild(list)
     document.getElementById('deleteTask('+newdata.id+')').addEventListener('click',function(){
         deleteTask(newdata.id)
     })
     document.getElementById('editTask('+newdata.id+')').addEventListener('click',function(){
         editTask(newdata.id)
     })
     document.getElementById('updateTask('+newdata.id+')').addEventListener('click',function(){
         updateTask(newdata.id)
     })
}

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
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'delete',
        headers: {
            Authorization: 'Token '+localStorage.getItem('token')
        }
    }).then(function({data,status}){
        const delTask= document.getElementById('list-'+id)
        console.log('Deleting '+delTask.id)
        delTask.remove()
        displaySuccessToast('Successfully deleted task')
    }).catch(function(err) {
        displayErrorToast('Failed to delete Task');
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const upd=document.getElementById('input-button-'+id).value.trim()
     if(!upd){
         displayErrorToast('Please enter a valid task')
         return 
     }
    const dataForApiRequest = {
        title: upd
    }

    axios({
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'patch',
        data: dataForApiRequest,
        headers: {
            Authorization: 'Token '+localStorage.getItem('token')
        }
    }).then(function({data,status}){
           const updTask=document.getElementById('task-'+id)
           console.log('Updating '+updTask.id)
           updTask.innerHTML=upd
           displaySuccessToast('Successfully updated task')
    }).catch(function(err) {
           displayErrorToast('Failed to update Task');
      })
    document.getElementById('input-button-'+id).value=''
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}
