import '@babel/polyfill';
import {login,logout,signup} from './login';

const logOutBtn = document.querySelector('.logout-btn');
const signinform = document.querySelector('.form-sign');
const loginform = document.querySelector('.form');

if(loginform)
    loginform.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password);
    });

if(logOutBtn) logOutBtn.addEventListener('click', logout);

if(signinform)
    signinform.addEventListener('submit', e=>{
        e.preventDefault();
        const name=document.getElementById('sname').value;
        const email=document.getElementById('semail').value;
        const password=document.getElementById('spassword').value;
        signup(name,email,password);
    });
