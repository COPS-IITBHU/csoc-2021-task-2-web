import axios from "axios";
const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

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

function getTasks() {
  /***
   * @todo Fetch the tasks created by the user and display them in the dom.
   */
  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/",
    method: "get",
  }).then(({ data, status }) => {
    for (let i of data) {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <input id="input-button-${i.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-${i.id}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button>
        </div>
        <div id="task-${i.id}" class="todo-task">
            ${i.title}
        </div>
        <span id="task-actions-${i.id}" >
            <button style="margin-right:5px;" type="button" id="edit-button-${i.id}" 
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger delete-btn" id="delete-task-${i.id}" >
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
        `;

      document.getElementById("tasklist").appendChild(li);
      document
        .getElementById("delete-task-" + i.id)
        .addEventListener("click", () => deleteTask(i.id));
      document
        .getElementById("done-button-" + i.id)
        .addEventListener("click", () => updateTask(i.id));
      document
        .getElementById("edit-button-" + i.id)
        .addEventListener("click", () => editTask(i.id));
    }
  });
}
axios({
  headers: {
    Authorization: "Token " + localStorage.getItem("token"),
  },
  url: API_BASE_URL + "auth/profile/",
  method: "get",
}).then(({ data, status }) => {
  document.getElementById("avatar-image").src =
    "https://ui-avatars.com/api/?name=" +
    data.name +
    "&background=fff&size=33&color=007bff";
  document.getElementById("profile-name").innerHTML = data.name;
  getTasks();
});

function editTask(id) {
  let text = document.getElementById("task-" + id).innerText;
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
