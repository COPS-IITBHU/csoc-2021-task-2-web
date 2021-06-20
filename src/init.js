import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
import { addElement } from "./main";
//******** CREATING GLOBAL VAR FOR AUTHORIZATION **********//
const config={
    headers: {
        Authorization: "Token " + localStorage.getItem("token")
    },
};

//******** GET TASK FUNCTION **********//
function getTasks() {
     iziToast.info({
        title: "Info",
        message: "Loading all Todos!"
    });
    axios
    .get(API_BASE_URL + "todo/",config)
    .then(function (response) {
        const { data } = response;
        for (let task of data) {
            const taskNumber = task.id;
            const Textintodo = task.title;
            addElement( Textintodo, taskNumber);   
        }
        iziToast.destroy();
    });
}

axios
.get(API_BASE_URL + 'auth/profile/',config)
.then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
});
