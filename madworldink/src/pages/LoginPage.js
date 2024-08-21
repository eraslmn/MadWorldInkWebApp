// pages/LoginPage.js
import React, { useState } from 'react';
import styles from '../css/login.module.css'; // Ensure the correct path
import LoginForm from '../logcomponents/LoginForm';
import SignUpForm from '../logcomponents/SignUpForm';


function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className={styles['mwi-app']}>
      <div className={styles['mwi-login']} id="login">
        <h1>{showLogin ? 'Log In' : 'Sign Up'}</h1>
      </div>

      <div className={styles['mwi-log-reg']}>
        <div className={styles['mwi-log-reg__swiper']}>
          {showLogin ? (
            <LoginForm toggleView={toggleView} />
          ) : (
            <SignUpForm toggleView={toggleView} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;