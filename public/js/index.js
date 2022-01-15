import '@babel/polyfill';
import {login,logout,signup} from './login';

const loginform = document.querySelector('.form');
const loginform1 = document.querySelector('.form1');
const signinform = document.querySelector('.form-sign');
const signinform1 = document.querySelector('.form-sign1');
const logOutBtn = document.querySelector('.logout-btn');

if(loginform)
    loginform.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password,"users");
    });
    
if(loginform1)
    loginform1.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password,"agents");
    });

if(signinform)
    signinform.addEventListener('submit', e=>{
        e.preventDefault();
        const name=document.getElementById('sname').value;
        const email=document.getElementById('semail').value;
        const password=document.getElementById('spassword').value;
        signup(name,email,password,"users");
    });

if(signinform1)
    signinform1.addEventListener('submit', e=>{
        e.preventDefault();
        const name=document.getElementById('sname').value;
        const email=document.getElementById('semail').value;
        const password=document.getElementById('spassword').value;
        signup(name,email,password,"agents");
    });

if(logOutBtn) logOutBtn.addEventListener('click', logout);
