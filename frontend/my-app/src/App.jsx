import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InvoicePage from './pages/InvoicePage';

function App() {
  // Helper to wrap component with Layout and ProtectedRoute
  const renderWithLayout = (Component) => (
    <ProtectedRoute>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={renderWithLayout(Dashboard)} />
        {/* <Route path="/predict" element={renderWithLayout(Predict)} /> */}
        <Route path="/products" element={renderWithLayout(Products)} />
        <Route path="/customers" element={renderWithLayout(Customers)} />
        <Route path="/sales" element={renderWithLayout(Sales)} />
        <Route path="/invoice" element={renderWithLayout(InvoicePage)} />
      </Routes>
    </Router>
  );
}

export default App;
