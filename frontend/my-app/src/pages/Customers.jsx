import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEdit, FaTrashAlt, FaUsers } from 'react-icons/fa';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [editId, setEditId] = useState(null);

  const fetchCustomers = async () => {
    const res = await axios.get('/api/customers');
    setCustomers(res.data || []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, address } = form;
    if (!name || !phone || !email || !address) {
      return toast.warning("All fields are required");
    }

    try {
      if (editId) {
        await axios.put(`/api/customers/${editId}`, form);
        toast.success("Customer updated");
      } else {
        await axios.post('/api/customers', form);
        toast.success("Customer added");
      }
      setForm({ name: '', phone: '', email: '', address: '' });
      setEditId(null);
      fetchCustomers();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/customers/${id}`);
    toast.success("Customer deleted");
    fetchCustomers();
  };

  const handleEdit = (cust) => {
    setForm({ name: cust.name, phone: cust.phone, email: cust.email, address: cust.address });
    setEditId(cust._id);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <div className="flex items-center gap-2 mb-4">
        <FaUsers className="text-2xl text-blue-500" />
        <h2 className="text-3xl font-bold">Customer Management</h2>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-8"
      >
        {['name', 'phone', 'email', 'address'].map(field => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        ))}
        <button
          type="submit"
          className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          {editId ? <><FaEdit /> Update Customer</> : <><FaUserPlus /> Add Customer</>}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-xl shadow"
      >
        <table className="min-w-full text-left">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c._id} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.address}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
