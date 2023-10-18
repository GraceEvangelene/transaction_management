const mongoose = require('mongoose');

const mfrSchema = new mongoose.Schema({
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
});

const Manufacturer = mongoose.model('Manufacturer', mfrSchema);

module.exports = Manufacturer;
