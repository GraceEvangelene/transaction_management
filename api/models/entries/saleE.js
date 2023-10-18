const mongoose = require('mongoose');

const saleEntrySchema = new mongoose.Schema({
  itype: {
    type: String,
    required: true,
  },
  ino: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  cgst: {
    type: String,
    required: true,
  },
  sgst: {
    type: String,
    required: true,
  },
  igst: {
    type: String,
    required: true,
  },
  totalTaxable: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
});

const saleE = mongoose.model('saleE', saleEntrySchema);

module.exports = saleE;
