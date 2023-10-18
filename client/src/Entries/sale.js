import './forms.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const api_base = 'http://localhost:3001';


const Sale = (props) => {
  const [saleEntries, setSaleEntries] = useState([]);
  const [entry, setEntry] = useState({
    product: '',
    quantity: '',
    freeQuantity: '',
    rate: '',
    pgst:'',
    taxableamt:'',
    pcgst:'',
    psgst:'',
    pigst:'',
    ptotal:'',
  });
  const [formData, setFormData] = useState({
    itype: 'Credit',
    ino: '',
    date: '',
    customer:'',
    cgst: '',
    sgst:'',
    igst:'',
    totalTaxable:'',
    total:'',
  });
  const [customerNames, setCustomerNames] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [saveClicked, setSaveClicked] = useState(false);

  const navigate = useNavigate();

  const navigateToSales = () => {
        navigate(`${props.sub}View`);
  };

  useEffect(() => {
    const fetchLatestSaleData = async () => {
      try {
        const response = await axios.get(`${api_base}/${props.sub}Data`);
        
        
        setFormData(prevFormData => ({
          ...prevFormData,
          ino: response.data.newIno,
          date:response.data.date
        }));
        setCustomerNames(response.data.customers);
        setProductNames(response.data.products);
    
      } catch (error) {
        console.error('Error fetching latest sale data:', error);
      }
    };
    fetchLatestSaleData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === 'product') {
      const rate = productNames.find(product => product.name === value).Srate;
      setEntry(prevEntry => ({
        ...prevEntry,
        product: value,
        rate: rate,
      }));
    } else if(id === 'rate'){
    const isInputsFilled = entry.product !== '' && entry.quantity !== '';
    if (isInputsFilled) {
      const pgst = productNames.find(product => product.name === entry.product).gst;
      const taxableamt = parseFloat(entry.quantity) * parseFloat(value);
      setEntry(prevEntry => ({
        ...prevEntry,
        rate:value,
        pgst: pgst,
        taxableamt: taxableamt
      }));}
    } else if(id === 'quantity'){
      if (entry.product !== '') {

        const pgst = productNames.find(product => product.name === entry.product).gst;
        const taxableamt = parseFloat(value) * parseFloat(entry.rate);
        setEntry(prevEntry => ({
          ...prevEntry,
          quantity:value,
          pgst: pgst,
          taxableamt: taxableamt
        }));}
    }
    else{
    if (entry.hasOwnProperty(id)) {
      setEntry(prevEntry => ({
        ...prevEntry,
        [id]: value
      }));
    }
    if (formData.hasOwnProperty(id)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [id]: value
      }));
    }} 
 
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setFormData({
      ...formData,
      itype: selectedValue,
    });
  };

  const calculateTotals = (newEntry) => {
    let cgstTotal = parseFloat(newEntry.pcgst) || 0;
    let sgstTotal = parseFloat(newEntry.psgst) || 0;
    let igstTotal = parseFloat(newEntry.pigst) || 0;
    let totalAmt = parseFloat(newEntry.ptotal) || 0;
    let totalTaxable = parseFloat(newEntry.taxableamt) || 0;

    saleEntries.forEach(newEntry => {
      cgstTotal += parseFloat(newEntry.pcgst) || 0;
      sgstTotal += parseFloat(newEntry.psgst) || 0;
      igstTotal += parseFloat(newEntry.pigst) || 0;
      totalAmt += parseFloat(newEntry.ptotal) || 0;
      totalTaxable += parseFloat(newEntry.taxableamt) || 0;
    });

    return { cgstTotal, sgstTotal, igstTotal, totalAmt , totalTaxable};
  };

  const handleAddEntry = (event) => {
    event.preventDefault()
    const {rate, quantity,pgst} = entry;
    
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
  
    if (customerIsOutOfState(formData.customer)) {
      igstAmount = parseFloat(((parseInt(pgst) / 100) * (parseInt(quantity) * parseInt(rate))).toFixed(2));
    } else {
      cgstAmount = parseFloat(((parseInt(pgst) / 2 / 100) * (parseInt(quantity) * parseInt(rate))).toFixed(2));
      sgstAmount = cgstAmount;
    }
  
    const totalAmount = parseFloat(((parseInt(quantity) * parseInt(rate)) + cgstAmount + sgstAmount + igstAmount).toFixed(2));

   const newEntry = {
    ...entry,
    pcgst: cgstAmount,
    psgst: sgstAmount,
    pigst: igstAmount,
    ptotal: totalAmount,
  };
   
    setSaleEntries(prevSaleEntries => {
      return [...prevSaleEntries, newEntry];
    });

    const totals = calculateTotals(newEntry);
    setFormData({
      ...formData,
      'cgst': totals.cgstTotal.toFixed(2),
      'sgst':totals.sgstTotal.toFixed(2),
      'igst':totals.igstTotal.toFixed(2),
      'total':totals.totalAmt.toFixed(2),
      'totalTaxable':totals.totalTaxable.toFixed(2),
    });
  
    setEntry({
    product: '',
    quantity: '',
    freeQuantity: '',
    rate: '',
    pgst:'',
    taxableamt:'',
    pcgst:'',
    psgst:'',
    pigst:'',
    ptotal:'',
    });
  };
  
  const customerIsOutOfState = (customer) => {
    const os = (customerNames.find(cust => cust.name === customer)).outOfState;
    return os && ['y', 'Y'];
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    

    if (saleEntries.length === 0) {
      setSaveClicked(true);
      return;
    }  
    const updatedSaleEntries = saleEntries.map(entry => ({
        ...entry,
        code: formData.ino
      }));
  
      try {
        const response = await fetch(`${api_base}/${props.sub}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({updatedSaleEntries, formData }),
        });
  
        const data = await response.json();

        console.log('Data successfully sent:', data);
        window.location.reload();
        
      setSaleEntries([]);
        
      } catch (error) {
        console.error('Error:', error);
      }
    
  };



  return (
  <div class="wrapper">
  <div class="form">
      <h1 class="title">Create New {props.sub === 'saleReturn' ? 'Sale Return' : 'Sale'} Entry</h1>

      <form onSubmit={handleSubmit} class="myform">
        <div class="row">

          <div class="col-md-4">
              <label for="itype">Invoice Type </label>
              <div class=" radio">
              <input  type="radio" id="cash" name="itype" value="Cash" checked={formData['itype'] === 'Cash'}
          onChange={handleRadioChange}></input>
              <label for="cash">Cash</label>
              <input  type="radio" id="credit" name="itype" value="Credit" checked={formData['itype'] !== 'Cash'}
          onChange={handleRadioChange}></input>
              <label for="credit">Credit</label>
              </div>
          </div>
          
          <div class="col-md-4">
              <label for="ino">Invoice No. </label>
              <input type="text" id="ino" value={formData.ino} readOnly></input>
          </div>

          <div class="col-md-4">
              <label for="date">Date </label>
              <input type="text" id="date" value={formData.date} onChange={handleInputChange} required></input>
          </div>

        </div>

      <div class="row">
      <div class="col">
        <label for="cust">Customer</label>
        <select class="custom-select" id="customer" onChange={handleInputChange}  required>
        <option value="" selected disabled>Select</option>
          {customerNames.map((customer) => (
          <option key={customer._id} value={customer.name}>
            {customer.name}
          </option>
        ))}
        </select>
      </div>
      
    </div>

    <div className="entry-container">
      <div class="row">
      
      <div class="col-md-3 entry-item">
        <label for="product">Product</label>
        <select class="custom-select" id="product" onChange={handleInputChange} value={entry.product}>
          <option value="" selected disabled>Select</option>
          {productNames.map((product) => (
          <option key={product._id} value={product.name}>
            {product.name}
          </option>
        ))}
        </select>
      </div>

      <div class="col entry-item">
        <label for="quantity">Quantity</label>
        <input type="number" class="form-control" id="quantity" min="0" onChange={handleInputChange} value={entry.quantity} ></input>
     
      </div>


      <div class="col entry-item">
        <label for="freeQuantity">Free </label>
        <input type="number" class="form-control" id="freeQuantity" min="0" onChange={handleInputChange} value={entry.freeQuantity} ></input>
        
      </div>

      <div class="col entry-item">
        <label for="rate">Rate</label>
        <input type="number" class="form-control" id="rate" min="0"  value={entry.rate} onChange={handleInputChange}></input>
     
      </div>

      <div class="col entry-item">
        <label for="pgst">GST</label>
        <input type="number" class="form-control" id="pgst" min="0" onChange={handleInputChange} value={entry.pgst}></input>
      </div>

      <div class="col entry-item">
        <label for="taxableamt">TaxableAmt</label>
        <input type="number" class="form-control" id="taxableamt" min="0" onChange={handleInputChange} value={entry.taxableamt}></input>
      </div>
    </div>

    <div class="row">
      <button className="btn btn-outline-secondary" onClick={handleAddEntry} >Add product</button>
    </div>
    </div>

    <table className='table table-bordered'>
        <thead className='table-secondary'>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Free</th>
            <th>Rate</th>
            <th>GST</th>
            <th>Taxable Amt</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {saleEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.product}</td>
              <td>{entry.quantity}</td>
              <td>{entry.freeQuantity}</td>
              <td>{entry.rate}</td>
              <td>{entry.pgst}</td>
              <td>{entry.taxableamt}</td>
              <td>{entry.pcgst}</td>
              <td>{entry.psgst}</td>
              <td>{entry.pigst}</td>
              <td>{entry.ptotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

        <div class="row">
          <div class="col">
              <label for="cgst">CGST </label>
              <input type="text" id="cgst" value={formData.cgst} readOnly></input>
          </div>

          <div class="col">
              <label for="sgst">SGST</label>
              <input type="text" id="sgst" value={formData.sgst} readOnly></input>
          </div>

          <div class="col">
              <label for="igst">IGST</label>
              <input type="text" id="igst" value={formData.igst} readOnly></input>
          </div>

          <div class="col">
              <label for="totalTaxable">Taxable Amount</label>
              <input type="text" id="totalTaxable" value={formData.totalTaxable} readOnly></input>
          </div>

          <div class="col">
              <label for="total">Total Amount</label>
              <input type="text" id="total" value={formData.total} readOnly></input>
          </div>
          {(saveClicked &&saleEntries.length === 0) && (
    <div className="error-text">*Add product data before submitting.</div>
  )}

        </div>

        <div class='button'>
              <button type="submit" id="save">Save</button>
        </div>

      </form>
      <div class='view'>
              <button id="view" onClick={() => navigateToSales()}>View All</button>
          </div>
  </div>
  
</div> 
  );
}

export default Sale;
