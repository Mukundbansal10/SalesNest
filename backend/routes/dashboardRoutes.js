const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

router.get('/summary', async (req, res) => {
  try {
    const [totalProducts, totalCustomers, totalSales] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.countDocuments()
    ]);

    const totalRevenueAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    const itemsAgg = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, totalItems: { $sum: "$items.quantity" } } }
    ]);
    const totalItems = itemsAgg.length > 0 ? itemsAgg[0].totalItems : 0;

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
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$productInfo.name", "No Sales Yet"] }
        }
      }
    ]);

    const topProduct = topProductAgg.length > 0 ? topProductAgg[0].name : "No Sales Yet";

    res.json({ totalProducts, totalCustomers, totalSales, totalRevenue, totalItems, topProduct });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get('/product-distribution', async (req, res) => {
  try {
    const soldAgg = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", soldQty: { $sum: "$items.quantity" } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$product.name", "Unknown Product"] },
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

