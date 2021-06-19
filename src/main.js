import axios from "axios";

if (document.getElementById("loginbtn"))
  document.getElementById("loginbtn").onclick = login;
if (document.getElementById("registerbtn"))
  document.getElementById("registerbtn").onclick = register;
if (document.getElementById("logoutbtn"))
  document.getElementById("logoutbtn").onclick = logout;
if (document.getElementById("addTask"))
  document.getElementById("addTask").onclick = addTask;

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
  window.location.href = "/login/";
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
function loginFieldsAreValid(username, password) {
  if (username === "" || password === "") {
    displayErrorToast("Please fill all the fields correctly.");
    return false;
  }

  return true;
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
      .then(({ data, status }) => {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      })
      .catch((err) =>
        displayErrorToast(
          "An account using same email or username is already created"
        )
      );
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

  if (loginFieldsAreValid(username, password)) {
    displayInfoToast("Please wait...");
    axios({
      url: API_BASE_URL + "auth/login/",
      method: "post",
      data: { username, password },
    })
      .then(({ data, status }) => {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      })
      .catch((err) =>
        displayErrorToast("Either username or password is incorrect.")
      );
  }
}

function addTask() {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to add the task to the backend server.
   * @todo 2. Add the task in the dom.
   */

  const currTask = document.getElementById("currtask").value;

  axios({
    url: API_BASE_URL + "todo/create/",
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    method: "post",
    data: { title: currTask },
  })
    .then(({ data, status }) => {
      axios({
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/",
        method: "get",
      }).then(({ data, status }) => {
        const task = data[data.length - 1];

        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${task.id}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button>
        </div>
        <div id="task-${task.id}" class="todo-task">
            ${task.title}
        </div>
        <span id="task-actions-${task.id}" >
            <button style="margin-right:5px;" type="button" id="edit-button-${task.id}" 
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger delete-btn" id="delete-task-${task.id}" >
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
        `;

        document.getElementById("tasklist").appendChild(li);
        document
          .getElementById("delete-task-" + task.id)
          .addEventListener("click", () => deleteTask(task.id));
        document
          .getElementById("done-button-" + task.id)
          .addEventListener("click", () => updateTask(task.id));
        document
          .getElementById("edit-button-" + task.id)
          .addEventListener("click", () => editTask(task.id));
      });
    })
    .catch((err) => displayErrorToast("Error while adding the task"));
}

function editTask(id) {
  let text = document.getElementById("task-" + id).innerText;
  console.log(text);
  document.getElementById("task-" + id).classList.add("hideme");
  document.getElementById("task-actions-" + id).classList.add("hideme");
  document.getElementById("input-button-" + id).classList.remove("hideme");
  document.getElementById("input-button-" + id).value = text;
  document.getElementById("done-button-" + id).classList.remove("hideme");
}

function deleteTask(id) {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to delete the task to the backend server.
   * @todo 2. Remove the task from the dom.
   */

  let item = document.getElementById("input-button-" + id);
  let listItem = item.parentElement;
  listItem.parentNode.removeChild(listItem);
  {
    axios({
      url: API_BASE_URL + "todo/" + id + "/",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      method: "delete",
    })
      .then(({ data, status }) =>
        displaySuccessToast("Task Deleted Successfully!")
      )
      .catch((err) => displayErrorToast("Error while deleting the task"));
  }
}

function updateTask(id) {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to update the task to the backend server.
   * @todo 2. Update the task in the dom.
   */
  const updatedTask = document
    .getElementById("input-button-" + id)
    .value.trim();

  axios({
    url: API_BASE_URL + "todo/" + id + "/",
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    method: "patch",
    data: { title: updatedTask },
  })
    .then(({ data, status }) => {
      document.getElementById("task-" + id).innerHTML = updatedTask;
      displaySuccessToast("Task Updated Successfully!");
    })
    .catch((err) => displayErrorToast("Error while updating the task"));

  document.getElementById("task-" + id).classList.remove("hideme");
  document.getElementById("task-actions-" + id).classList.remove("hideme");
  document.getElementById("input-button-" + id).classList.add("hideme");

  document.getElementById("done-button-" + id).classList.add("hideme");
}
