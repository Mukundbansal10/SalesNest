const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add product
router.post('/', async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.status(201).json({ msg: "Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, { name, price, quantity }, { new: true });
    res.json({ msg: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
