import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

import { useAuth } from './AuthContext';

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // 1. Fetch Cart on Login
    useEffect(() => {
        if (user) {
            setCartItems([]); // Clear guest items (strict separation) and show empty while loading
            setIsCartLoaded(false); // Reset load state on user change
            // Load from backend
            fetch(`${import.meta.env.VITE_API_URL || ''}/api/cart/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.items) {
                        setCartItems(data.items);
                    } else {
                        setCartItems([]);
                    }
                    setIsCartLoaded(true); // Only allow saving if load succeeded
                })
                .catch(err => console.error("Failed to load cart", err));
        } else {
            // Guest: Clear Cart immediately
            setCartItems([]);
            setIsCartLoaded(false); // Disable saving
        }
    }, [user]);

    // 2. Save Cart (Cloud Only)
    useEffect(() => {
        // Only save if user is logged in AND cart has been loaded/initialized
        if (user && isCartLoaded) {
            // Save to Cloud
            fetch(`${import.meta.env.VITE_API_URL || ''}/api/cart/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems })
            }).catch(err => console.error("Failed to save cart", err));
        }
    }, [cartItems, user, isCartLoaded]);

    const addToCart = (product) => {
        if (!user) {
            alert("Please login to add items to the cart.");
            return;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
