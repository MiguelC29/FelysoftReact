import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        // Verifica si el producto ya está en el carrito
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          // Si ya está en el carrito, actualiza la cantidad
          setCartItems((prevItems) =>
            prevItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            )
          );
        } else {
          // Si no está en el carrito, crea un nuevo id único para el producto
          const newItem = { ...item, id: `${item.id}_${cartItems.length}` };
          setCartItems((prevItems) => [...prevItems, newItem]);
        }
      };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    const updateCartItemQuantity = (itemId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(quantity, 1) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
