import axios from "axios";
import {showAlert} from './alert';

export const login = async (email, password, route, urla="") => {
    try {
      document.getElementById("spinner").style.display="flex";
      const res = await axios({
        method: 'POST',
        url: urla+'api/'+route+'/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        document.getElementById("spinner").style.display="none";
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          if(route=="agents")
            location.assign('/agent');
          else
            location.assign('/');
        }, 700);
      }
    } catch (err) {
      document.getElementById("spinner").style.display="none";
      showAlert('error', err.response.data.message);
    }
  };

  export const logout = async (urla="") => {
    try {
      document.getElementById("spinner").style.display="flex";
      const res = await axios({
        method: 'GET',
        url:urla+'api/users/logout'
      });
      if ((res.data.status = 'success')) {
        window.setTimeout(() => {
          location.assign('/');
        }, 100);
      }
    } catch (err) {
      document.getElementById("spinner").style.display="none";      
      showAlert('error', err.response.data.message);
    }
  };

export const resetp= async(token,password,urla)=>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'PATCH',
      url:urla+'api/users/resetPassword/'+token,
      data:{
        password
      }
    });
    if (res.data.status = 'success'){
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Changed Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 400);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message);
  }
}

export const forgetp = async(email,urla="")=>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'POST',
      url:urla+'api/users/forgotPassword',
      data:{
        email
      }
    });
    if ((res.data.status = 'success')) {
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Token sent to email!');
      window.setTimeout(() => {
        location.assign('/');
      }, 400);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message);
  }
}

export const signup = async (name, email, password, route, urla="") => {
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'POST',
      url: urla+'api/'+route+'/signup',
      data: {
        name,
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Account Created Successfully!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }  
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    if(err.response.data.message.includes("Duplicate field value"))
      showAlert('error', "You are already registered! Please Login.");
    else
    showAlert('error', err.response.data.message);
  }
}; 

export const signup1 = async(data, route) =>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'POST',
      url: 'api/agents/signup',
      data
    });
    
    if (res.data.status === 'success') {
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Account Created Successfully!');
      window.setTimeout(() => {
        location.assign('/agent');
      }, 1100);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    if(err.response.data.message.includes("Duplicate field value"))
      showAlert('error', "You are already registered please Login.");
    else
      showAlert('error', err.response.data.message);  
  }
}

export const updatea = async(data) =>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'PATCH',
      url: 'api/agents/update',
      data
    });
    
    if (res.data.status === 'success') {  
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Changed Successfully');
      window.setTimeout(() => {
        location.assign('/agent-account');
      }, 1000);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message);
  }
}

export const updateu = async(data) =>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'PATCH',
      url: 'api/users/update',
      data
    });
    
    if (res.data.status === 'success') {  
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Changed Successfully');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message);
  }
}

export const fshop = async(field) =>{
  try {
    if(field!="")
      window.setTimeout(() => {
          location.assign('/shop?shop[regex]='+field);
      }, 100);
    else
      window.setTimeout(() => {
        location.assign('/shop');
      }, 100);
  } catch (err) {
    showAlert('error', err);
  }
}
