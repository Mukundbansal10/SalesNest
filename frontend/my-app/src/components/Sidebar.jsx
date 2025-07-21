import { Link, useLocation } from 'react-router-dom';
import {
  FiLogOut, FiMenu, FiHome, FiBox, FiUsers,
  FiShoppingCart, FiMoon, FiSun
} from 'react-icons/fi';
import { FaFileInvoice } from 'react-icons/fa';
import { toast } from 'react-toastify';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: <FiHome /> },
  { label: 'Products', path: '/products', icon: <FiBox /> },
  { label: 'Customers', path: '/customers', icon: <FiUsers /> },
  { label: 'Sales', path: '/sales', icon: <FiShoppingCart /> },
  { label: 'Invoice', path: '/invoice', icon: <FaFileInvoice /> }, // ✅ NEW ITEM
];

export default function Sidebar({ collapsed, setCollapsed, dark, setDark }) {
  const loc = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out!');
    window.location.href = '/login';
  };

  return (
    <div className={`fixed top-0 h-full z-50 bg-gray-900 dark:bg-gray-800 text-white transition-width duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">SalesNest</span>}
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(d => !d)} className="p-1">
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="p-1">
            <FiMenu />
          </button>
        </div>
      </div>

      <nav className="mt-6 px-2 space-y-1">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 ${
              loc.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded transition"
        >
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
