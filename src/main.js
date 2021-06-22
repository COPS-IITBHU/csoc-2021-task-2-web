import axios from 'axios';
let task_no=2;
export function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

export function displayErrorToast(message) {
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
    window.location.href = '/login';
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
     const userName=document.getElementById("inputUsername").value.trim();
     const passWord=document.getElementById("inputPassword").value.trim();

     if(localStorage.getItem("token"))
     {
         window.location.href='/';
     }

     if(userName==='' && passWord==='')
     {
         displayErrorToast("Please Enter the Information");
         return;
     }
     else
     {
         //displayInfoToast("Please Wait.....")
         const userData={
             "username":userName,
             "password":passWord
         }

         axios({
             url:API_BASE_URL+'auth/login/',
             method:'POST',
             data:userData
            })
        .then(function({data}){
            displaySuccessToast("Login Successful");
            localStorage.setItem("token",data.token);
            window.location.href='/';
        })
        .catch(function(){
            displayErrorToast("Some Error Ocurred! Please Try Again");
        });
     }
     



}

export function addTask(data) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

/******************I was Getting Error here so thats why I have pushed add function in init.js *********************/
            
    //  var newTasklist,newList;
    //  newTasklist = '<li class="list-group-item d-flex justify-content-between align-items-center" id="li-%id%"><input id="input-button-%id%" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"><div id="done-button-%id%"  class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" id="done-btn-%id%">Done</button></div><div id="task-%id%" class="todo-task"> %task%</div><span id="task-actions-%id%"><button style="margin-right:5px;" id="edit-btn-%id%" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width= "18px" height= "20px" > </button><button type="button" class="btn btn-outline-danger" id="dlt-btn-%id%"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"width="18px" height="22px"></button></span></li>';
     
    //      newList= newTasklist.replace(/%id%/g,data.id);
    //      newList= newList.replace('%task%',data.title);
    //      document.querySelector('#tasks').insertAdjacentHTML('beforeend',newList);

    //      let dlt=document.getElementById("dlt-btn-"+data.id);
    //      dlt.addEventListener('click',function(){
    //                 console.log(dlt.id);
    //                 deleteTask(dlt.id.slice(-4));

    //             });

    
    
    

}

export function editTask(id) {
    document.getElementById('task-' + id).classList.toggle('hideme');
    document.getElementById('task-actions-' + id).classList.toggle('hideme');
    document.getElementById('input-button-' + id).classList.toggle('hideme');
    document.getElementById('done-button-' + id).classList.toggle('hideme');
}

export function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    //const dltTask=document.getElementById("li-")
    axios({
        headers:{
            Authorization:'Token '+localStorage.getItem('token')
        },
        url:API_BASE_URL+'todo/'+id+'/',
        method:'delete',
        

    })
    .then(function(data){
        displaySuccessToast('Task Removed Successfully');
        document.getElementById('li-'+id).remove();


    });

}

 export function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    
    let updatedTask=document.getElementById("input-button-"+id).value.trim();
     if(updatedTask==='')
     {
         displayErrorToast("Please Enter the Updated Task");
     }
     else
     {
         const updatedData={
             "title":updatedTask,
         }
    axios({
        headers:{
            Authorization:'Token ' + localStorage.getItem('token'),

        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method:'PUT',
        data:updatedData,


    })
    .then(function(){
        displaySuccessToast("Task Updated Successfully");
        document.getElementById("task-"+id).innerText=updatedTask;
        editTask(id);

    })
    .catch(function(){
        displayErrorToast("Some Error Occured");
    })
     }
    
}



var registerBtn=document.getElementById("register-btn")
var loginBtn=document.getElementById("login-btn")
if(registerBtn)
{
    registerBtn.addEventListener('click',register);
}
if(loginBtn)
{
    loginBtn.addEventListener('click',login);
}

var logoutBtn=document.getElementById("logout");
if(logoutBtn)
{
    logoutBtn.addEventListener('click',logout);
}
