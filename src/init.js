import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
// import {editTask,updateTask,deleteTask} from './main.js';

function getTasks() {
  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/",
    method: "GET",
  }).then(function ({ data }) {
    data.forEach((card) => {
      getCard(card)
    });
  })

}

axios({
  headers: {
    Authorization: 'Token ' + localStorage.getItem('token'),
  },
  url: API_BASE_URL + 'auth/profile/',
  method: 'get',
}).then(function ({ data, status }) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
})

function getCard(data) {
  let sect = document.createElement('li')
  sect.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  const list = document.querySelector('.todo-available-tasks')


  sect.innerHTML = `<input id="input-button-${data.id}" type="text" class="form-control todo-edit-task-input hideme"
          placeholder="Edit The Task" />
        <div id="done-button-${data.id}" class="input-group-append hideme">
          <button class="btn btn-outline-secondary todo-update-task done-task" type="button" id="up-task-${data.id}">
            Done
          </button>
        </div>
        <div id="task-${data.id}" class="todo-task">
          ${data.title}
        </div>
        <span id="task-actions-${data.id}">
          <button style="margin-right: 5px;" type="button" id="task-edit-${data.id}" class="btn btn-outline-warning edit-task">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px"
              height="20px" >
          </button>
          <button type="button" class="btn btn-outline-danger del-task" id="delete-Task-${data.id}">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px"
              height="22px" >
          </button>
        </span>`
  list.appendChild(sect)
  const done_task = document.querySelector(`#up-task-${data.id}`);
  done_task.addEventListener("click", () => {
    let str = edit_task.id.split("-");

    let num = str[2];
    updateTask(parseInt(num));

  })

  const edit_task = document.querySelector(`#task-edit-${data.id}`);

  edit_task.addEventListener("click", () => {
    let str = done_task.id.split("-");

    let num = str[2];
    editTask(parseInt(num));
  })

  const del_task = document.querySelector(`#delete-task-${data.id}`);

  del_task.addEventListener("click", () => {
    let str = del_task.id.split("-");

    let num = str[2];
    deleteTask(parseInt(num));
  })
}

function editTask(id) {
  document.getElementById("task-" + id).classList.add("hideme");
  document.getElementById("task-actions-" + id).classList.add("hideme");
  document.getElementById("input-button-" + id).classList.remove("hideme");
  document.getElementById("done-button-" + id).classList.remove("hideme");
}

function updateTask(id) {
  let updateText = document.getElementById("input-button-" + id);
  let taskBody = document.getElementById("task-" + id);
  let taskButton = document.getElementById("task-actions-" + id);
  let updateButton = document.getElementById("done-button-" + id);

  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + `todo/${id}/`,
    method: "PUT",
    data: {
      title: updateText.value,
    },
  }).then(function ({ data }) {

    taskBody.textContent = data.title;
    updateText.value = "";
    taskBody.classList.remove("hideme");
    taskButton.classList.remove("hideme");
    updateText.classList.add("hideme");
    updateButton.classList.add("hideme");
  }).catch(function ({ error }) {
    displayErrorToast(`${error}`);
    taskBody.classList.remove("hideme");
    taskButton.classList.remove("hideme");
    updateText.classList.add("hideme");
    updateButton.classList.add("hideme");
  })

}

function deleteTask(id) {
  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + `todo/${id}/`,
    method: "DELETE",
  }).then(function () {
    document.getElementById("task-" + id).parentElement.remove();
  })
}
function displayErrorToast(message) {
  iziToast.error({
    title: 'Error',
    message: message
  });
}