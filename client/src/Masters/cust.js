import React, { useState, useEffect } from 'react';
import '../Entries/forms.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const api_base = 'http://localhost:3001';
 
const Cust = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    addr: '',
    phone: '',
    email: '',
    gst:'',
    outOfState:'',
  });

  const navigate = useNavigate();
  const navigateToCustomers = () => {
        navigate("/Customers");
  };

  const [buttonClicked, setButtonClicked] = useState(false);
  useEffect(() => {
    const fetchLatestCustomerCode = async () => {
      try {
        const response = await axios.get(`${api_base}/latestCustomerCode`);
        
        
        setFormData(prevFormData => ({
          ...prevFormData,
          code: response.data.customerCode
        }));
    
      } catch (error) {
        console.error('Error fetching latest ters/customerer code :', error);
      }
    };
    

    fetchLatestCustomerCode();
  }, []);

  const [errors, setErrors] = useState({
    phone: '',
    email: '',
    gst: '',
    outOfState: '',
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
    }else if (id === 'gst') {
      if (value.length !== 15) {
        updatedErrors.gst = '*GST number must be 15 characters long';
      } else {
        updatedErrors.gst = '';
      }
    } else if (id === 'outOfState') {
      if (!['y', 'n', 'Y', 'N'].includes(value)) {
        updatedErrors.outOfState = '*Value must be either "Y" or "N"';
      } else {
        updatedErrors.outOfState = '';
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
  
    if (errors.email || errors.phone || errors.gst || errors.outOfState) {
      setButtonClicked(true);
      console.log('Form submission failed due to errors.');
      return;
    }
  
  
    try {
      const response = await axios.post(`${api_base}/Masters/customer`, formData, {
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
      <h1 class="title">Create New Customer</h1>

      <form action="#" class="myform">
        <div class="row">
          <div class="col-md-4">
              <label for="code">Code </label>
              <input type="text" id="code" onChange={() => {}} value={formData.code} readOnly></input>
          </div>
          
          <div class="col-md-8">
              <label for="name">Name </label>
              <input type="text" id="name" onChange={handleInputChange}  required></input>
          </div>
        </div>

        <div class="full-width">
              <label for="addr">Address </label>
              <input type="text" id="addr" onChange={handleInputChange}  required></input>
        </div>

        <div class="two">
          <div>
              <label for="phone">Phone </label>
              <input type="text" id="phone" onChange={handleInputChange}  required></input>
              {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          <div>
              <label for="email">Email</label>
              <input type="text" id="email" onChange={handleInputChange}  required></input>
              {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div>
              <label for="gst">GST No.</label>
              <input type="text" id="gst" onChange={handleInputChange}  required></input>
              {errors.gst && <div className="error-text">{errors.gst}</div>}
          </div>

          <div>
              <label for="outOfState">Out of State (Y/N)</label>
              <input type="text" id="outOfState" onChange={handleInputChange}  required></input>
              {errors.outOfState && <div className="error-text">{errors.outOfState}</div>}
          </div>
   
        </div>

        

        <div class='button'>
              <button id="save">Save</button>
              {buttonClicked && (errors.email || errors.phone || errors.gst || errors.outOfState) ? (
              <div className="error-text">*Re-check the inputs</div>
            ) : null} 
        </div>

      </form>
      <div class='view'>
              <button id="view" onClick={() => navigateToCustomers()}>View All</button>
          </div>
  </div>
</div>
  );
}
export default Cust;