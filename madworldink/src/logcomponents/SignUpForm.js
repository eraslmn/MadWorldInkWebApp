import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/login.module.css';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

function SignUpForm({ toggleView }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useAuth(); // Access login function from AuthContext
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrors({});  // Clear previous errors

        try {
            const response = await fetch('https://localhost:7213/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error Data:', errorData);  // Log the error data for debugging

                // Handle validation errors
                const validationErrors = {};
                if (errorData.errors) {
                    for (const key in errorData.errors) {
                        validationErrors[key.toLowerCase()] = errorData.errors[key].join(' ');
                    }
                } else if (errorData.message) {
                    validationErrors.general = errorData.message;
                } else {
                    validationErrors.general = "An unexpected error occurred. Please try again.";
                }
                setErrors(validationErrors);
                return;
            }

            // Automatically log the user in after registration
            const loginResponse = await fetch('https://localhost:7213/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!loginResponse.ok) {
                setErrors({ general: "Registration successful, but login failed. Please log in manually." });
                navigate('/login'); // Redirect to login if automatic login fails
                return;
            }

            const loginData = await loginResponse.json();
            const userRole = getUserRoleFromToken(loginData.token);

            // Store the token and role in AuthContext
            login(loginData.token, userRole);

            navigate('/'); // Redirect to home page after successful signup and login
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again later.' });
        }
    };

    const getUserRoleFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'User';
    };

    return (
        <div className={styles['mwi-log-reg__content']}>
            <div className={styles['mwi-square-r']}></div>
            <div className={styles['mwi-user-r']}><i className='bx bxs-user-plus'></i></div>
            <h3 className={styles['mwi-log-reg__h']}>Sign Up</h3>
            {errors.general && <p className={styles['error']}>{errors.general}</p>} {/* General error */}
            <form onSubmit={handleSignUp}>
            <div className={styles['mwi-input__container']}>
    {errors.username && <p className={styles['error']}>{errors.username}</p>} {/* Username error */}
    <i className={`bx bx-user ${styles['mwi-icon']}`}></i>
    <input
        type="text"
        name="username"
        className={styles['mwi-input']}
        placeholder="Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />
</div>

<div className={styles['mwi-input__container']}>
    {errors.email && <p className={styles['error']}>{errors.email}</p>} {/* Email error */}
    <i className={`bx bxl-gmail ${styles['mwi-icon']}`}></i>
    <input
        type="email"
        name="email"
        className={styles['mwi-input']}
        placeholder="Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />
</div>

<div className={styles['mwi-input__container']}>
    {errors.password && <p className={styles['error']}>{errors.password}</p>} {/* Password error */}
    <i className={`bx bx-lock-alt ${styles['mwi-icon']}`}></i>
    <input
        type="password"
        name="password"
        className={styles['mwi-input']}
        placeholder="Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
    />
</div>
                <button type="submit" name="reg_user" className={styles['mwi-button']}>Sign Up</button>
            </form>
            <p onClick={toggleView} className={styles['mwi-log-reg__p']}>
                <i style={{ transition: '.2s ease' }} className={`bx bx-left-arrow-alt ${styles['mwi-lgn-instead']}`}></i>Log In instead
            </p>
            <a href="/" className={styles['mwi-log-reg__p']}>Return&nbsp;<i className='bx bxs-home'></i></a>
            <p className={styles['mwi-copyright']}>
                <span style={{ fontWeight: 700 }}>&#169; 2023 MADWORLDINK<br />Developed by Era Sulejmani</span>
            </p>
        </div>
    );
}

export default SignUpForm;