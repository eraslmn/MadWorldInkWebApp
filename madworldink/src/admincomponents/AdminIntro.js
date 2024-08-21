import React from 'react';
import '../css/admin.css'; // Create a separate CSS file for styling if needed

const AdminIntro = () => {
    return (
        <div className="intro-grid">
            <h2>Welcome, Admin</h2>
            <p>This is your dashboard where you can manage products, users, orders, and view earnings.</p>
        </div>
    );
};

export default AdminIntro;
