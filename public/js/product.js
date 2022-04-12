import axios from "axios";
import {showAlert} from './alert';

export const addProduct = async (data) => {
    try {
      document.getElementById("spinner").style.display="flex";
        const res = await axios({
          method: 'POST',
          url: 'api/agents/product',
          data
        });
        
        if (res.data.status === 'success') {  
          document.getElementById("spinner").style.display="none";
          showAlert('success', 'Added Successfully');
          window.setTimeout(() => {
            location.assign('/agent-products');
          }, 1200);
        }
      } catch (err) {
        document.getElementById("spinner").style.display="none";
        showAlert('error', err.response.data.message);
      }
}

export const updateProduct = async(data) =>{
  document.getElementById("spinner").style.display="flex";
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'api/agents/product',
      data
    });
    
    if (res.data.status === 'success') {  
      document.getElementById("spinner").style.display="none";
      showAlert('success', 'Updated Successfully');
      window.setTimeout(() => {
        location.assign('/agent-products');
      }, 1200);
    }
  } catch (err) {
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message);
  }
}

export const sortingandsearch = async(field) =>{
  try {
      window.setTimeout(() => {
        location.assign('/agent-products?'+field);
      }, 100);
  } catch (err) {
    showAlert('error', err);
  }
}

export const deleteproduct = async(id) =>{
  try{
    document.getElementById("spinner").style.display="flex";
    const res = await axios({
      method: 'DELETE',
      url: 'api/agents/product',
      data:{
        id
      }
    });
    document.getElementById("spinner").style.display="none";
    if (res.data.status === 'success') {  
      showAlert('success', 'Deleted Successfully');
      window.setTimeout(() => {
        location.assign('/agent-products');
      }, 1200);
    }
    else{
      console.log(res);
      showAlert('error',res.data.status);
    }
  }catch(err){
    document.getElementById("spinner").style.display="none";
    showAlert('error', err.response.data.message)
  }
}