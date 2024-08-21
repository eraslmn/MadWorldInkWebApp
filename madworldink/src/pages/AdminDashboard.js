import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminHeader from '../admincomponents/AdminHeader';
import AdminIntro from '../admincomponents/AdminIntro';
import AdminDashboardCards from '../admincomponents/AdminDashboardCards';
import AdminFooter from '../admincomponents/AdminFooter';
import '../css/admin.css'; // General styling for the Admin Dashboard

const AdminDashboard = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            // If not authenticated, redirect to login
            navigate('/login');
        }
    }, [authToken, navigate]);

    const handleLogout = () => {
        logout(); // Clear auth token and other data
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="admin-dashboard">
            <AdminHeader onLogout={handleLogout} />
            <div className="admin-container">
                <AdminIntro />
                <AdminDashboardCards />
            </div>
            <AdminFooter />
        </div>
    );
};

export default AdminDashboard;
