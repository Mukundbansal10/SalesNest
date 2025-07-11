import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';


function App() {
  return (
    
    
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Layout><Dashboard /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/products"
  element={
    <ProtectedRoute>
      <Layout><Products /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/customers"
  element={
    <ProtectedRoute>
      <Layout><Customers /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/sales"
  element={
    <ProtectedRoute>
      <Layout><Sales /></Layout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
