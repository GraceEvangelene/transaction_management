import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles.css";




const View = ({ entityType}) => {
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [name, setName] = useState('');
const [customerNames, setCustomerNames] = useState([]);
const [supplierNames, setSupplierNames] = useState([]);
const [data, setData] = useState([]); 
const [error, setError] = useState('');

const handleChange = (e) => {
    const selected = e.target.value === 'None' ? '' : e.target.value;
    setName(selected);
};

const handleDateChange = (e) => {
  const selectedDate = e.target.value;
  if (e.target.id === 'startDate') {
    if(endDate){
    const [selectedDay, selectedMonth, selectedYear] = selectedDate.split('-');
    const formattedSelectedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    const [startDay, startMonth, startYear] = endDate.split('-');
    const formattedEndDate = `${startYear}-${startMonth}-${startDay}`;

    if (formattedSelectedDate > formattedEndDate) {
      setError('Start date cannot be greater than end date');
    } else {
      setStartDate(selectedDate);
      setError('');
    }} else{setStartDate(selectedDate);}
  } else {
    const [selectedDay, selectedMonth, selectedYear] = selectedDate.split('-');
    const formattedSelectedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    const [startDay, startMonth, startYear] = startDate.split('-');
    const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

    if (formattedStartDate > formattedSelectedDate) {
      setError('Start date cannot be greater than end date');
    } else {
      setEndDate(selectedDate);
      setError('');
    }
  }
};
  useEffect(() => {
    console.log('useEffect triggered');
    console.log(startDate);
    const fetchData = async () => {
      
      try {
        const response = await axios.get(`http://localhost:3001/${entityType}`, {
          params: {
            startDate,
            endDate,
            name
          }
        });
        setData(response.data.content);
        console.log(response.data.content);
        if(entityType === "SaleEntrie" || entityType === "SaleReturn"){
        setCustomerNames(response.data.customers);}
        if(entityType === "PurchaseEntrie"||entityType === "PurchaseReturn"){
        setSupplierNames(response.data.suppliers);}

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }; 

    fetchData();
  }, [entityType,startDate, endDate,name]);

  const renderTableHeader = () => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    return headers.map((header, index) => <th key={index} >{header.toUpperCase()}</th>);
  };

  const renderTableData = () => {
    if (!data || data.length === 0) return null;

    return data.map((item, index) => {
      const values = Object.values(item);
      return (
        <tr key={index}>
          {values.map((value, index) => (
            <td key={index}>{value}</td>
          ))}
        </tr>
      );
    });
  };

  return ( 
    <div>
      <h2 className='title'>{`${entityType}s`}</h2>
      <div className='viewR'>
  {(entityType === "SaleEntrie" || entityType === "PurchaseEntrie" || entityType === "SaleReturn" || entityType === "PurchaseReturn") && (
    <div className='row'>
      <div className='col-md-4'>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleDateChange}
          className="form-control mr-3"
        />
      </div>
      <div className='col-md-4'>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleDateChange}
          className="form-control mr-3"
        />
        {error!=='' && <div className="error-text">{error}</div>}
      </div>
      {(entityType === "SaleEntrie" || entityType === "SaleReturn") && (
        <div className='col-md-4'>
          <label htmlFor="name">Customer</label>
          <select className="custom-select mr-3 drop" id="name" value={name || ''} onChange={handleChange}>
            <option value="">None</option>
            {customerNames.map((customer) => (
              <option key={customer._id} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {(entityType === "PurchaseEntrie" || entityType === "PurchaseReturn") && (
        <div className='col-md-4'>
          <label htmlFor="name">Supplier</label>
          <select className="custom-select mr-3 drop" id="name" onChange={handleChange} value={name || ''}>
            <option value="">None</option>
            {supplierNames.map((supplier) => (
              <option key={supplier._id} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )}
</div>

 
      
      <table className='table table-bordered'>
        <thead className='table-secondary'>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default View;
