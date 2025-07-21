const express = require('express');
const router = express.Router();
const { sendInvoice } = require('../controllers/invoiceController');

// POST /api/invoice/send
router.post('/send', sendInvoice);

module.exports = router;
