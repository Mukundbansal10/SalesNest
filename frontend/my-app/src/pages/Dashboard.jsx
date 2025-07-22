import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';


import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaStar
} from 'react-icons/fa';
import { motion } from 'framer-motion';




Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/dashboard/summary').then((res) => setSummary(res.data || {}));
    axios.get('/api/sales').then((res) => setSales(res.data || []));
    axios.get('/api/dashboard/product-distribution')
    .then((res) => setProductDistribution(res.data))
    .catch((err) => console.error("Distribution fetch failed", err));
    axios.get('/api/products').then((res) => setProducts(res.data || []));
  }, []);

const [productDistribution, setProductDistribution] = useState([]);
  const monthlySales = Array(12).fill(0);
  const monthlyRevenue = Array(12).fill(0);

  sales.forEach((sale) => {
    const m = new Date(sale.createdAt).getMonth();
    monthlySales[m]++;
    monthlyRevenue[m] += sale.totalAmount || 0;
  });

  const barData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [{
      label: 'Sales',
      data: monthlySales,
      backgroundColor: 'rgba(59,130,246,0.7)'
    }]
  };

  const lineData = {
    labels: barData.labels,
    datasets: [{
      label: 'Revenue',
      data: monthlyRevenue,
      fill: false,
      borderColor: 'rgba(139,92,246,1)',
      tension: 0.4
    }]
  };

  const pieData = {
    labels: productDistribution.map((p) => p.name),
    datasets: [{
      data: productDistribution.map((p) => p.soldQty),
      backgroundColor: ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'],
      hoverOffset: 4,
    }]
  };
  

  const avgSalePerCustomer = summary.totalCustomers
    ? Math.round(summary.totalRevenue / summary.totalCustomers)
    : 0;

    const topProduct = summary.topProduct || 'N/A';

    


  const cards = [
    { label: 'Products', value: summary.totalProducts, icon: <FaBox />, bg: 'bg-blue-200' },
    { label: 'Customers', value: summary.totalCustomers, icon: <FaUsers />, bg: 'bg-green-200' },
    { label: 'Sales', value: summary.totalSales, icon: <FaShoppingCart />, bg: 'bg-yellow-200' },
    { label: 'Revenue', value: `₹${summary.totalRevenue || 0}`, icon: <FaMoneyBillWave />, bg: 'bg-purple-200' },
    { label: 'Avg Sale / Customer', value: `₹${avgSalePerCustomer}`, icon: <FaMoneyBillWave />, bg: 'bg-indigo-200' },
    { label: 'Total Items Sold', value: summary.totalItems || 0, icon: <FaBox />, bg: 'bg-pink-200' },
    { label: 'Top Product', value: topProduct || 'N/A', icon: <FaStar />, bg: 'bg-cyan-200' }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h2>
    


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className={`p-4 rounded-xl shadow-md ${c.bg} transition`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">{c.label}</span>
              <div className="text-xl">{c.icon}</div>
            </div>
            <div className={`text-2xl font-bold ${c.label === 'Top Product' ? 'leading-6' : ''}`}>
              {c.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-3">📈 Monthly Sales Trend</h3>
          <Bar data={barData} />
        </motion.div>

        {/* Product Distribution Pie Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-3">🍕 Product Distribution</h3>
          <Pie data={pieData} />
        </motion.div>

        {/* Revenue Line Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-3">💰 Revenue Over Time</h3>
          <Line data={lineData} />
        </motion.div>
      </div>
    </div>
  );
}
