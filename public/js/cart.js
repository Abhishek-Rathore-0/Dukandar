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
      showAlert('success',"Added succesful",1);
    }
  } catch (err) {
    showAlert('error', err.response.data.message,2);
  }
};

export const updateC = async (id, Quantity) => {
    try {
      document.getElementById("spinner").style.display="flex";
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
          }, 700);
      }
    } catch (err) {
      document.getElementById("spinner").style.display="none";
      showAlert('error', err.response.data.message,2);
    }
};

export const deleteC = async (id) => {
    try {
      document.getElementById("spinner").style.display="flex";
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
      document.getElementById("spinner").style.display="none";
      showAlert('error', err.response.data.message,2);
    }
};

export const empty_cart = async () => {
  try {
    document.getElementById("spinner").style.display="none";
    const res = await axios({
      method: 'DELETE',
      url: 'api/users/cart/',
      data: {}
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
          location.assign('/cart');
        }, 800);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message,2);
  }
};

export const addO =async()=>{
  try {
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'POST',
      url:'api/users/order'
    });

    if (res.data.status === 'success') {
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Ordered successful.');
        window.setTimeout(() => {
          location.assign('/orders');
        }, 1200);
    }
  } catch (err) {
    console.log(err)
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message,3);
  }
};
