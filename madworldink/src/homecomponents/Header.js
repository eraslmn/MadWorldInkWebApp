import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the context
import '../css/styles.css';

const Header = () => {
    const { authToken, user, logout } = useContext(AuthContext); // Get the auth context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear the token and user
       
    };

    return (
        <header className="header" id="header">
            <nav className="nav container">
                <Link to="/" className="nav__logo">
                    <h1>MADWORLDINK</h1>
                </Link>
                <div className="nav__menu" id="nav-menu">
                    <ul className="nav__list">
                        <li className="nav__item">
                            <Link to="#home" className="nav__link">Home</Link>
                        </li>
                        <li className="nav__item">
                            <a href="#collections" className="nav__link">Collection</a>
                        </li>
                        <li className="nav__item">
                            <a href="#latest" className="nav__link">Prints</a>
                        </li>
                        <li className="nav__item">
                            <a href="#homedecor" className="nav__link">Home Decor</a>
                        </li>
                        {authToken ? (
                            <>
                                <li className="nav__item">
                                    <span className="nav__link">Welcome, {user ? user.username : 'Guest'}</span>
                                </li>
                                <li className="nav__item">
                                    <button onClick={handleLogout} className="nav__button logout-btn">Log Out</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav__item">
                                <Link to="/login" className="nav__button login-btn">Log In</Link>
                            </li>
                        )}
                    </ul>
                    <div className="nav__close" id="nav-close">
                        <i className='bx bx-x'></i>
                    </div>
                </div>
                <div className="nav__toggle" id="nav-toggle">
                    <i className='bx bx-grid-alt'></i>
                </div>
            </nav>
        </header>
    );
}

export default Header;
