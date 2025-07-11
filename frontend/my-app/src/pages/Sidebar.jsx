import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaUsers, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/products", name: "Products", icon: <FaBox /> },
    { path: "/customers", name: "Customers", icon: <FaUsers /> },
    { path: "/sales", name: "Sales", icon: <FaShoppingCart /> }
  ];

  return (
    
    <div className="min-h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg fixed">
      
      <div className="text-3xl font-bold p-6 text-center border-b border-blue-400">
        Sales<span className="text-yellow-300">App</span>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`flex items-center px-4 py-2 rounded-md hover:bg-blue-600 transition ${
              location.pathname === item.path ? "bg-blue-600" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span> {item.name}
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center w-full px-4 py-2 rounded-md mt-10 bg-red-600 hover:bg-red-700 transition"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
