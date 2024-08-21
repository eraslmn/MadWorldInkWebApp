import React, { useState, useEffect } from 'react';
import { useCart } from '../homecomponents/CartContext';
import { useAuth } from '../context/AuthContext';
import '../css/shopping-list.css';

const ShoppingList = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, setCart, totalItems } = useCart();
    const { authToken, user, cartId, setCartId } = useAuth(); // Ensure setCartId is destructured here
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (authToken && user) {
                    const response = await fetch(`https://localhost:7213/api/Cart?userId=${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch cart');
                    }
                    const cartData = await response.json();
                    if (cartData && cartData.length > 0) {
                        const validCart = cartData.find(cartItem => cartItem.items && cartItem.items.length > 0);
                        if (validCart) {
                            setCart(validCart.items);
                            setCartId(validCart.cartId); // Set cartId in context
                        } else {
                            setCart([]);
                            setCartId(null);
                        }
                    } else {
                        setCart([]);
                        setCartId(null); // Clear cartId if no cart data
                    }
                } else {
                    setCart([]);
                    setCartId(null); // Clear cartId if not logged in
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                setErrorMessage('Error fetching cart data');
            }
        };

        fetchCart();
    }, [authToken, user, setCart, setCartId]); // Ensure correct dependencies

    const handleUpdateQuantity = (item, amount) => {
        if (!cartId || !authToken) {
            console.error('Missing cartId or authToken');
            return;
        }
        updateQuantity(item, amount, authToken, cartId);
    };

    const handleRemoveFromCart = (item) => {
        if (!cartId || !authToken) {
            console.error('Missing cartId or authToken');
            return;
        }
        removeFromCart(item, authToken, cartId);
    };

    const purchaseItems = async () => {
        if (!authToken) {
            alert("You must be logged in to make a purchase.");
            return;
        }

        if (!cartId) {
            alert("No cart found for this user. Please add items to the cart first.");
            return;
        }

        if (!cart || cart.length === 0) {
            alert("Your cart is empty. Add items to your cart before making a purchase.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:7213/api/Order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    orderDate: new Date().toISOString(),
                    totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    items: cart.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }),
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                console.error('Error details:', errorDetail);
                throw new Error(`Failed to complete purchase: ${response.status} - ${response.statusText}`);
            }

            await fetch(`https://localhost:7213/api/Cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            alert("Purchase successful!");
            clearCart(); 
            setCartId(null); // Clear cartId after purchase
        } catch (error) {
            console.error('Error purchasing items:', error);
            setErrorMessage('Error during purchase: ' + error.message);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

    return (
        <>
            <button
                className="cart"
                id="cart"
                onClick={() => document.getElementById("shopping-list").style.right = "0"}
            >
                <i className="bx bx-cart"></i>
                <span className="count-items">{totalItems}</span>
            </button>
            <div className="shopping-list" id="shopping-list">
                {authToken ? (
                    <>
                        <p id="no-items" style={{ display: cart.length === 0 ? "block" : "none" }}>
                            No items in the shopping list.
                        </p>
                        <button
                            className="close-list"
                            id="close-list"
                            onClick={() => document.getElementById("shopping-list").style.right = "-30rem"}
                        >
                            <i className="bx bx-x"></i>
                        </button>
                        <div id="list" style={{ display: cart.length > 0 ? "block" : "none" }}>
                            <table id="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.productName}</td>
                                            <td>
                                                <button onClick={() => handleUpdateQuantity(item, -1)} disabled={item.quantity <= 1}>
                                                    -
                                                </button>
                                                <input type="number" value={item.quantity || 0} readOnly />
                                                <button onClick={() => handleUpdateQuantity(item, 1)}>+</button>
                                            </td>
                                            <td>${item.price || 0}</td>
                                            <td>
                                                <button onClick={() => handleRemoveFromCart(item)} className="remove-btn">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="purchaseBtn">
                                <p>
                                    <strong>Total:</strong> ${total}
                                </p>
                                <button onClick={purchaseItems} className="buy">
                                    Purchase
                                </button>
                                {errorMessage && (
                                    <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p id="no-items">
                            You must be logged in to view or purchase items.
                        </p>
                        <button
                            className="close-list"
                            id="close-list"
                            onClick={() => document.getElementById("shopping-list").style.right = "-30rem"}
                        >
                            <i className="bx bx-x"></i>
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default ShoppingList;
