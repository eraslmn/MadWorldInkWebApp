import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useCart } from '../homecomponents/CartContext';  // Import useCart

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(Cookies.get('authToken') || null);
    const [user, setUser] = useState(null);
    const [cartId, setCartId] = useState(null);
    const { clearCart, fetchUserCart } = useCart();  // Ensure fetchUserCart is correctly imported

    const login = (token) => {
        setAuthToken(token);
        Cookies.set('authToken', token);
        fetchUserData(token);
    };

    const logout = async () => {
        if (user && cartId) {
            try {
                await fetch(`https://localhost:7213/api/Cart/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            } catch (error) {
                console.error("Error clearing cart on logout:", error);
            }
        }

        setAuthToken(null);
        setUser(null);
        setCartId(null);
        Cookies.remove('authToken');
        clearCart();

        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('https://localhost:7213/api/Auth/getUser', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                const fetchedCart = await fetchUserCart(data.id, token);  // Use fetchUserCart correctly
                if (fetchedCart && fetchedCart.length > 0) {
                    setCartId(fetchedCart[0].cartId);
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchUserData(authToken);
        } else {
            clearCart();
        }
    }, [authToken, clearCart]);

    return (
        <AuthContext.Provider value={{ authToken, user, cartId, setCartId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
