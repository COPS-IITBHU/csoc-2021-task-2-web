import axios from 'axios';
import {
    putTask,
    deleteTask,
    editTask,
} from '../src/main.js'

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {     // 25 points (4)
    // /***
    //  * @todo Fetch the tasks created by the user and display them in the dom.
    //  */
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(todos => {
        todos.data.forEach(todo => {
            putTask(todo);
        })
    }).catch(error => {
        console.log("There was an error while fetching tasks!")
        console.log(error);
    })

    addEventListeners();
}

function addEventListeners(){
    const editButtons = $(".edit-btn");
    const deleteButtons = $(".delete-btn");

    editButtons.each((id) => {
        editTask(id);
    })

    deleteButtons.each((id) => {
        deleteTask(id);
    })
   //  for (let i=0; i<deleteButtons.length; i++) {
   //     // const updateButton = updateButtons[i];
   //     const editButton = editButtons[i];
   //     const deleteButton = deleteButtons[i];
   //
   //     const id = updateButtons[i].id.replace('update-task-','');
   //     // updateButton.onclick = () => updateTask(id);
   //     editButton.onclick = () => editTask(id);
   //     deleteButton.onclick = () => deleteTask(id);
   // }
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
