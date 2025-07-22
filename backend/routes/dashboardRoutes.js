const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

router.get('/summary', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalRevenueAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Total items sold
    const itemsAgg = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, totalItems: { $sum: "$items.quantity" } } }
    ]);
    const totalItems = itemsAgg[0]?.totalItems || 0;

    // Top product
    const topProductAgg = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      { $project: { name: "$productInfo.name" } }
    ]);

    const topProduct = topProductAgg[0]?.name || null;

    res.json({
      totalProducts,
      totalCustomers,
      totalSales,
      totalRevenue,
      totalItems,
      topProduct
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ msg: err.message });
  }
});



router.get('/product-distribution', async (req, res) => {
  try {
    const soldAgg = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          soldQty: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          soldQty: 1
        }
      }
    ]);

    res.json(soldAgg);
  } catch (error) {
    console.error("Product distribution error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

