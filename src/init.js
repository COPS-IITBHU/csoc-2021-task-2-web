import axios from "axios";
const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

// var token = localStorage.getItem("token");
// console.log("init", token);
// axios({
//   baseURL: API_BASE_URL + "todo/",
//   method: "get",
//   headers: { Authorization: `Token ${token}` },
// })
//   .then(function (response) {
//     getTasks(response.data);
//   })
//   .catch(function (err) {
//     alert("Error");
//   });

// function getTasks(res) {
//   /***
//    * @todo Fetch the tasks created by the user and display them in the dom.
//    */

//   let all_todos = [];
//   let all_id = [];
//   for (let i = 0; i < res.length; i++) all_todos.push(res[i].title);
//   for (let i = 0; i < res.length; i++) all_id.push(res[i].id);
//   var todos = document.getElementById("todos");

//   for (let i = 1; i <= all_todos.length; i++) {
//     var to_add =
//       '<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-' +
//       i.toString() +
//       '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"/><div id="done-button-' +
//       i.toString() +
//       '" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" >Done</button></div><div id="task-' +
//       i.toString() +
//       '" class="todo-task">' +
//       all_todos[i - 1] +
//       '</div><span id="task-actions-' +
//       i.toString() +
//       '"><button style="margin-right: 5px" type="button" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"/></button><button type="button" id = ' +
//       all_id[i - 1].toString() +
//       ' class="btn btn-outline-danger" ><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"/></button></span></li>';

//     todos.innerHTML += to_add;
//   }
// }

axios({
  headers: {
    Authorization: "Token " + localStorage.getItem("token"),
  },
  url: API_BASE_URL + "auth/profile/",
  method: "get",
}).then(function ({ data, status }) {
  document.getElementById("avatar-image").src =
    "https://ui-avatars.com/api/?name=" +
    data.name +
    "&background=fff&size=33&color=007bff";
  document.getElementById("profile-name").innerHTML = data.name;
});
