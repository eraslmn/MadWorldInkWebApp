import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return action.cart;
        case 'ADD_TO_CART':
            if (state.find(item => item.productId === action.product.productId)) {
                alert('Product is already in the shopping list.');
                return state;
            }
            return [...state, { ...action.product, quantity: 1 }];
        case 'UPDATE_QUANTITY':
            return state.map(item =>
                item.productId === action.product.productId
                    ? { ...item, quantity: item.quantity + action.amount }
                    : item
            );
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.productId !== action.product.productId);
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    const setCart = (cart) => {
        dispatch({ type: 'SET_CART', cart });
    };

    const fetchUserCart = async (userId, authToken) => {
        try {
            const cartResponse = await fetch(`https://localhost:7213/api/Cart?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                if (cartData.length > 0) {
                    setCart(cartData[0].items);
                } else {
                    setCart([]);
                }
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error('Error fetching cart for user:', error);
            setCart([]);
        }
    };

    const addToCart = async (product, authToken, userId) => {
        if (!userId || !authToken) {
            console.error('Missing userId or authToken');
            return;
        }

        let cartId = null;

        try {
            const cartResponse = await fetch(`https://localhost:7213/api/Cart?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                if (cartData.length > 0) {
                    cartId = cartData[0].cartId;
                }
            }

            if (!cartId) {
                const createCartResponse = await fetch(`https://localhost:7213/api/Cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ userId: userId, items: [] }),
                });

                if (!createCartResponse.ok) {
                    throw new Error('Error creating new cart');
                }

                const createdCart = await createCartResponse.json();
                cartId = createdCart.cartId;
            }

            const response = await fetch(`https://localhost:7213/api/Cart/${cartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ productId: product.productId, quantity: 1 }),
            });

            if (!response.ok) throw new Error('Error adding product to cart');

            const updatedCart = await response.json();
            setCart(updatedCart.items);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (item, amount, authToken, cartId) => {
        if (!cartId || !authToken) {
            console.error('Missing cartId or authToken');
            return;
        }

        try {
            const updatedQuantity = item.quantity + amount;

            if (updatedQuantity <= 0) {
                await removeFromCart(item, authToken, cartId);
                return;
            }

            const response = await fetch(`https://localhost:7213/api/Cart/${cartId}/items/${item.itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(updatedQuantity),
            });

            if (!response.ok) throw new Error('Error updating quantity');

            const updatedCart = await response.json();
            setCart(updatedCart.items);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (product, authToken, cartId) => {
        if (!cartId || !authToken) {
            console.error('Missing cartId or authToken');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7213/api/Cart/${cartId}/items/${product.itemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const updatedCart = response.status !== 204 ? await response.json() : [];
                setCart(updatedCart.items || []);
            } else {
                throw new Error('Error removing item from cart');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, fetchUserCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
