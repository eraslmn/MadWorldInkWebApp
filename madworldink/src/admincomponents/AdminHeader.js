import React from 'react';
import { Link } from 'react-router-dom';
import '../css/adminstyles.css'; // Create a separate CSS file for styling if needed

const AdminHeader = ({ onLogout }) => {
    return (
        <header className="header" id="header">
            <nav className="nav container">
               
            <Link to="/admin-dashboard" className="nav__logo">
                    <h1>MADWORLDINK</h1>
                </Link>
          
                <div className="nav__menu" id="nav-menu">
                    <ul className="nav__list">
                        <li className="nav__item">
                            <Link to="/admin-dashboard" className="nav__link">Dashboard</Link>
                        </li>
                        <li className="nav__item">
                            <button className="nav__button login-btn" onClick={onLogout}>Log Out</button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default AdminHeader;
