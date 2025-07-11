import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      toast.warning("All fields required");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, form);
        toast.success("Product updated");
      } else {
        await axios.post('http://localhost:5000/api/products', form);
        toast.success("Product added");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setForm({ name: '', price: '', quantity: '' });
    setEditId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditId(p._id);
  };

  return (
    <div className="p-6 w-full bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📦 Product Management</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <input type="text" placeholder="Name" value={form.name} className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price} className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white" onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Quantity" value={form.quantity} className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white" onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded col-span-1 sm:col-span-3">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-left text-black dark:text-white">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t border-gray-300 dark:border-gray-600">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">₹{p.price}</td>
                <td className="px-4 py-2">{p.quantity}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(p)} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
