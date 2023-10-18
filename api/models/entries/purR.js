const mongoose = require('mongoose');

const purReturnSchema = new mongoose.Schema({
  Rid: {
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

const purR = mongoose.model('purR', purReturnSchema);

module.exports = purR;
