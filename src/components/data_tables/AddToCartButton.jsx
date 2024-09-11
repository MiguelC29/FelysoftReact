import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from 'primereact/button';

const AddToCartButton = ({ product }) => {
    const { cartItems, addToCart, updateCartItemQuantity, removeFromCart } = useCart();
    const existingItem = cartItems.find(item => item.id === product.product.idProduct);

    // Verificar el stock disponible
    const stockAvailable = product.stock; // Asegúrate de que `stock` esté disponible en `product`

    const handleAddToCart = () => {
        const item = {            
            id: product.product.idProduct,
            product: product.product,
            stock: stockAvailable,
            quantity: 1
        };
        addToCart(item);
    };

    const handleIncrease = () => {
        // Verificar que la cantidad total en el carrito no exceda el stock disponible
        if (existingItem.quantity < stockAvailable) {
            updateCartItemQuantity(product.product.idProduct, existingItem.quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (existingItem.quantity > 1) {
            updateCartItemQuantity(product.product.idProduct, existingItem.quantity - 1);
        } else {
            // Remover del carrito si la cantidad es 1 y se reduce
            removeFromCart(product.product.idProduct);
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
                        disabled={existingItem.quantity >= stockAvailable} // Deshabilitar si se alcanza el stock
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
