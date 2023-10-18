import React, { useState, useEffect } from 'react';
import '../Entries/forms.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const api_base = 'http://localhost:3001';

const Product = () => {
  const [formData, setFormData] = useState({
    code: '',
    hsn: '',
    gst: '',
    rate: '',
    name: '',
    mfr:'',
  });

  const navigate = useNavigate();
  const navigateToProducts = () => {
        navigate("/Products");
  };



  const [saveClicked, setSaveClicked] = useState(false);
  useEffect(() => {
    const fetchLatestProductCode = async () => {
      try {
        const response = await axios.get(`${api_base}/latestProductCode`);
        
        
        setFormData(prevFormData => ({
          ...prevFormData,
          code: response.data.productCode
        }));
    
      } catch (error) {
        console.error('Error fetching latest product code:', error);
      }
    };
    

    fetchLatestProductCode();
  }, []);


  const [errors, setErrors] = useState({
    gst: '',
    rate: '',
  });
  
  const handleInputChange = (e) => {
    const { id, value} = e.target;
    let updatedErrors = { ...errors };

    if (id === 'gst' || id === 'rate') {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        updatedErrors[id] = `*${id.charAt(0).toUpperCase() + id.slice(1)} must be a valid number`;
      } else {
        updatedErrors[id] = '';
      }
    }
  
    setErrors(updatedErrors);
    setFormData({
      ...formData,
      [id]:value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (errors.gst || errors.rate) {
      setSaveClicked(true);
      console.log('Form submission failed due to errors.');
      return;
    }
  
    try {
      const response = await axios.post(`${api_base}/Masters/product`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      window.location.reload();

      console.log('Form submitted successfully. Data sent to the server:', data);
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  };
  

  return (
    <div class="wrapper">
    <div class="form">
        <h1 class="title">Create New Product</h1>

        <form onSubmit={handleSubmit} class="myform">
          <div class="row">
            <div className='col-md-3'>
                <label for="code">Code </label>
                <input type="text" id="code"  onChange={() => {}} value={formData.code} readOnly></input>
            </div>

            <div className='col-md-6'>
                <label for="name">Name </label>
                <input type="text" id="name" onChange={handleInputChange}  required></input>
            </div>
            
            <div className='col-md-3'>
                <label for="hsn"> HSN No.</label>
                <input type="text" id="hsn" onChange={handleInputChange} required></input>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-4'>
                <label for="Prate">Purchase Rate</label>
                <input type="text" id="Prate"onChange={handleInputChange} required></input>
                {errors.rate && <div className="error-text">{errors.rate}</div>}
            </div>
            
            <div className='col-md-4'>
                <label for="Srate">Sale Rate</label>
                <input type="text" id="Srate"  onChange={handleInputChange} required></input>
            </div>

            <div className='col-md-4'>
                <label for="gst">GST </label>
                <input type="text" id="gst" onChange={handleInputChange} required></input>
                {errors.gst && <div className="error-text">{errors.gst}</div>}
            </div>
          </div>

          <div className='full-width'>
                <label for="mfr">Manufacturer </label>
                <input type="text" id="mfr" onChange={handleInputChange} required></input>
            </div>
            

            <div class='button'>
                <button type="submit" id="save">Save</button>
                {saveClicked && (errors.gst || errors.rate) ? (
              <div className="error-text">*Re-check the inputs</div>
            ) : null}
            </div>

            

        </form>
        <div class='view'>
                <button id="view" onClick={() => navigateToProducts()}>View All</button>
            </div>
    </div>
</div>
  );
};

export default Product;
