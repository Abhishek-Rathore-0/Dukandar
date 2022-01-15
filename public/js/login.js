import axios from "axios";


export const login = async (email, password, route) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'https://dukandar-a.herokuapp.com/api/'+route+'/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        alert("Login successful");
        location.reload(true);
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
  
  
export const signup = async (name, email, password, route) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/'+route+'/signup',
      data: {
        name,
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      alert('Craeted successful.');
      location.reload(true);
    }
  } catch (err) {
    alert('error');
  }
}; 
