import axios from 'axios';
import { editTask , updateTask , deleteTask , isEmpty} from './main';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    
     axios({
        headers: {Authorization: "Token " + localStorage.getItem('token')},
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data, status}) {
        isEmpty();
        for(let i=0;i<data.length;i++){
            var node = document.createElement("div");
            document.getElementById("task_list").appendChild(node).innerHTML=`
                 <li class="list-group-item d-flex justify-content-between align-items-center" id="list_item_${data[i].id}">
                       <input id="input-button-${data[i].id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                       <div id="done-button-${data[i].id}" class="input-group-append hideme">
                           <button class="btn btn-outline-secondary todo-update-task" type="button" id="update_task_btn_${data[i].id}">Done</button>
                       </div>
   
                       <div id="task-${data[i].id}" class="todo-task">
                        ${data[i].title}
                       </div>
                       <span id="task-actions-${data[i].id}">
                           <button style="margin-right:5px;" type="button" id="edit_task_btn_${data[i].id}"
                               class="btn btn-outline-warning">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                   width="18px" height="20px">
                           </button>
                           <button type="button" class="btn btn-outline-danger" id="delete_task_btn_${data[i].id}">
                               <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                   width="18px" height="22px">
                           </button>
                       </span>
                </li>`;
                // console.log(data[i].id);
                document.querySelector(`#edit_task_btn_${data[i].id}`).addEventListener("click", () => editTask(data[i].id));
                document.querySelector(`#update_task_btn_${data[i].id}`).addEventListener("click", () => updateTask(data[i].id));
                document.querySelector(`#delete_task_btn_${data[i].id}`).addEventListener("click", () => deleteTask(data[i].id));

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

