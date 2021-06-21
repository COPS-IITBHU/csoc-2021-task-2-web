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
    window.location.href = './login/';
}

function addTaskrow(task,num) {
    var listItem = document.createElement('li')
    listItem.classList.add("list-group-item","d-flex","justify-content-between","align-items-center")
    listItem.id=`${num}`;
    var value = task.title
    listItem.innerHTML=`<input id="input-button-${num}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${num}"  class="input-group-append hideme">
        <button id="donebtn${num}" class="btn btn-outline-secondary todo-update-task" type="button">Done</button>
    </div>
    <div id="task-${num}" class="todo-task">`
        +value+
    `</div>

    <span id="task-actions-${num}">
        <button id="editbtn${num}" style="margin-right:5px;" type="button"
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button id="delbtn${num}" type="button" class="btn btn-outline-danger">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>`
    document.getElementById('tasks').append(listItem);
    var delBtn=document.getElementById('delbtn'+(num))
    var editBtn=document.getElementById('editbtn'+(num))
    var doneBtn=document.getElementById('donebtn'+(num))

    if(delBtn) {
    delBtn.addEventListener("click",()=>{
        document.getElementById(`${num}`).remove();
        deleteTask(task.id)
        })
    }
    if(editBtn) {
        editBtn.addEventListener("click",()=>{
            editTask(num);
        })
    }
    if(doneBtn) {
        doneBtn.addEventListener("click",()=>{
            var newTask=document.getElementById(`input-button-${num}`).value.trim();
            document.getElementById(`task-${num}`).innerHTML=`${newTask}`;
            updateTask(task.id,num);
        })
    }
}

function getTasks() {
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data, status}) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            var listItem = document.createElement('li')
            listItem.classList.add("list-group-item","d-flex","justify-content-between","align-items-center")
            listItem.id=`${index+1}`;
            var value = element.title
            var list=document.getElementById('tasks');
            listItem.innerHTML=`<input id="input-button-${index+1}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${index+1}"  class="input-group-append hideme">
                <button id="donebtn${index+1}" class="btn btn-outline-secondary todo-update-task" type="button">Done</button>
            </div>
            <div id="task-${index+1}" class="todo-task">`
                +value+
            `</div>

            <span id="task-actions-${index+1}">
                <button id="editbtn${index+1}" style="margin-right:5px;" type="button"
                    class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button id="delbtn${index+1}" type="button" class="btn btn-outline-danger">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>`;
            list.append(listItem);
            var delBtn=document.getElementById('delbtn'+(index+1))
            var editBtn=document.getElementById('editbtn'+(index+1))
            var doneBtn=document.getElementById('donebtn'+(index+1))

            if(delBtn) {
                delBtn.addEventListener("click",()=>{
                    document.getElementById(`${index+1}`).remove();
                    deleteTask(data[index].id);
                })
            }
            if(editBtn) {
                editBtn.addEventListener("click",()=>{
                    editTask(index+1);
                })
            }
            if(doneBtn) {
                doneBtn.addEventListener("click",()=>{
                    var newTask=document.getElementById(`input-button-${index+1}`).value.trim();
                    document.getElementById(`task-${index+1}`).innerHTML=`${newTask}`;
                    updateTask(data[index].id,index+1);
                })
            }
        }
    }).catch(function(err) {
      console.error(err)
    })
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
          console.log(localStorage.token)
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    const username=document.getElementById('inputUsername').value.trim();
    const password=document.getElementById('inputPassword').value.trim();
    const dataForApiloginreq={
        username: username,
        password: password
    }
    
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiloginreq,
    }).then(function({data, status}) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    }).catch(function(err) {
      displayErrorToast('No account found, kindly register first!');
    })
}

function addTask() {
    const tasktitle=document.getElementById('inputTask').value.trim();
    const dataForApiaddtaskreq={
        title: tasktitle
    }

    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiaddtaskreq,
    }).then(function({data,status}){
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function({data,status}){
            addTaskrow(data[data.length-1],data.length);
      })}).catch(function(err) {
      displayErrorToast('Not a valid task!');
    })
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: 'delete',
    }).then(function({data, status}) {
    }).catch(function(err) {
      displayErrorToast("Can't delete the task!");
    })
}

function updateTask(id,i) {
    const tasknewtitle=document.getElementById(`input-button-${i}`).value.trim();
    const dataForApiupdatereq={
        title: tasknewtitle
    }
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: 'patch',
        data: dataForApiupdatereq,
    }).then(function({data, status}) {
        document.getElementById('task-' + i).classList.remove('hideme');
        document.getElementById('task-actions-' + i).classList.remove('hideme');
        document.getElementById('input-button-' + i).classList.add('hideme');
        document.getElementById('done-button-' + i).classList.add('hideme');
    }).catch(function(err) {
      displayErrorToast("Can't update the task!");
    })
}

//Event listners
document.addEventListener('DOMContentLoaded',()=>{
    let logoutBtn=document.getElementById("logoutbtn")
    let registerBtn=document.getElementById("registerbtn")
    let loginBtn=document.getElementById("loginbtn")
    let addtaskBtn=document.getElementById("addtaskbtn")
    if(logoutBtn) {
        logoutBtn.addEventListener("click",logout);
    }
    if(registerBtn) {
        registerBtn.addEventListener("click",register);
    }
    if(loginBtn) {
        loginBtn.addEventListener("click",login);
    }
    if(addtaskBtn) {
        addtaskBtn.addEventListener("click",addTask);
    }
    if(localStorage.getItem('token')) {
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'auth/profile/',
            method: 'get',
        }).then(function({data, status}) {
          document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
          document.getElementById('profile-name').innerHTML = data.name;
          getTasks();
        })
    }
});
