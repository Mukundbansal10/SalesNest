const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.log('❌ MongoDB connection error:', err));


// Sample route
app.get('/', (req, res) => {
  res.send('Sales Management Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);  // 👈 Add this line

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);


const saleRoutes = require('./routes/saleRoutes');
app.use('/api/sales', saleRoutes);


const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


