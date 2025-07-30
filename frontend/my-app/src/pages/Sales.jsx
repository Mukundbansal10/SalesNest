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
    try {
      const res = await axios.get('/api/customers');
      const data = res.data;
      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Customers fetch error:", err);
      setCustomers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      const data = res.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
      setProducts([]);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get('/api/sales');
      const data = res.data;
      if (Array.isArray(data)) {
        setSales(data);
      } else if (Array.isArray(data.sales)) {
        setSales(data.sales);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.error("Sales fetch error:", err);
      setSales([]);
    }
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
    const existingItem = cart.find((item) => item.product._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty >= product.stock) {
      toast.error(`Only ${product.stock} items in stock`);
      return;
    }

    if (existingItem) {
      setCart(cart.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock < 1) {
        toast.error("This product is out of stock!");
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const submitSale = async () => {
    if (!selectedCustomer) return toast.warning("Select a customer");
    if (!cart.length) return toast.warning("Add items to cart");

    const payload = {
      customer: selectedCustomer,
      items: cart.map(c => ({ product: c.product._id, quantity: c.quantity })),
      totalAmount: total
    };

    try {
      await axios.post('/api/sales', payload);
      toast.success("Sale recorded");
      setCart([]);
      setSelectedCustomer('');
      fetchSales();
      fetchProducts();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Invalid request: Check stock quantity.");
      } else {
        toast.error("Something went wrong while submitting the sale.");
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6">💸 Sales Management</h2>

      {/* Customer Selection */}
      <div className="mb-4">
        <select
          className="w-full max-w-md border p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
          value={selectedCustomer}
          onChange={e => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {Array.isArray(customers) && customers.length > 0 ? (
            customers.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))
          ) : (
            <option disabled>No customers found</option>
          )}
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map(p => (
            <div key={p._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow hover:shadow-md transition">
              <div className="font-semibold">{p.name}</div>
              <div className="mt-1">₹{p.price}</div>
              <button
                onClick={() => addToCart(p)}
                disabled={p.stock === 0 || cart.find(c => c.product._id === p._id)?.quantity >= p.stock}
                className={`mt-2 px-3 py-1 rounded inline-flex items-center ${
                  p.stock === 0 || (cart.find(c => c.product._id === p._id)?.quantity >= p.stock)
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FaCartPlus /> <span className="ml-1">Add</span>
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products available</p>
        )}
      </div>

      {/* Cart */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">🛒 Cart</h3>
        {cart.length > 0 ? (
          cart.map((i, idx) => (
            <div key={idx} className="mb-1">
              {i.product?.name || "Deleted Product"} × {i.quantity} = ₹{i.quantity * i.product.price}
              <div className="text-sm text-gray-500">Stock: {i.product.stock}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Cart is empty</p>
        )}
        <div className="mt-2 font-semibold">Total: ₹{total}</div>
        <button
          onClick={submitSale}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Sale
        </button>
      </div>

      {/* Export CSV */}
      <a
        href="https://salesnest-backend.onrender.com/api/sales/export"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaDownload /> Download CSV
      </a>

      {/* Sales History */}
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
              {Array.isArray(sales) && sales.length > 0 ? (
                sales.map(s => (
                  <tr key={s._id} className="border-t border-gray-300 dark:border-gray-600">
                    <td className="px-3 py-2">{s.customer?.name || "Unknown"}</td>
                    <td className="px-3 py-2">
                      {Array.isArray(s.items) && s.items.length > 0 ? (
                        s.items.map(i => (
                          <div key={i.product?._id || i._id}>
                            {i.product?.name || "Unknown Product"} × {i.quantity}
                          </div>
                        ))
                      ) : (
                        <span className="italic text-gray-400">No items</span>
                      )}
                    </td>
                    <td className="px-3 py-2">₹{s.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No sales recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
