import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    
     axios({
        headers: {Authorization: "Token " + localStorage.getItem('token')},
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data, status}) {
        console.log(data);
        // console.log(data.length)
        for(let i=0;i<data.length;i++){
            var node = document.createElement("div");
            document.getElementById("task_list").appendChild(node).innerHTML=`
                 <li class="list-group-item d-flex justify-content-between align-items-center">
                       <input id="input-button-${i+3}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                       <div id="done-button-${i+3}" class="input-group-append hideme">
                           <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(2)">Done</button>
                       </div>
   
                       <div id="task-${i+3}" class="todo-task">
                        ${data[i].title}
                       </div>
                       <span id="task-actions-${i+3}">
                           <button style="margin-right:5px;" type="button" onclick="editTask(2)"
                               class="btn btn-outline-warning">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                   width="18px" height="20px">
                           </button>
                           <button type="button" class="btn btn-outline-danger" onclick="deleteTask(2)">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                   width="18px" height="22px">
                           </button>
                       </span>
                </li>`;
        }

    }).catch(function(err) {
            console.log("faileed!!!!!!")
    })
    
}

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
