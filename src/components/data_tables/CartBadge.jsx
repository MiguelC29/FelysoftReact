import React from 'react';
import { useCart } from '../CartContext';

const CartBadge = () => {
    const { getCartItemCount } = useCart();

    return (
        <div className="cart-badge">
            <i className="pi pi-shopping-cart"></i>
            <span className="badge">{getCartItemCount()}</span>
        </div>
    );
};

export default CartBadge;
