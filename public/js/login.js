import axios from "axios";


export const login = async (email, password) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'api/users/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        alert('success');
        window.setTimeout(() => {
          location.assign('/s/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/users/logout'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      alert('error');
    }
  };
  
   