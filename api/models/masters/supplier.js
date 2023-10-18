const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  addr: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    required: true,
  },
  outOfState: {
    type: String,
    required: true,
  },
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
