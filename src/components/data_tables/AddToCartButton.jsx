import React from 'react';
import { useCart } from '../CartContext';

const AddToCartButton = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const item = {
            id: product.id, // Asegúrate de que product tiene una propiedad id
            product: product,
            quantity: 1 // O la cantidad que desees agregar
        };
        addToCart(item);
    };

    return (
        <button onClick={handleAddToCart}>Agregar al Carrito</button>
    );
};

export default AddToCartButton;
