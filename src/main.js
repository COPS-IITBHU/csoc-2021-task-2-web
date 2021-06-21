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
    const userName = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (!(userName === '' || password === '')) {
        displayInfoToast("Please wait...");

        const userData = {
            username: userName,
            password: password
        };

        axios({
            url : API_BASE_URL + 'auth/login/',
            method : 'post',
            data : userData
        }).then(user => {
            localStorage.setItem('token', user.data.token);
            window.location.href = '/';
        }).catch(error => {
            console.log(error);
            displayErrorToast('Login details are incorrect!');
        })
    }
}

function addTask() {
    const task = document.getElementById("taskInput").value.trim();

    if(task !== ''){
        const token = localStorage.getItem('token');

        axios({
            url: API_BASE_URL + 'todo/create/',
            method: 'post',
            data: {
                title: task
            },
            headers: {
                Authorization: 'Token ' + token
            }
        }).then(response => {
            displaySuccessToast("Successfully added task!");
            putTask(task, JSON.parse(response.config.data).title);
            console.log(response);
            addEventListenerForNewTasks(task);
            $("#taskInput").val("");
        }).catch(error => {
            console.log(error);
            displayErrorToast("Could not add task!")
        })
    }
}

function addEventListenerForNewTasks(task) {
    let id;
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(todos => {
        todos.data.forEach(todo => {
            if (todo.title === task)
                id = todo.id;
        })
    }).catch((error) => {
        console.log(error);
    })
    $("#delete-task-" + id).click(() => {
        deleteTask(id);
    })
    $("#edit-task-" + id).click(() => {
        editTask(id);
    })
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');

    const updateButton = document.querySelector("#update-task-" + id);
    updateButton.addEventListener('click', () => {
        updateTask(id);
    })
}

function deleteTask(id) {
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        data: {
            id: id
        },
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then((response) => {
        displayInfoToast("Removed Task!");
        $("#task-" + id).parent().remove();
        console.log(response);
    }).catch(error => {
        displayErrorToast("Couldn't remove Task");
        console.log(error);
    })
}

function updateTask(id) {
    const newTitle = $("#input-button-" + id).val();

    if (newTitle !== '') {
        axios({
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'put',
            data: {
                title: newTitle
            },
            id: id,
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            }
        }).then((response) => {
            displaySuccessToast("Task edited!");
            showEditedTask(id);
            $("#task-" + id).text(newTitle);
            console.log(response);
        }).catch((error) => {
            displayErrorToast("Couldn't edit task!");
            console.log(error);
        })
    }
}

function showEditedTask(id) {
    $("#input-button-" + id).addClass('hideme');
    $("#done-button-" + id).addClass('hideme');
    $("#task-" + id).removeClass('hideme');
    $("#task-actions-" + id).removeClass('hideme');
}

function putTask(task, title) {
    let item = `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task" />
                    <div id="done-button-${task.id}" class="input-group-append hideme">
                        <button class="btn btn-outline-secondary todo-update-task done-btn" type="button" id="update-task-${task.id}">
                            Done
                        </button>
                    </div>
                    <div id="task-${task.id}" class="todo-task">
                        ${title}
                    </div>
                    <span id="task-actions-${task.id}">
                        <button style="margin-right: 5px;" type="button" id="edit-task-${task.id}" class="btn btn-outline-warning edit-btn">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px"
                            height="20px" >
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-btn" id="delete-task-${task.id}">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px"
                            height="22px" >
                        </button>
                    </span>
                </li>`

    $(".todo-available-tasks").append(item);
}

export {
    login,
    register,
    addTask,
    putTask,
    deleteTask,
    updateTask,
    editTask,
    logout,
    displayErrorToast
}
