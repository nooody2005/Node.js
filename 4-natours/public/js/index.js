import '@babel/polyfill';
import { displayMap } from './mapBox'
import { login } from './login';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');


//DELETION
if(mapBox){
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    
    displayMap(locations);
}
if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        //VAlues
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
    login(email, password);
    });
}

