import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCartPlus, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Sales() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [sales, setSales] = useState([]);

  const fetchCustomers = async () => {
    const res = await axios.get('/api/customers');
    setCustomers(res.data || []);
  };

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data || []);
  };

  const fetchSales = async () => {
    const res = await axios.get('/api/sales');
    setSales(res.data || []);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchSales();
  }, []);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    setTotal(sum);
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product._id === product._id);
      if (exists) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const submitSale = async () => {
    if (!selectedCustomer) return toast.warning("Select a customer");
    if (!cart.length) return toast.warning("Add items to cart");

    const payload = {
      customer: selectedCustomer,
      items: cart.map(c => ({ product: c.product._id, quantity: c.quantity })),
      totalAmount: total
    };

    await axios.post('/api/sales', payload);
    toast.success("Sale recorded");
    setCart([]);
    setSelectedCustomer('');
    fetchSales();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6">💸 Sales Management</h2>

      <div className="mb-4">
        <select
          className="w-full max-w-md border p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
          value={selectedCustomer}
          onChange={e => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {products.map(p => (
          <div key={p._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow hover:shadow-md transition">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{p.name}</div>
            <div className="mt-1">₹{p.price}</div>
            <button
              onClick={() => addToCart(p)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded inline-flex items-center"
            >
              <FaCartPlus /> <span className="ml-1">Add</span>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">🛒 Cart</h3>
        {cart.map((i, idx) => (
          <div key={idx} className="mb-1">
            {i.product?.name || <span className="italic text-gray-400">Unknown Product</span>} × {i.quantity} = ₹{i.quantity * i.product.price}
          </div>
        ))}
        <div className="mt-2 font-semibold">Total: ₹{total}</div>
        <button
          onClick={submitSale}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Sale
        </button>
      </div>

      <a
        href="http://localhost:5000/api/sales/export"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaDownload /> Download CSV
      </a>

      <div className="bg-gray-100 dark:bg-gray-800 rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-2">📋 Sales History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s._id} className="border-t border-gray-300 dark:border-gray-600">
                  <td className="px-3 py-2">{s.customer?.name || <span className="italic text-gray-400">Unknown</span>}</td>
                  <td className="px-3 py-2">
                    {s.items?.map(i => (
                      <div key={i.product?._id || i._id}>
                        {i.product?.name || <span className="italic text-gray-400">Unknown Product</span>} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-2">₹{s.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
