import axios from "axios";
import {showAlert} from './alert';

export const addProduct = async (data) => {
    try {
        const res = await axios({
          method: 'POST',
          url: 'api/agents/product',
          data
        });
        
        if (res.data.status === 'success') {  
          showAlert('success', 'Added Successfully');
          window.setTimeout(() => {
            location.assign('/agent-products');
          }, 1200);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}

export const updateProduct = async(data) =>{
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'api/agents/product',
      data
    });
    
    if (res.data.status === 'success') {  
      showAlert('success', 'Update Successfully');
      window.setTimeout(() => {
        location.assign('/agent-products');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export const sorting = async(field) =>{
  try {
      window.setTimeout(() => {
        location.assign('/agent-products?sort='+field);
      }, 100);
  } catch (err) {
    showAlert('error', err);
  }
}