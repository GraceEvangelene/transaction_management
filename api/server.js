const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/masters/product');
const Manufacturer = require('./models/masters/manufacturer');
const Supplier = require('./models/masters/supplier');
const Customer = require('./models/masters/customer');
const purE = require('./models/entries/purE');
const purR = require('./models/entries/purR');
const saleE = require('./models/entries/saleE');
const saleR = require('./models/entries/saleR');
const entryProduct = require('./models/entries/entryProduct');
const cors=require('cors');

const app = express();

app.use(express.json()); 
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/inventorydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch(console.error);



//HANDLE NEW PRODUCT
app.get('/latestProductCode', async (req, res) => {
  try {
    const latestProduct = await Product.findOne({}, {}, { sort: { 'code': -1 } });
    const lastCode = latestProduct ? latestProduct.code : 'P0000';
    const nextCode = 'P' + String(Number(lastCode.substring(1)) + 1).padStart(4, '0');
    res.json({ productCode: nextCode });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest product code' });
  }
});


app.post('/Masters/product', async(req, res) => {
  const { code, name, hsn, Prate, Srate, gst, mfr } = req.body;
  const newProduct = new Product({code,name,hsn,Prate,Srate,gst,mfr,});
 
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error); 
    res.status(500).json({ error: 'Error saving product' });
  }
});

//HANDLE NEW MANUFACTURER
app.get('/latestManufacturerCode', async (req, res) => {
  try {
    const latestManufacturer = await Manufacturer.findOne({}, {}, { sort: { 'code': -1 } });
    const lastCode = latestManufacturer ? latestManufacturer.code : 'M0000';
    const nextCode = 'M' + String(Number(lastCode.substring(1)) + 1).padStart(4, '0');
    res.json({ manufacturerCode: nextCode });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest mfr code' });
  }
});

app.post('/Masters/manufacturer', async(req, res) => {
  const { code, name, addr, phone, email } = req.body;

  const newManufacturer = new Manufacturer({code,name, addr,phone,email,});

 
  try {
    const savedManufacturer = await newManufacturer.save();
    res.status(201).json(savedManufacturer);
  } catch (error) {
    console.error('Error saving mfr:', error); 
    res.status(500).json({ error: 'Error saving mfr' });
  }
});

//HANDLE NEW SUPPLIER
app.get('/latestSupplierCode', async (req, res) => {
  try {
    const latestSupplier = await Supplier.findOne({}, {}, { sort: { 'code': -1 } });
    const lastCode = latestSupplier ? latestSupplier.code : 'S0000';
    const nextCode = 'S' + String(Number(lastCode.substring(1)) + 1).padStart(4, '0');
    res.json({ supplierCode: nextCode });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest supplier code' });
  }
});

app.post('/Masters/supplier', async(req, res) => {
  const { code, name, addr, phone, email, gst,outOfState } = req.body;

  const newSupplier = new Supplier({code,name, addr,phone,email,gst,outOfState,});

 
  try {
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Error saving supplier:', error); 
    res.status(500).json({ error: 'Error saving supplier' });
  }
});
 
//HANDLE NEW CUSTOMER
app.get('/latestCustomerCode', async (req, res) => {
  try {
    const latestCustomer = await Customer.findOne({}, {}, { sort: { 'code': -1 } });
    const lastCode = latestCustomer ? latestCustomer.code : 'C0000';
    const nextCode = 'C' + String(Number(lastCode.substring(1)) + 1).padStart(4, '0');
    res.json({ customerCode: nextCode });
    console.log(nextCode);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest customer code' });
  }
});

app.post('/Masters/customer', async(req, res) => {
  const { code, name, addr, phone, email, gst,outOfState } = req.body;

  const newCustomer = new Customer({code,name, addr,phone,email,gst,outOfState,});

 
  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error saving customer:', error); 
    res.status(500).json({ error: 'Error saving customer' });
  }
});


//functions to add and subtractstock

const subtractStock = async(Entries) => {
  for (const Entry of Entries) {
    const { product, quantity, freeQuantity } = Entry;

    const foundProduct = await Product.findOne({ name: product });

    if (foundProduct) {
      foundProduct.stock -= (parseInt(quantity) + parseInt(freeQuantity));

      await foundProduct.save();
    } else {
      console.log(`Product not found for entry with product name: ${product}`);
    }}
};

const addStock = async(Entries) => {
  for (const Entry of Entries) {
    const { product, quantity, freeQuantity } = Entry;

    const foundProduct = await Product.findOne({ name: product });

    if (foundProduct) {
      foundProduct.stock += (parseInt(quantity) + parseInt(freeQuantity));

      await foundProduct.save();
    } else {
      console.log(`Product not found for entry with product name: ${product}`);
    }}
};




// HANDLE NEW PURCHASE ENTRY

app.get('/purEntryData', async (req, res) => {
  try {
    const latestPurE = await purE.findOne({}, {}, { sort: { 'grn': -1 } });
    const lastCode = latestPurE ? latestPurE.grn : 'PE0000';
    const nextCode = 'PE' + String(Number(lastCode.substring(2)) + 1).padStart(4, '0');
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const suppliers = await Supplier.find({}, 'name outOfState');
    const products = await Product.find({}, 'name gst Prate');
    res.json({ nextCode, date:currentDate,suppliers,products});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest purchase data' });
  }
});

app.post('/purEntry', async (req, res) => {
  const { updatedPurchaseEntries, formData } = req.body;
  try {
    await entryProduct.insertMany(updatedPurchaseEntries);
    addStock(updatedPurchaseEntries);

    await purE.create(formData);

    res.status(200).json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
  res.status(500).json({ error: `An error occurred while saving data: ${error.message}` });
  }
});




//HANDLE NEW PURCHASE RETURN


app.get('/purReturnData', async (req, res) => {
  try {
    const latestPurR = await purR.findOne({}, {}, { sort: { 'Rid': -1 } });
    const lastCode = latestPurR ? latestPurR.Rid : 'PR0000';
    const nextCode = 'PR' + String(Number(lastCode.substring(2)) + 1).padStart(4, '0');
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const suppliers = await Supplier.find({}, 'name outOfState');
    const products = await Product.find({}, 'name gst Prate');
    res.json({nextCode, date:currentDate,suppliers,products});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest purchase data' });
  }
});

app.post('/purReturn', async (req, res) => {
  const { updatedPurchaseEntries, formData } = req.body;
  try {
    await entryProduct.insertMany(updatedPurchaseEntries);
    
    subtractStock(updatedPurchaseEntries);

    await purR.create(formData);

    res.status(200).json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
  res.status(500).json({ error: `An error occurred while saving data: ${error.message}` });
  }
});



// HANDLE NEW SALE ENTRY

app.get('/saleEntryData', async (req, res) => {
  try {
    const latestSaleE = await saleE.findOne({}, {}, { sort: { 'ino': -1 } });
    const lastCode = latestSaleE ? latestSaleE.ino : 'SE0000';
    const nextCode = 'SE' + String(Number(lastCode.substring(2)) + 1).padStart(4, '0');
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const customers = await Customer.find({}, 'name outOfState');
    const products = await Product.find({}, 'name gst Srate');
    res.json({ newIno: nextCode, date:currentDate,customers,products});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest sale data' });
  }
});

app.post('/saleEntry', async (req, res) => {
  const { updatedSaleEntries, formData } = req.body;
  try {
    await entryProduct.insertMany(updatedSaleEntries);
    subtractStock(updatedSaleEntries);

    await saleE.create(formData);

    res.status(200).json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
  res.status(500).json({ error: `An error occurred while saving data: ${error.message}` });
  }
});

//HANDLE NEW SALE RETURN

app.get('/saleReturnData', async (req, res) => {
  try {
    const latestSaleR = await saleR.findOne({}, {}, { sort: { 'ino': -1 } });
    const lastCode = latestSaleR ? latestSaleR.ino : 'SR0000';
    const nextCode = 'SR' + String(Number(lastCode.substring(2)) + 1).padStart(4, '0');
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const customers = await Customer.find({}, 'name outOfState');
    const products = await Product.find({}, 'name gst Srate');
    res.json({ newIno: nextCode, date:currentDate,customers,products});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching latest sale data' });
  }
});

app.post('/saleReturn', async (req, res) => {
  const { updatedSaleEntries, formData } = req.body;
  try {
    await entryProduct.insertMany(updatedSaleEntries);
    addStock(updatedSaleEntries);

    await saleR.create(formData);

    res.status(200).json({ message: 'Data successfully saved' });
  } catch (error) {
    console.error('Error saving data:', error);
  res.status(500).json({ error: `An error occurred while saving data: ${error.message}` });
  }
});

//VIEW DB MASTERS DATA

 //cust
app.get('/Customer', async (req, res) => {
  try {
    const content = await Customer.find().select('-_id -__v');
    res.json({content});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

  //product
  app.get('/Product', async (req, res) => {
    try {
      const content = await Product.find().select('-_id -__v');
      res.json({content});
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  });

  //mfr
  app.get('/Manufacturer', async (req, res) => {
    try {
      const content = await Manufacturer.find().select('-_id -__v');
      res.json({content});
    } catch (error) {
      res.status(500).json({ error: 'Error fetching manufacturers' });
    }
  });

  //suppliers
  app.get('/Supplier', async (req, res) => {
    try {
      const content = await Supplier.find().select('-_id -__v');
      res.json({content});
    } catch (error) {
      res.status(500).json({ error: 'Error fetching suppliers' });
    }
  });


//VIEW DB ENTRIES DATA

app.get('/PurchaseEntrie', async (req, res) => {
  try {
    const { startDate, endDate,name } = req.query;

    const convertToDatabaseFormat = (date) => {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: convertToDatabaseFormat(startDate),
        $lte: convertToDatabaseFormat(endDate),
      };
    }
    if (name) {
      filter.supplier = name;
    }


    const content = await purE.find(filter).select('-_id -__v');
    const suppliers = await Supplier.find({}, 'name');

    res.json({content,suppliers});content
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

app.get('/SaleEntrie', async (req, res) => {
  try {
    const { startDate, endDate,name } = req.query;

    const convertToDatabaseFormat = (date) => {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: convertToDatabaseFormat(startDate),
        $lte: convertToDatabaseFormat(endDate),
      };
    }
    if (name) {
      filter.customer = name;
    }


    const content = await saleE.find(filter).select('-_id -__v');
    const customers = await Customer.find({}, 'name');

    res.json({content,customers});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

app.get('/SaleReturn', async (req, res) => {
  try {
    const { startDate, endDate,name } = req.query;

    const convertToDatabaseFormat = (date) => {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: convertToDatabaseFormat(startDate),
        $lte: convertToDatabaseFormat(endDate),
      };
    }
    if (name) {
      filter.customer = name;
    }

    const content = await saleR.find(filter).select('-_id -__v');
    const customers = await Customer.find({}, 'name');

    res.json({content,customers});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

app.get('/PurchaseReturn', async (req, res) => {
  try {
    const { startDate, endDate,name } = req.query;

    const convertToDatabaseFormat = (date) => {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: convertToDatabaseFormat(startDate),
        $lte: convertToDatabaseFormat(endDate),
      };
    }
    if (name) {
      filter.supplier = name;
    }


    const content = await purR.find(filter).select('-_id -__v');
    const suppliers = await Supplier.find({}, 'name');

    res.json({content,suppliers});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});



app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
