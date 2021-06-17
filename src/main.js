import axios from 'axios';
import {makeTask} from './init';

function displaySuccessToast(message) {
    iziToast.success({
      title: "Success",
      message: message,
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

function loginFieldsAreValid(userName, password) {
    if (userName === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}

function login() {
    
    const userName = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (loginFieldsAreValid(userName, password)) {
        displayInfoToast("Please wait...");

        const userData = {
            username: userName,
            password: password
        };

        axios({
            url : API_BASE_URL + 'auth/login/',
            method : 'post',
            data : userData
        })
        .then(user => {
            localStorage.setItem('token', user.data.token);
            window.location.href = '/';
        })
        .catch(error => {
            displayErrorToast('Please Enter the Correct Credentials.');
        })
    }
}

function taskIsValid(task) {
    if (task === '') {
        displayErrorToast("Task Title Cannot Be Empty.");
        return false;
    }
    return true;
}

function addTask() {

    const task = document.getElementById('add-task-field').value.trim();

    if (taskIsValid(task)) {
        displayInfoToast("Please wait...");
        const token = localStorage.getItem('token');

        const taskData = {
            title : task
        }
    
        axios({
            method : 'post',
            data : taskData,
            url : API_BASE_URL + 'todo/create/',
            headers : {
                'Authorization' : 'Token ' + token
            }
        })
        .then(res => {
            return (
                axios({
                    url : API_BASE_URL + 'todo/',
                    method : 'get',
                    headers : {
                        'Authorization' : 'Token ' + token
                    }
                })
            );
        })
        .then(tasks => {
            displaySuccessToast("Added Successfully");

            const tasksContainer = document.querySelector('.todo-available-tasks');
            const addedTask = tasks.data[tasks.data.length-1];
            const taskContainer = makeTask(addedTask);
            tasksContainer.appendChild(taskContainer);

            const updateButton = document.getElementById(`update-task-${addedTask.id}`);
            const editButton = document.getElementById(`edit-task-${addedTask.id}`);
            const deleteButton = document.getElementById(`delete-task-${addedTask.id}`);
            updateButton.onclick = () => updateTask(addedTask.id);
            editButton.onclick = () => editTask(addedTask.id);
            deleteButton.onclick = () => deleteTask(addedTask.id);

        })
        .catch(error => {
            displayErrorToast('Could Not Add Task.');
        })
    }
}

function updatesAreValid(title) {
    if (!title) {
        return false;
    }
    return true;
}

function editTask(id) {

    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');

}

function deleteTask(id) {

    displayInfoToast("Please wait...");
    const token = localStorage.getItem('token');

    axios({
        url : API_BASE_URL + `todo/${id}/`,
        method : 'delete',
        headers : {
            'Authorization' : `Token ${token}`
        }
    })
    .then(res => {
        displaySuccessToast("Removed Successfully");
        const childEl = document.getElementById(`input-button-${id}`);
        childEl.parentElement.parentElement.removeChild(childEl.parentElement);
    })
    .catch(error => {
        displayErrorToast('Could Not Delete Task.');
    })
}

function updateTask(id) {

    displayInfoToast("Please wait...");
    const newTitle = document.getElementById(`input-button-${id}`).value.trim();
    const token = localStorage.getItem('token');
    
    if (updatesAreValid(newTitle)) {

        axios({
            url : API_BASE_URL + `todo/${id}/`,
            method : 'put',
            headers : {
                'Authorization' : `Token ${token}`
            },
            data : {
                title : newTitle
            }
        })
        .then(res => {
            displaySuccessToast("Updated Successfully.");

            const titleContainer = document.getElementById(`task-${id}`);
            titleContainer.textContent = res.data.title;

            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
        })
        .catch(error => {
            displayErrorToast('Could Not Update Task.');
        })

    } else {
        displayErrorToast('Task Title Cannot Be Empty.');

        document.getElementById('task-' + id).classList.remove('hideme');
        document.getElementById('task-actions-' + id).classList.remove('hideme');
        document.getElementById('input-button-' + id).classList.add('hideme');
        document.getElementById('done-button-' + id).classList.add('hideme');
    }
}

export {
    updateTask,
    deleteTask,
    editTask,
    addTask,
    login,
    register,
    logout
}

