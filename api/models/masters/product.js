const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  Prate: {
    type: Number,  
    required: true,
  },
  Srate: {
    type: Number,  
    required: true,
  },
  gst: {
    type: Number,  
    required: true,
  },
  mfr: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0, 
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
