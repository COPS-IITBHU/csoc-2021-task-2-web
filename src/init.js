import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
import {editTask,deleteTask,updateTask,displayErrorToast,displaySuccessToast} from './main.js';

//Task Adding Event
function addTask()
{
    const inputTask=document.getElementById("input-task").value.trim();
    if(inputTask==='')
    {
        displayErrorToast("Please Enter Task!");
    }
    else
    {
    const userTask={
        "title":inputTask
    };
    axios({
        headers:
        {
            Authorization:'Token '+localStorage.getItem('token'),
        },
        url:API_BASE_URL+'todo/create/',
        method:"POST",
        data:userTask


    })
    .then(function(data){
        displaySuccessToast("New Task Added");
        getTasks();
    })
    .catch(function(){
        displayErrorToast("Some Error Ocurred");
    });
    document.getElementById("input-task").value='';
}
}
document.getElementById('add-task').addEventListener('click',addTask);


//Getting Task of a Specific User
function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        headers:
        {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url:API_BASE_URL + 'todo/',
        method:'get',



    })
    .then(function({data}){
        document.querySelector('#tasks').innerHTML = '<span class="badge badge-primary badge-pill todo-available-tasks-text">Available tasks!</span>' ;
            
            var newTasklist,newList;
            newTasklist = '<li class="list-group-item d-flex justify-content-between align-items-center" id="li-%id%"><input id="input-button-%id%" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"><div id="done-button-%id%"  class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" id="done-btn-%id%">Done</button></div><div id="task-%id%" class="todo-task"> %task%</div><span id="task-actions-%id%"><button style="margin-right:5px;" id="edit-btn-%id%" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width= "18px" height= "20px" > </button><button type="button" class="btn btn-outline-danger" id="dlt-btn-%id%"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"width="18px" height="22px"></button></span></li>';
            for(var i=0;i<data.length;i++){
                newList= newTasklist.replace(/%id%/g,data[i].id);
                newList= newList.replace('%task%',data[i].title);
                document.querySelector('#tasks').insertAdjacentHTML('beforeend',newList);

                let dlt=document.getElementById("dlt-btn-"+data[i].id);
                let edit=document.getElementById("edit-btn-"+data[i].id);
                let update=document.getElementById("done-btn-"+data[i].id);

                dlt.addEventListener('click',function(){
                    deleteTask(dlt.id.slice(-4));

                });

                edit.addEventListener('click',function(){
                    editTask(edit.id.slice(-4));
                });

                update.addEventListener('click',function(){
                    updateTask(update.id.slice(-4));
                });
                
            }
            
            
        

        })
    .catch(function(){
        displayErrorToast("Some Error Occur");
    });
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
});
