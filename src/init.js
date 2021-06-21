import axios from 'axios';
import {addROW} from './main.js';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';



axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
})



axios({
  headers: {
      Authorization: 'Token ' + localStorage.getItem('token'),
  },
  url: API_BASE_URL + 'todo/',
  method: 'get',
}).then(function({data, status}) { 
  if(data.length>0){
    
    data.forEach(function(task){
      addROW(task);
    })
  }  
  
})