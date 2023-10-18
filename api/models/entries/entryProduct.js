const mongoose = require('mongoose');

const entryProductsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  freeQuantity: {
    type: String,
    required: true,
  },
  rate: {
    type: String,
    required: true,
  }, 
  pgst: {
    type: String,
    required: true,
  },
  taxableamt: {
    type: String,
    required: true,
  },
  pcgst: {
    type: String,
    required: true,
  },
  psgst: {
    type: String,
    required: true,
  },
  pigst: {
    type: String,
    required: true,
  },
  ptotal: {
    type: String,
    required: true,
  },

});

const entryProduct = mongoose.model('entryProduct', entryProductsSchema);

module.exports = entryProduct;
