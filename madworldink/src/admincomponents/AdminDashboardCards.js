import React from 'react';
import { Link } from 'react-router-dom';
import '../css/admin.css';

const AdminDashboardCards = () => {
    return (
        <div className="dashboard-grid">
            <Link to="/admin/products" className="dashboard-card-link">
                <div className="dashboard-card">
                    Manage Products
                </div>
            </Link>
            <Link to="/admin/users" className="dashboard-card-link">
                <div className="dashboard-card">
                    Manage Users
                </div>
            </Link>
            <Link to="/admin/orders" className="dashboard-card-link">
                <div className="dashboard-card">
                    Manage Orders
                </div>
            </Link>
            <div className="dashboard-card earnings-card">
                <p>Contact Us: +389 000 000</p>
            </div>
        </div>
    );
};

export default AdminDashboardCards;
