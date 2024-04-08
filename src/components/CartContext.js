import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(0);

    const updateCartItems = (value) => {
        setCartItems(value);
    };

    return (
        <CartContext.Provider value={{ cartItems, updateCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);