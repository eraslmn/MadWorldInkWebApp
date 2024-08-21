import React from 'react';
import '../css/styles.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container container grid">
                <div className="footer__content">
                    <a href="#" className="footer__logo">
                        <h1>MADWORLDINK</h1>
                    </a>
                    <p className="footer__description">Born in an art land,<br />raised around the world.</p>
                    <div className="footer__social">
                        <a target="_blank" href="https://www.instagram.com/madworldink/" className="footer__social-link">
                            <i className='bx bxl-instagram'></i>
                        </a>
                        <a target="_blank" href="https://twitter.com/madworldink" className="footer__social-link">
                            <i className='bx bxl-twitter'></i>
                        </a>
                    </div>
                </div>
                <div className="footer__content">
                    <h3 className="footer__title">My World</h3>
                    <ul className="footer__links">
                        <li>
                            <a className="footer__link">Savoir-Faire</a>
                        </li>
                        <li>
                            <a className="footer__link">Stories</a>
                        </li>
                        <li>
                            <a className="footer__link">Stay connected</a>
                        </li>
                    </ul>
                </div>
                <div className="footer__content">
                    <h3 className="footer__title">Services</h3>
                    <ul className="footer__links">
                        <li>
                            <a className="footer__link">All services</a>
                        </li>
                        <li>
                            <a className="footer__link">Extend your warranty</a>
                        </li>
                        <li>
                            <a className="footer__link">Contact us</a>
                        </li>
                        <li>
                            <a className="footer__link">FAQ</a>
                        </li>
                    </ul>
                </div>
                <div className="footer__content">
                    <h3 className="footer__title">Foundation</h3>
                    <ul className="footer__links">
                        <li>
                            <a className="footer__link">Press</a>
                        </li>
                        <li>
                            <a className="footer__link">News</a>
                        </li>
                        <li>
                            <a className="footer__link">Find Out More</a>
                        </li>
                    </ul>
                </div>
            </div>
            <span className="footer__copy">&#169; 2023 MADWORLDINK<br />Developed by Era Sulejmani</span>
        </footer>
    );
}

export default Footer;