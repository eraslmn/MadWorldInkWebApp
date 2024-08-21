import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './css/styles.css'; // Import global styles

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard'; // Import Admin Dashboard
import ProductsManagement from './pages/ProductsManagement'; // Import Products Management
import UsersManagement from './pages/UsersManagement'; // Import Users Management
import OrdersManagement from './pages/OrdersManagement'; // Import Orders Management

import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthContext and useAuth
import { CartProvider } from './homecomponents/CartContext'; // Import CartContext

import './App.css'; // Global styles

// A wrapper component to protect routes
const ProtectedRoute = ({ element }) => {
    const { authToken } = useAuth(); // Ensure useAuth is used here
    return authToken ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <CartProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        {/* Protect the admin dashboard route */}
                        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                        {/* Protect the products management route */}
                        <Route path="/admin/products" element={<ProtectedRoute element={<ProductsManagement />} />} />
                        {/* Protect the users management route */}
                        <Route path="/admin/users" element={<ProtectedRoute element={<UsersManagement />} />} />
                        {/* Protect the orders management route */}
                        <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersManagement />} />} />
                    </Routes>
                </AuthProvider>
            </CartProvider>
        </Router>
    );
}

export default App;
