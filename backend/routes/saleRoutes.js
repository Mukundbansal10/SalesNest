const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { Parser } = require('json2csv'); // add at top with other requires


// Create sale
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;
    const newSale = new Sale({ customer, items, totalAmount });
    await newSale.save();
    res.status(201).json({ msg: 'Sale recorded', sale: newSale });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});



// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name')
      .populate('items.product', 'name price');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get('/export', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name')
      .populate('items.product', 'name price');

    const csvData = sales.map((sale) => ({
      customer: sale.customer.name,
      items: sale.items.map(i => `${i.product.name} x${i.quantity}`).join(', '),
      totalAmount: sale.totalAmount,
      date: new Date(sale.createdAt).toLocaleDateString(),
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('sales_report.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
