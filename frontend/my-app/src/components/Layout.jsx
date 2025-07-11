import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        dark={dark}
        setDark={setDark}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} p-6 w-full bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        {children}
        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 SalesNest | Developed by Mukund Bansal
        </footer>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
