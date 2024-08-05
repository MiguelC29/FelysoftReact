import React from 'react';
import { Dialog } from 'primereact/dialog';
import { useCart } from '../CartContext';
import { formatCurrency } from '../../functionsDataTable';

const CartModal = ({ visible, onHide }) => {
    const { cartItems } = useCart();

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    };

    return (
        <Dialog header="Carrito de Compras" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={`data:${item.product.typeImg};base64,${item.product.image}`} alt={item.product.name} width="50" />
                        <div className="item-details">
                            <span>{item.product.name}</span>
                            <span>{item.quantity} x {formatCurrency(item.product.salePrice)}</span>
                        </div>
                        <div className="item-total">
                            <span>{formatCurrency(item.product.salePrice * item.quantity)}</span>
                        </div>
                    </div>
                ))}
                <div className="cart-total">
                    <span>Total: {formatCurrency(getTotal())}</span>
                </div>
            </div>
        </Dialog>
    );
};

export default CartModal;
