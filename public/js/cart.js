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

export const empty_cart = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: 'api/users/cart/',
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

export const addO =async()=>{
  try {
    const res = await axios({
      method: 'POST',
      url:'api/users/order'
    });

    if (res.data.status === 'success') {
      location.assign('/paynow');
    }
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message);
  }
};

export const paynowfunction=async()=>{
  try {
    const res = await axios({
      method: 'POST',
      url:'api/users/paynow'
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/success');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};