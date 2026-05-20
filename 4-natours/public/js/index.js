import '@babel/polyfill';
import { displayMap } from './mapBox'
import { login , logout} from './login';
import { updateData} from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');


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
        
    login(email, password);     // call login function from login.js
    });
}

if(logOutBtn)   logOutBtn.addEventListener('click',logout); // call logout function from login.js

if(userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateData(name,email);
    });