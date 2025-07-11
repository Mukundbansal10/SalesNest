import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaUsers, FaBox, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

Chart.register(BarElement, CategoryScale, LinearScale);

const cards = [
  { label: "Products", key: "totalProducts", icon: <FaBox className="text-3xl text-blue-500" />, colorFrom: "from-blue-200", colorTo: "to-blue-300" },
  { label: "Customers", key: "totalCustomers", icon: <FaUsers className="text-3xl text-green-500" />, colorFrom: "from-green-200", colorTo: "to-green-300" },
  { label: "Sales", key: "totalSales", icon: <FaShoppingCart className="text-3xl text-yellow-500" />, colorFrom: "from-yellow-200", colorTo: "to-yellow-300" },
  { label: "Revenue", key: "totalRevenue", icon: <FaMoneyBillWave className="text-3xl text-purple-500" />, colorFrom: "from-purple-200", colorTo: "to-purple-300" },
];

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get("/api/dashboard/summary").then(res => setSummary(res.data || {}));
    axios.get("/api/sales").then(res => setSales(res.data || []));
  }, []);

  const monthly = Array(12).fill(0);
  sales.forEach(s => {
    const m = new Date(s.createdAt).getMonth();
    monthly[m]++;
  });

  const data = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [{ label: "Sales", data: monthly, backgroundColor: "rgba(59,130,246,0.7)" }],
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            className={`p-5 rounded-xl shadow-lg bg-gradient-to-br ${c.colorFrom} ${c.colorTo} hover:scale-105 transition`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>{c.label}</div>
              {c.icon}
            </div>
            <div className="text-3xl font-bold">
              {c.key === "totalRevenue" ? `₹${summary[c.key]}` : summary[c.key] ?? 0}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4">📈 Monthly Sales Trend</h3>
        <div className="overflow-x-auto">
          <Bar data={data} />
        </div>
      </motion.div>
    </div>
  );
}
