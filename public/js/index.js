import '@babel/polyfill';
import {login,logout} from './login';

const logOutBtn = document.querySelector('.logout-btn');
const loginform = document.querySelector('.form');

if(loginform)
    loginform.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password);
    });

if(logOutBtn) logOutBtn.addEventListener('click', logout);
