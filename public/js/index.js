import '@babel/polyfill';
import {login,logout,signup,signup1,updatea,updateu,forgetp,resetp,fshop} from './login';
import {showAlert} from './alert';
import {addProduct,updateProduct,deleteproduct,sortingandsearch} from './product';
import {addC,updateC,deleteC,empty_cart,addO,deleteO,deleteO1,statusChange,confirm} from './cart';

const loginform = document.querySelector('.form');
const loginform1 = document.querySelector('.form1');
const signinform = document.querySelector('.form-sign');
const signinform1 = document.querySelector('.form-sign1');
const forget = document.querySelector('.form-forget');
const logOutBtn = document.querySelector('.logout-btn');
const aupdate = document.querySelector('.form--updateAgent');
const addp = document.querySelector('.form--addproduct');
const deletep = document.querySelector('.form--deleteproduct');
const updatep = document.querySelector('.form--updateproduct');
const reset = document.querySelector('.form-newpassword');
const sort1 = document.getElementById('sort1');
const sort2 = document.getElementById('sort2');
const OrderBtn = document.getElementById('OrderBtn');
const searchbtn = document.querySelector('.search');
const searchfshop = document.querySelector('#searchfshop');
const user_update = document.querySelector('.form-udate');
const deleteorder = document.getElementById('DelteOrdeR');

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

if(searchfshop)
    searchfshop.addEventListener('click',e=>{
        let strsearch = document.getElementById("valuefshop").value;  
        let checkfshop = document.getElementById("checkfshop").value;  
        if(checkfshop!=strsearch)
            fshop(strsearch);
    })  

if(loginform)
    loginform.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const urla=document.getElementById('urla');
        if(urla)
            login(email,password,"users",urla.value);
        else
            login(email,password,"users");
    });
    
if(loginform1)
    loginform1.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const urla=document.getElementById('urla');
        if(urla)
            login(email,password,"agents",urla.value);
        else
            login(email,password,"agents");
    });

if(signinform)
    signinform.addEventListener('submit', e=>{
        e.preventDefault();
        const name=document.getElementById('sname').value;
        const email=document.getElementById('semail').value;
        const password=document.getElementById('spassword').value;
        const urla=document.getElementById('urla');
        if(urla)
            signup(name,email,password,"users",urla.value);
        else
            signup(name,email,password,"users");
    });

if(forget)
    forget.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('femail').value;
        const urla=document.getElementById('urla');
        if(urla)
            forgetp(email,urla.value);
        else
            forgetp(email);
        
    })

if(reset)
    reset.addEventListener('submit',e=>{
        e.preventDefault();
        const password = document.getElementById('password').value;
        const token = document.getElementById('token').value;
        const urla=document.getElementById('urla');
        resetp(token,password,urla.value);
    })

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

if(logOutBtn) logOutBtn.addEventListener('click', e=>{
    const urla=document.getElementById('urla');
    if(urla)
        logout(urla.value);
    else
        logout();
});

if(user_update)
    user_update.addEventListener('submit', e=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('aname').value);
        form.append('email', document.getElementById('aemail').value);
        if(document.getElementById('aphoto').files[0])
            form.append('photo', document.getElementById('aphoto').files[0]);
        form.append('mobile', document.getElementById('amobile').value);

     
        const location1=document.getElementById('alocation1').value;
        const city=document.getElementById('alocation2').value;
        const location3=document.getElementById('alocation3').value;
        const location4=document.getElementById('alocation4').value;
        const location=location1+", "+city+", "+location3+", "+location4;

        form.append('location', location);
        form.append('city', city);
        updateu(form);
    });


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

//-------------------------------------------------CART-------------------------------------------//

const deleteM = document.getElementById('empty--cart');
if(deleteM)
    deleteM.addEventListener('click',empty_cart);


let cboxa = document.querySelectorAll(".addc");
cboxa.forEach(box => {
  box.addEventListener('click', e=>{
    e.preventDefault();
    console.log("heelo")
    const id=document.getElementById('proId').value;
    const urla=document.getElementById('urla');
    if(id!=""){
        if(urla)
            addC(id,urla.value)
        else
            addC(id);
    }    
  });
});

let cboxu = document.querySelectorAll(".updatec");
cboxu.forEach(box => {
  box.addEventListener('change', e=>{
    const id=document.getElementById('proId').value;
    const quantity=document.getElementById('quantity').value;
    if(id!="")
        updateC(id,quantity);
  });
});

let cboxd = document.querySelectorAll(".deletec");
cboxd.forEach(box => {
  box.addEventListener('click', e=>{
    e.preventDefault();
    const id=document.getElementById('proId').value;
    if(id!="")
        deleteC(id);
  });
});

if(OrderBtn)
    OrderBtn.addEventListener('click',e=>{
        addO();
    });
  
if(deleteorder)
    deleteorder.addEventListener('click',e=>{
        const Tid=document.getElementById('TransId').value;
        console.log(Tid);
        // deleteO(Tid);
        if(Tid!="")
            deleteO(Tid);
    });

let deletebuttons = document.querySelectorAll("#deletebutton");
deletebuttons.forEach(box => {
    box.addEventListener('click', e=>{
        const Tid=document.getElementById('TransId').value;
        console.log(Tid);
        if(Tid!="")
            deleteO1(Tid);
    });
  });

const updaToDelivery = document.querySelectorAll('.updaToDelivery');
updaToDelivery.forEach(box=>{
    box.addEventListener('click',e=>{
        const Tid=document.getElementById('TransId').value;
        const status=document.getElementById("statusD"+Tid).value;
        
        if(status=="delivered"){
            statusChange(Tid);
        }
    });
});

let updateStatus = document.querySelectorAll(".updateStatus");
updateStatus.forEach(box => {
    box.addEventListener('click', e=>{
        const Tid=document.getElementById('TransId').value;
        console.log(Tid);
        if(Tid!="")
            confirm(Tid);
    });
  });
