import axios from "axios";

var logged = 0;
var token = localStorage.getItem("token");
var flag = 0;
var delete_buttons;
var del_id;

function displaySuccessToast(message) {
  iziToast.success({
    title: "Success",
    message: message,
  });
}

function displayErrorToast(message) {
  iziToast.error({
    title: "Error",
    message: message,
  });
}

function displayInfoToast(message) {
  iziToast.info({
    title: "Info",
    message: message,
  });
}

const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login/";
}

function registerFieldsAreValid(
  firstName,
  lastName,
  email,
  username,
  password
) {
  if (
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    username === "" ||
    password === ""
  ) {
    displayErrorToast("Please fill all the fields correctly.");
    return false;
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    displayErrorToast("Please enter a valid email address.");
    return false;
  }
  return true;
}

var button = document.getElementsByClassName(
  "btn btn-outline-success my-2 my-sm-0"
);

if (window.location.href.includes("login")) logged = 0;
else if (window.location.href.includes("register")) logged = 0;
else {
  logged = 1;
  updateTask();
}

if (logged == 0) {
  if (document.getElementById("detect").textContent.trim() == "Register")
    button[0].addEventListener("click", register);
  else if (document.getElementById("detect").textContent.trim() == "Login")
    button[0].addEventListener("click", login);
}

function register() {
  const firstName = document.getElementById("inputFirstName").value.trim();
  const lastName = document.getElementById("inputLastName").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  const username = document.getElementById("inputUsername").value.trim();
  const password = document.getElementById("inputPassword").value;

  if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
    displayInfoToast("Please wait...");

    const dataForApiRequest = {
      name: firstName + " " + lastName,
      email: email,
      username: username,
      password: password,
    };

    axios({
      url: API_BASE_URL + "auth/register/",
      method: "post",
      data: dataForApiRequest,
    })
      .then(function ({ data, status }) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
        console.log(data);
        console.log(status);
      })
      .catch(function (err) {
        displayErrorToast(
          "An account using same email or username is already created"
        );
      });
  }
}

function login() {
  /***
   * @todo Complete this function.
   * @todo 1. Write code for form validation.
   * @todo 2. Fetch the auth token from backend and login the user.
   */
  const username = document.getElementById("inputUsername").value.trim();
  const password = document.getElementById("inputPassword").value;

  // console.log(x[0].value);
  // console.log(x[1].value);
  if (username == "") alert("Username must be filled");
  else if (password == "") alert("Password must be filled");
  else {
    axios({
      url: API_BASE_URL + "auth/login/",
      method: "post",
      data: { username: username, password: password },
    })
      .then(function ({ data, status }) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
        console.log(data.token);
        logged = 1;
      })
      .catch(function (err) {
        displayErrorToast("Wrong credentials");
      });
  }
}

if (logged == 1) {
  var addTaskButton = document.getElementById("addTaskButton");
  console.log(token);
  addTaskButton.addEventListener("click", addTask);
}

if (logged == 1) {
  // delete_button.addEventListener("click", deleteTask);
}

function addTask() {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to add the task to the backend server.
   * @todo 2. Add the task in the dom.
   */
  var task = document.getElementById("task");

  if (task.value == "") alert("Enter some task");
  else {
    axios({
      baseURL: API_BASE_URL + "todo/create/",
      method: "post",
      data: { title: task.value },
      headers: { Authorization: `Token ${token}` },
    })
      .then(function (res) {
        console.log(res.status);
        updateTask();
        location.reload();
        displaySuccessToast("Task added successfully");
        task.value = "";
      })
      .catch(function (err) {
        displayErrorToast(err);
      });
  }
}

function editTask(event) {
  // document.getElementById("task-" + id).classList.add("hideme");
  // document.getElementById("task-actions-" + id).classList.add("hideme");
  // document.getElementById("input-button-" + id).classList.remove("hideme");
  // document.getElementById("done-button-" + id).classList.remove("hideme");
  var id = event.target.nextSibling.id;
  console.log(event.target.parentNode.previousSibling.id);
  console.log(event.target.parentNode.id);
  console.log(
    event.target.parentNode.previousSibling.previousSibling.previousSibling.id
  );
  console.log(event.target.parentNode.previousSibling.previousSibling.id);

  document
    .getElementById(event.target.parentNode.previousSibling.id)
    .classList.add("hideme");
  document.getElementById(event.target.parentNode.id).classList.add("hideme");
  document
    .getElementById(
      event.target.parentNode.previousSibling.previousSibling.previousSibling.id
    )
    .classList.remove("hideme");
  document
    .getElementById(event.target.parentNode.previousSibling.previousSibling.id)
    .classList.remove("hideme");

  var done_buttons = document.getElementsByClassName(
    "btn btn-outline-secondary todo-update-task"
  );

  for (let i = 0; i < done_buttons.length; i++) {
    done_buttons[i].addEventListener("click", (event) => {
      var new_title = event.target.parentNode.previousSibling.value;

      axios({
        baseURL: API_BASE_URL + `todo/${id}/`,
        method: "patch",
        data: { title: new_title },
        headers: { Authorization: `Token ${token}` },
      }).then((response) => {
        // console.log(response.data);
        location.reload();
        // displaySuccessToast("Task Succesfully Deleted");
      });
    });
  }
}

function deleteTask(event) {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to delete the task to the backend server.
   * @todo 2. Remove the task from the dom.
   */
  var id = event.target.id;
  console.log("Del Id = ", id);

  axios({
    baseURL: API_BASE_URL + `todo/${id}`,
    method: "delete",
    headers: { Authorization: `Token ${token}` },
  }).then((response) => {
    location.reload();
    displaySuccessToast("Task Succesfully Deleted");
  });
}

if (logged == 1) {
  var showTodos = document.getElementById("task-1");
  // showTodos.addEventListener("click", updateTask);
}

function updateTask(id) {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to update the task to the backend server.
   * @todo 2. Update the task in the dom.
   */
  axios({
    baseURL: API_BASE_URL + "todo/",
    method: "get",
    headers: { Authorization: `Token ${token}` },
  })
    .then(function (response) {
      use_data(response.data);
      // console.log(response);
    })
    .catch(function (err) {
      displayErrorToast("update");
    });
}

function use_data(res) {
  let all_todos = [];
  let all_id = [];
  for (let i = 0; i < res.length; i++) all_todos.push(res[i].title);
  for (let i = 0; i < res.length; i++) all_id.push(res[i].id);
  // console.log(all_id);
  // console.log(all_todos);
  var todos = document.getElementById("todos");
  if (flag == 0) {
    {
      // console.log("here");
      if (all_todos.length == 0)
        document.getElementsByClassName(
          "badge badge-primary badge-pill todo-available-tasks-text"
        )[0].textContent = "NO TASKS";
      for (let i = 1; i <= all_todos.length; i++) {
        var to_add =
          '<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-' +
          i.toString() +
          '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"/><div id="done-button-' +
          i.toString() +
          '" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button></div><div id="task-' +
          i.toString() +
          '" class="todo-task">' +
          all_todos[i - 1] +
          '</div><span id="task-actions-' +
          i.toString() +
          '"><button style="margin-right: 5px" type="button" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"/></button><button type="button" id = ' +
          all_id[i - 1].toString() +
          ' class="btn btn-outline-danger" ><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"/></button></span></li>';

        todos.innerHTML += to_add;
      }
      flag = 1;
    }
  } else {
    var to_add =
      '<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-' +
      all_todos.length.toString() +
      '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"/><div id="done-button-' +
      all_todos.length.toString() +
      '" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button></div><div id="task-' +
      all_todos.length.toString() +
      '" class="todo-task">' +
      all_todos[all_todos.length - 1] +
      '</div><span id="task-actions-' +
      all_todos.length.toString() +
      '"><button style="margin-right: 5px" type="button" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"/></button><button type="button" id = ' +
      all_id[all_todos.length - 1].toString() +
      'class="btn btn-outline-danger"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"/></button></span></li>';

    todos.innerHTML += to_add;
  }

  var delete_buttons = document.getElementsByClassName(
    "btn btn-outline-danger"
  );
  for (let i = 0; i < delete_buttons.length; i++) {
    delete_buttons[i].addEventListener("click", deleteTask);
  }

  var edit_buttons = document.getElementsByClassName("btn btn-outline-warning");
  for (let i = 0; i < edit_buttons.length; i++) {
    edit_buttons[i].addEventListener("click", editTask);
  }
}
