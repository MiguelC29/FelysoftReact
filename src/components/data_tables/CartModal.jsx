import React from 'react';
import { Dialog } from 'primereact/dialog';
import { useCart } from '../CartContext';
import { formatCurrency } from '../../functionsDataTable';
import { Button } from 'primereact/button';

const CartModal = ({ visible, onHide }) => {
    const { cartItems, updateCartItemQuantity, clearCart } = useCart();

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    };

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity > 0) {
            updateCartItemQuantity(itemId, quantity);
        }
    };

    return (
        <Dialog header="Carrito de Compras" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item flex align-items-center justify-content-between gap-4">
                        <img src={`data:${item.product.typeImg};base64,${item.product.image}`} alt={item.product.name} width="50" />
                        <div className="item-details flex flex-column">
                            <span>{item.product.name}</span>
                            <span>{formatCurrency(item.product.salePrice)}</span>
                        </div>
                        <div className="item-quantity flex align-items-center gap-2">
                            <Button
                                icon="pi pi-minus"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            />
                            <span>{item.quantity}</span>
                            <Button
                                icon="pi pi-plus"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            />
                        </div>
                        <div className="item-total">
                            <span>{formatCurrency(item.product.salePrice * item.quantity)}</span>
                        </div>
                    </div>
                ))}
                <div className="cart-total">
                    <span>Total: {formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button label="Vaciar Carrito" icon="pi pi-trash" className="p-button-danger" onClick={clearCart} />
                </div>
            </div>
        </Dialog>
    );
};

export default CartModal;
