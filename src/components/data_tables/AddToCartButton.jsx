import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from 'primereact/button';

const AddToCartButton = ({ product }) => {
    const { cartItems, addToCart, updateCartItemQuantity, removeFromCart } = useCart();
    const existingItem = cartItems.find(item => item.id === product.idProduct);

    const handleAddToCart = () => {
        const item = {            
            id: product.idProduct,
            product: product,
            quantity: 1
        };
        addToCart(item);
    };

    const handleIncrease = () => {
        updateCartItemQuantity(product.idProduct, existingItem.quantity + 1);
    };

    const handleDecrease = () => {
        if (existingItem.quantity > 1) {
            updateCartItemQuantity(product.idProduct, existingItem.quantity - 1);
        } else {
            // Remover del carrito si la cantidad es 1 y se reduce
            removeFromCart(product.idProduct);
        }
    };

    return (
        <div>
            {existingItem ? (
                <div className="flex align-items-center gap-2">
                    <Button
                        icon="pi pi-minus"
                        onClick={handleDecrease}
                        className="p-button-danger"
                    />
                    <span>{existingItem.quantity}</span>
                    <Button
                        icon="pi pi-plus"
                        onClick={handleIncrease}
                        className="p-button-info"
                    />
                </div>
            ) : (
                <Button
                    label="Añadir al carrito"
                    icon="pi pi-shopping-cart"
                    className="p-button-help"
                    onClick={handleAddToCart}
                />
            )}
        </div>
    );
};

export default AddToCartButton;
