const mongoose = require('mongoose');

const saleReturnSchema = new mongoose.Schema({
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

const saleR = mongoose.model('saleR', saleReturnSchema);

module.exports = saleR;
