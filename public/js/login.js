import axios from "axios";
import {showAlert} from './alert';

export const login = async (email, password, route, urla="") => {
    try {
      const res = await axios({
        method: 'POST',
        url: urla+'api/'+route+'/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          if(route=="agents")
            location.assign('/agent');
          else
            location.assign('/');
        }, 1200);
      }
    } catch (err) {
      console.log(err)
      showAlert('error', err.response.data.message);
    }
  };

  export const logout = async (urla="") => {
    try {
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
      showAlert('error', err.response.data.message);
    }
  };
  
export const signup = async (name, email, password, route, urla="") => {
  try {
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
      showAlert('success', 'Craeted successful.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}; 

export const signup1 = async(data, route) =>{
  try {
       
    const res = await axios({
      method: 'POST',
      url: 'api/agents/signup',
      data
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Craeted successful.');
      window.setTimeout(() => {
        location.assign('/agent');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export const updatea = async(data) =>{
  try {
       
    const res = await axios({
      method: 'PATCH',
      url: 'api/agents/update',
      data
    });
    
    if (res.data.status === 'success') {  
      showAlert('success', 'Changed successful.');
      window.setTimeout(() => {
        location.assign('/agent-account');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export const updateu = async(data) =>{
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'api/users/update',
      data
    });
    
    if (res.data.status === 'success') {  
      showAlert('success', 'Changed successful.');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
