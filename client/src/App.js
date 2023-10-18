import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Pur from "./Entries/purchase";
import Sale from "./Entries/sale";
import Mfr from "./Masters/mfr";
import Product from "./Masters/product";
import Supplier from "./Masters/supplier";
import Cust from "./Masters/cust";
 import View from "./View";

function App() {
  return (
    <div>
      <nav>
        <div className="navbar-title">TRANSACTION MANAGEMENT</div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Masters/mfr" element={<Mfr />} />
        <Route path="/Masters/product" element={<Product />} />
        <Route path="/Masters/supplier" element={<Supplier />} />
        <Route path="/Masters/cust" element={<Cust />} />
        <Route path="/Entries/purchase" element={<Pur sub='purEntry' id='grn'/>} />
        <Route path="/Entries/sale" element={<Sale sub='saleEntry'/>} />
        <Route path="/Entries/purchaseR" element={<Pur sub='purReturn' id='Rid'/>} />
        <Route path="/Entries/saleR" element={<Sale sub='saleReturn' />} />
        <Route path="/Customers" element={<View entityType="Customer" />} />
        <Route path="/Manufacturers" element={<View entityType="Manufacturer" />} />
        <Route path="/Suppliers" element={<View entityType="Supplier" />} />
        <Route path="/Products" element={<View entityType="Product" />} />
        <Route path="/Entries/purchase/purEntryView" element={<View entityType="PurchaseEntrie" />} />
        <Route path="/Entries/purchaseR/purReturnView" element={<View entityType="PurchaseReturn" />} />
        <Route path="/Entries/sale/saleEntryView" element={<View entityType="SaleEntrie" />} />
        <Route path="/Entries/saleR/saleReturnView" element={<View entityType="SaleReturn" />} />
      </Routes>
    </div>
  );
}

export default App;
