import axios from "axios";
import {showAlert} from './alert';

export const addC = async (id,urla="") => {
  try {
    const res = await axios({
      method: 'POST',
      url: urla+'api/users/cart/'+id,
      data:{}
    });

    if (res.data.status === 'success') {
      showAlert('success',"Added succesful",2);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateC = async (id, Quantity) => {
    try {
      const res = await axios({
        method: 'PUT',
        url: 'api/users/cart/'+id,
        data: {
            Quantity
        }
      });
  
      if (res.data.status === 'success') {
        window.setTimeout(() => {
            location.assign('/cart');
          }, 1000);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
};
export const deleteC = async (id) => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: 'api/users/cart/'+id,
        data: {}
      });
  
      if (res.data.status === 'success') {
        window.setTimeout(() => {
            location.assign('/cart');
          }, 1200);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
};
