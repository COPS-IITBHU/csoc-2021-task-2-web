import axios from 'axios';
import { showTask } from './main';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        headers: {
            Authorization: 'Token '+ localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data, status}){
        console.log(data);
        const available_tasks = document.getElementById('');
        for(let task of data){
            showTask(task.id,task.title);
        }
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
