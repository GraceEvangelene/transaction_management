const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
