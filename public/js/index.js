import '@babel/polyfill';
import {login,logout,signup,signup1,updatea} from './login';
import {showAlert} from './alert';


const loginform = document.querySelector('.form');
const loginform1 = document.querySelector('.form1');
const signinform = document.querySelector('.form-sign');
const signinform1 = document.querySelector('.form-sign1');
const logOutBtn = document.querySelector('.logout-btn');
const aupdate = document.querySelector('.form--updateAgent');


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
        const form = new FormData();
        form.append('name', document.getElementById('aname').value);
        form.append('email', document.getElementById('aemail').value);
        form.append('photo', document.getElementById('aphoto').files[0]);
        form.append('mobile', document.getElementById('amobile').value);

        var category = [];
        for (var option of document.getElementById('acategory').options)
        {
            if (option.selected) {
                category.push(option.value);
            }
        }
        form.append('category',category);

        const location1=document.getElementById('alocation1').value;
        const city=document.getElementById('alocation2').value;
        const location3=document.getElementById('alocation3').value;
        const location4=document.getElementById('alocation4').value;
        const location=location1+", "+city+", "+location3+", "+location4;

        form.append('location', location);
        form.append('city', city);
        form.append('password', document.getElementById('apassword').value);
        form.append('shop',document.getElementById('ashop').value);
     
        // for (var [key, value] of form.entries()) { 
        //   console.log(key, value);
        // }
        signup1(form, "agents");
    });

if(logOutBtn) logOutBtn.addEventListener('click', logout);

if(aupdate)
    aupdate.addEventListener('submit', e=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('aname').value);
        form.append('email', document.getElementById('aemail').value);
        if(document.getElementById('aphoto').files[0])
            form.append('photo', document.getElementById('aphoto').files[0]);
        form.append('mobile', document.getElementById('amobile').value);

        var category = [];
        for (var option of document.getElementById('acategory').options)
        {
            if (option.selected) {
                category.push(option.value);
            }
        }
        form.append('category',category);

        const location1=document.getElementById('alocation1').value;
        const city=document.getElementById('alocation2').value;
        const location3=document.getElementById('alocation3').value;
        const location4=document.getElementById('alocation4').value;
        const location=location1+", "+city+", "+location3+", "+location4;

        form.append('location', location);
        form.append('city', city);
        form.append('shop',document.getElementById('ashop').value);
     console.log('hello');
        updatea(form);
    });

