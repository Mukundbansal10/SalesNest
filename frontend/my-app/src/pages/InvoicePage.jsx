import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function InvoicePage() {
  const [form, setForm] = useState({
    orderId: 'INV-' + Date.now(),
    customerName: '',
    customerEmail: '',
    address: '',
    gstin: '',
    items: [{ description: '', quantity: 1, price: 0 }],
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
        toast.error("❌ Failed to load product list");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers", err);
        toast.error("❌ Failed to load customers");
      }
    };
    fetchCustomers();
  }, []);

  // 🔄 When customer selected → auto-fill data
  const handleCustomerSelect = (e) => {
    const id = e.target.value;
    setSelectedCustomerId(id);
    const selected = customers.find(c => c._id === id);
    if (selected) {
      setForm(prev => ({
        ...prev,
        customerName: selected.name || '',
        customerEmail: selected.email || '',
        address: selected.address || '',
        gstin: selected.gstin || ''
      }));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) || 0 : value;
    setForm({ ...form, items: updatedItems });
  };

  const handleProductSelect = (index, productName) => {
    const selectedProduct = products.find(p => p.name === productName);
    if (!selectedProduct) return;

    const updatedItems = [...form.items];
    updatedItems[index].description = selectedProduct.name;
    updatedItems[index].price = selectedProduct.price;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = async () => {
    if (!form.customerEmail || !form.customerName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Info',
        text: 'Please select a customer before sending invoice.',
      });
      return;
    }

    const payload = {
      email: form.customerEmail,
      data: {
        orderId: form.orderId,
        name: form.customerName,
        date: new Date().toLocaleDateString(),
        address: form.address,
        gstin: form.gstin,
        products: form.items,
      },
    };

    try {
      await axios.post('/api/invoice/send', payload);
      Swal.fire({
        icon: 'success',
        title: 'Invoice Sent',
        text: 'The invoice has been emailed successfully!',
        confirmButtonColor: '#16a34a',
      });
      setForm({
        orderId: 'INV-' + Date.now(),
        customerName: '',
        customerEmail: '',
        address: '',
        gstin: '',
        items: [{ description: '', quantity: 1, price: 0 }],
      });
      setSelectedCustomerId('');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send invoice. Please try again.',
      });
    }
  };

  const totalAmount = form.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gst = +(totalAmount * 0.18).toFixed(2);
  const grandTotal = +(totalAmount + gst).toFixed(2);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">🧾 Generate Invoice</h2>

      <motion.div
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* Customer Dropdown */}
        <label className="block font-semibold mb-1">Select Customer</label>
        <select
          value={selectedCustomerId}
          onChange={handleCustomerSelect}
          className="w-full p-2 mb-4 rounded border bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">-- Choose a customer --</option>
          {customers.map(customer => (
            <option key={customer._id} value={customer._id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={form.customerName}
            readOnly
            className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="email"
            placeholder="Customer Email"
            value={form.customerEmail}
            readOnly
            className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Billing Address"
            value={form.address}
            readOnly
            className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white col-span-2"
          />
          <input
  type="text"
  placeholder="GSTIN (optional)"
  value={form.gstin}
  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
  className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white col-span-2"
/>

        </div>

        {/* Product items */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Items</h3>
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <select
                value={item.description}
                onChange={(e) => handleProductSelect(index, e.target.value)}
                className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Product</option>
                {products.map((product, idx) => (
                  <option key={idx} value={product.name}>{product.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity || ''}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price || ''}
                onChange={(e) => handleChange(index, 'price', e.target.value)}
                className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeItem(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>
        </div>

        <div className="mt-6 text-right space-y-1">
          <div>Subtotal: ₹{totalAmount.toFixed(2)}</div>
          <div>GST (18%): ₹{gst}</div>
          <div className="text-xl font-bold">Grand Total: ₹{grandTotal}</div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            📧 Send Invoice
          </button>
        </div>
      </motion.div>
    </div>
  );
}
