import axios from 'axios';

if (document.getElementById("login")) {
    document.getElementById("login").addEventListener("click", login);
}

if (document.getElementById("register")) {
    document.getElementById("register").addEventListener("click", register);
}


if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", logout);
}

if (document.getElementById("addtask")) {
    document.getElementById("addtask").addEventListener("click", addTask);
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
    displayInfoToast("Please wait...");
    // /***
    //  * @todo Complete this function.
    //  * @todo 1. Write code for form validation.
    //  * @todo 2. Fetch the auth token from backend and login the user.
    //  */
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;
     console.log(username, "   ", password)
 
     const dataForApiRequest = {
         username: username,
         password: password
     }
 
     axios({
         url: API_BASE_URL + 'auth/login/',
         method: 'post',
         data: dataForApiRequest,
 
     }).then(function ({ data, status }) {
 
         localStorage.setItem('token', data.token);
         window.location.href = '/';
     }).catch(function (err) {
         displayErrorToast('Invalid Credentials');
     })

}

function addTask() {
    // /**
    //  * @todo Complete this function.
    //  * @todo 1. Send the request to add the task to the backend server.
    //  * @todo 2. Add the task in the dom.
    //  */
    
    const text = document.getElementById("inputTask").value;
    if (text.length==0) {
        return ;
    }
    else
    {

    

    document.getElementById("inputTask").value = "";
    document.getElementById("inputTask").placeholder = "Enter Task";


    const token = localStorage.getItem('token');

    const dataForApiRequest = {
        title: text
    }

    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: dataForApiRequest,
        headers: {
            Authorization: "Token " + token
        }
    }).then((res) => {
        
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function (res) {
            showTodos(res.data[res.data.length - 1]);
            displaySuccessToast("Task Added");
        })
            .catch((err) => console.log(err))
    }).catch(function (err) {
        displayErrorToast("Task not Added");
    })
}

}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    // /**
    //  * @todo Complete this function.
    //  * @todo 1. Send the request to delete the task to the backend server.
    //  * @todo 2. Remove the task from the dom.
    //  */

    const token = localStorage.getItem('token');

    axios({
        url: `https://todo-app-csoc.herokuapp.com/todo/${id}/`,
        method: 'DELETE',
        headers: {
            Authorization: "Token " + token
        }
    }).then((res) => {

        document.getElementById("task-" + id).parentElement.remove();
        displaySuccessToast("Task Removed");

    }).catch((err) => {
        displayErrorToast("Error In Deleting Task");
    })
}

function updateTask(id) {
    // /**
    //  * @todo Complete this function.
    //  * @todo 1. Send the request to update the task to the backend server.
    //  * @todo 2. Update the task in the dom.
    //  */
    
    const text = document.getElementById("input-button-" + id).value;


    const dataForApiRequest = {
        title: text,
    }

    const token = localStorage.getItem('token');

    axios({
        url: `https://todo-app-csoc.herokuapp.com/todo/${id}/`,
        method: 'PATCH',
        data: dataForApiRequest,
        headers: {
            Authorization: "Token " + token
        }
    }).then((res) => {

        let txt = document.getElementById('task-' + id)
        txt.classList.remove('hideme');
        document.getElementById('task-actions-' + id).classList.remove('hideme');
        document.getElementById('input-button-' + id).classList.add('hideme');
        document.getElementById('done-button-' + id).classList.add('hideme');
        txt.innerHTML = text;
        displaySuccessToast("Task Updated");

    }).catch((err) => {
        displayErrorToast("Error In Updating Task");
    })


}






function showTodos(element) {

    let i = element.id;
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newTaskNode = document.createElement("li");
    newTaskNode.innerHTML = `
        <input id="input-button-${i}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${i}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${i}">Done</button>
        </div>
    
        <div id="task-${i}" class="todo-task">
            ${element.title}
        </div>
        <span id="task-actions-${i}">
            <button style="margin-right:5px;" type="button" id="edit-task-${i}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="delete-task-${i}" >
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;

    newTaskNode.id = `todo-${i}`;
    newTaskNode.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
    newTaskNode.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"


    );
    availableTasks.appendChild(newTaskNode);

    document.querySelector(`#delete-task-${i}`).addEventListener("click", () => deleteTask(`${element.id}`));

    document.querySelector(`#edit-task-${i}`).addEventListener("click", () => editTask(`${element.id}`));

    document.querySelector(`#update-task-${i}`).addEventListener("click", () => updateTask(`${element.id}`));
}

export { showTodos }