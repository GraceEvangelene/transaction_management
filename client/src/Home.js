import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";


export default function Home() {
  const navigate = useNavigate();

  const navigateToMasters = (masterName) => {
    switch (masterName) {
      case "m1":
        navigate("/Masters/mfr");
        break;
      case "m2":
        navigate("/Masters/product");
        break;
      case "m3":
        navigate("/Masters/supplier");
        break;
      case "m4":
        navigate("/Masters/cust");
        break;
      default:
        navigate("/");
    }
  };

  const navigateToEntries = (entryName) => {
    switch (entryName) {
      case "e1":
        navigate("/Entries/purchase");
        break;
      case "e2":
        navigate("/Entries/sale");
        break;
      case "e3":
        navigate("/Entries/purchaseR");
        break;
      case "e4":
        navigate("/Entries/saleR");
        break;
      default:
        navigate("/");
    }
  };
 
  return (
    <div class="card-container">
      <div class="card">
        <div class="card-header">ENTRIES</div>
        <div class="card-body">
          <button
            type="button"
            onClick={() => navigateToEntries("e1")}
            class="btn btn-primary"
          >
            Purchase Entry
          </button>
          <button
            type="button"
            onClick={() => navigateToEntries("e2")}
            class="btn btn-primary"
          >
            Sale Entry
          </button>
          <button
            type="button"
            onClick={() => navigateToEntries("e3")}
            class="btn btn-primary"
          >
            Purchase Return
          </button>
          <button
            type="button"
            onClick={() => navigateToEntries("e4")}
            class="btn btn-primary"
          >
            Sale Return
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-header">MASTERS</div>
        <div class="card-body">
          <button
            type="button"
            onClick={() => navigateToMasters("m1")}
            class="btn btn-primary"
          >
            Manufacturers
          </button>
          <button
            type="button"
            onClick={() => navigateToMasters("m2")}
            class="btn btn-primary"
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => navigateToMasters("m3")}
            class="btn btn-primary"
          >
            Suppliers
          </button>
          <button
            type="button"
            onClick={() => navigateToMasters("m4")}
            class="btn btn-primary"
          >
            Customers
          </button>
        </div>
      </div>
    </div>
  );
}
