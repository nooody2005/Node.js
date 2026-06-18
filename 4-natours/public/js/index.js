import '@babel/polyfill';
import { displayMap } from './mapBox'
import { login , logout} from './login';
import { updateSettings} from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');


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
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form);


        updateSettings(form, 'data');
    });

if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        // to change the innerhtml in button
        document.querySelector('.btn--save-password').textContent =
          'Updating..';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings(
            {
                passwordCurrent, password , passwordConfirm        // pass data in function 
            },
            'password'                // type of data 
        );

        // to reset innerhtml text in button
        document.querySelector('.btn--save-password').textContent = 'Save password';
        // to reset values and remove it from input labels 
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });