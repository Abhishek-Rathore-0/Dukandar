import axios from "axios";


export const login = async (email, password) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        alert("Login successful");
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: 'http://localhost:3000/api/users/logout'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      alert('error');
    }
  };
  
  
export const signup = async (name, email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/users/signup',
      data: {
        name,
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      alert('Craeted successful.');
      console.log(res.data);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert('error');
  }
}; 
