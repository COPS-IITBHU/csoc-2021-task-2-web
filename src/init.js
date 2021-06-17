import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks(data) {

    for(let n=0;n<data.length;n++) {
        console.log(data[n].title);
        const tasks = document.getElementsByClassName('todo-task');
        console.log(tasks[n]);
        tasks[n].innerHTML=data[n].title;
    }

    // data.forEach(Task => {
        
    // });

    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
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
})


function logTasks(){
axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'todo/',
    method: 'get',
}).then(function({data, status}) {
  getTasks(data);

    
})
}

logTasks();

// if( document.getElementById('addTaskButton')){
//     document.getElementById('addTaskButton').onclick = logTasks;
// }

