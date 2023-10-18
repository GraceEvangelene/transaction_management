const mongoose = require('mongoose');

const purEntrySchema = new mongoose.Schema({
  grn: {
    type: String,
    required: true,
  }, 
  itype: {
    type: String,
    required: true,
  },
  supplier: {
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


const purE = mongoose.model('purE', purEntrySchema);

module.exports = purE;
