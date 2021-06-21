 const token = localStorage.getItem('token');
 console.log(token);
 if(token){
    window.location.href = '/';
 }
