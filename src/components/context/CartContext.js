import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie el estado del carrito
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

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
      // Si no está en el carrito, agrega el producto con cantidad inicial
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: item.quantity }]);
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
    //return cartItems.reduce((total, item) => total + item.quantity, 0); // cantidad de productos con sus cantidades
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
