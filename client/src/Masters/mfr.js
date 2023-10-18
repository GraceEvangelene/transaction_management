import React, { useState, useEffect } from 'react';
import '../Entries/forms.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const api_base = 'http://localhost:3001';

const Mfr = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    addr: '',
    phone: '',
    email: '',
  });

  const navigate = useNavigate();
  const navigateToMfrs = () => {
        navigate("/Manufacturers");
  };

  const [buttonClicked, setButtonClicked] = useState(false);
  useEffect(() => {
    const fetchLatestManufacturerCode = async () => {
      try {
        const response = await axios.get(`${api_base}/latestManufacturerCode`);
        
        
        setFormData(prevFormData => ({
          ...prevFormData,
          code: response.data.manufacturerCode
        }));
    
      } catch (error) {
        console.error('Error fetching latest manufacturer code:', error);
      }
    };
    

    fetchLatestManufacturerCode();
  }, []);

  const [errors, setErrors] = useState({
    phone: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { id, value} = e.target;
    let updatedErrors = { ...errors };

    if (id === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        updatedErrors.phone = '*Phone number must be 10 digits';
      } else {
        updatedErrors.phone = '';
      }
    } else if (id === 'email') {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]+$/.test(value)) {
        updatedErrors.email = '*Enter a valid email address';
      } else {
        updatedErrors.email = '';
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
  
    if (errors.email || errors.phone) {
      setButtonClicked(true);
      console.log('Form submission failed due to errors.');
      return;
    }
  
    try {
      const response = await axios.post(`${api_base}/Masters/manufacturer`, formData, {
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
    <div class="form" onSubmit={handleSubmit}>
        <h1 class="title">Create New Manufacturer</h1>

        <form action="#" class="myform">
          <div class="row">
            <div class="col-md-4">
                <label for="code">Code </label>
                <input type="text" id="code" onChange={() => {}} value={formData.code} readOnly></input>
            </div>
            
            <div class="col-md-8">
                <label for="name">Name </label>
                <input type="text" id="name" onChange={handleInputChange} required></input>
            </div>
          </div>

          <div class="full-width">
                <label for="addr">Address </label>
                <input type="text" id="addr" onChange={handleInputChange} required></input>
          </div>

          <div class="two">
            <div>
                <label for="phone">Phone </label>
                <input type="text" id="phone" onChange={handleInputChange} required></input>
                {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div>
                <label for="email">Email</label>
                <input type="text" id="email" onChange={handleInputChange} required></input>
                {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>

          <div class='button'>
                <button id="save">Save</button>
                {buttonClicked && (errors.email || errors.phone) ? (
              <div className="error-text">*Re-check the inputs</div>
            ) : null} 
          </div> 

        </form>
        <div class='view'>
                <button id="view" onClick={() => navigateToMfrs()}>View All</button>
            </div>
    </div>
</div>
    );
  }

export default Mfr;