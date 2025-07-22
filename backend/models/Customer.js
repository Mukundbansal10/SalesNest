const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  gstNumber: { type: String, default: 'NA' }, // 👈 ADD THIS LINE

}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

