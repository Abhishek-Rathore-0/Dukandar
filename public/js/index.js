import '@babel/polyfill';
import {login,logout,signup,signup1,updatea} from './login';
import {showAlert} from './alert';
import {addProduct,updateProduct,deleteproduct,sortingandsearch} from './product';
import {updateC,deleteC} from './cart';

const loginform = document.querySelector('.form');
const loginform1 = document.querySelector('.form1');
const signinform = document.querySelector('.form-sign');
const signinform1 = document.querySelector('.form-sign1');
const logOutBtn = document.querySelector('.logout-btn');
const aupdate = document.querySelector('.form--updateAgent');
const addp = document.querySelector('.form--addproduct');
const deletep = document.querySelector('.form--deleteproduct');
const updatep = document.querySelector('.form--updateproduct');
const sort1 = document.getElementById('sort1');
const sort2 = document.getElementById('sort2');
const searchbtn = document.querySelector('.search');
const updatec = document.querySelector('.updatec');
const deletec = document.querySelector('.deletec');

function ss(){
    const s= document.getElementById('searchv').value;
    const search= document.getElementById('condi').value;
    let field = "sort=";
    if(search=="")
        field = field + sort2.value + sort1.value;
    else
        field = field + sort2.value + sort1.value + '&name[regex]='+s;
    console.log(field)
    sortingandsearch(field);
}

if(sort1 || sort2 || searchbtn){
    sort1.addEventListener('change',ss);
    sort2.addEventListener('change',ss);
    searchbtn.addEventListener('click',e=>{
        document.getElementById('condi').value="true";
        ss();
    });
}
    
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
        updatea(form);
    });

if(addp)
    addp.addEventListener('submit',e =>{
        e.preventDefault();
        
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('description', document.getElementById('description').value);
        form.append('price', document.getElementById('price').value);
        form.append('quantity', document.getElementById('quantity').value);
        form.append('category', document.getElementById('category').value);
        form.append('shopId',document.getElementById('shop').value);
        Array.prototype.forEach.call(document.getElementById('photos').files, function(file) {
            form.append('images', file);
            console.log(file.name);
        });
        addProduct(form);
    })

if(deletep)
    deletep.addEventListener('submit',e =>{
        e.preventDefault();
        deleteproduct(document.getElementById('pid').value)
    })

if(updatep)
    updatep.addEventListener('submit',e =>{
        e.preventDefault();
        
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('description', document.getElementById('description').value);
        form.append('price', document.getElementById('price').value);
        form.append('quantity', document.getElementById('quantity').value);
        form.append('category', document.getElementById('category').value);
        form.append('id',document.getElementById('pid').value);
        Array.prototype.forEach.call(document.getElementById('photos').files, function(file) {
            form.append('images', file);
        });
        updateProduct(form);
    })

if(updatec)
    updatec.addEventListener('submit',e=>{
        e.preventDefault();
       
        const id=document.getElementById('pid').value;
        const quantity=document.getElementById('quantity').value;
        updateC(id,quantity);
    })

if(deletec)
    deletec.addEventListener('submit',e=>{
        e.preventDefault();    
        
        const id=document.getElementById('pid').value;
        deleteC(id);
    })
