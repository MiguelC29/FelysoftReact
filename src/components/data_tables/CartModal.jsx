import React from 'react';
import { Dialog } from 'primereact/dialog';
import { useCart } from '../CartContext';
import { formatCurrency } from '../../functionsDataTable';
import { Button } from 'primereact/button';

const CartModal = ({ visible, onHide }) => {
    const { cartItems, updateCartItemQuantity, clearCart, removeFromCart } = useCart();

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    };

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity > 0) {
            updateCartItemQuantity(itemId, quantity);
        } else {
            removeFromCart(itemId);
        }
    };

    return (
        <Dialog header="Carrito" visible={visible} style={{ width: '50vw', borderRadius: '10px' }} onHide={onHide} className='text-center'>
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    <table className="p-datatable p-component">
                        <thead>
                            <tr>
                                <th className="text-center">Imagen</th>
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Precio</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td className="text-center" style={{ padding: '1rem' }}>
                                        <img src={`data:${item.product.typeImg};base64,${item.product.image}`} alt={item.product.name} width="60" height="60" className="cart-item-image" />
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem' }}>
                                        {item.product.name}
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem' }}>
                                        {formatCurrency(item.product.salePrice)}
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem' }}>
                                        <div className="flex justify-content-center align-items-center gap-2">
                                            <Button
                                                icon="pi pi-minus"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="p-button-rounded p-button-text p-button-danger"
                                                aria-label="Reducir"
                                            />
                                            <span className="font-bold">{item.quantity}</span>
                                            <Button
                                                icon="pi pi-plus"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="p-button-rounded p-button-text p-button-info"
                                                aria-label="Incrementar"
                                            />
                                        </div>
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem' }}>
                                        {formatCurrency(item.product.salePrice * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{fontSize: '15px'}}>
                                <td colSpan="4" className="text-right font-bold" style={{ padding: '1rem' }}>Total:</td>
                                <td className="text-center font-bold" style={{ padding: '1rem' }}>{formatCurrency(getTotal())}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <div className="flex justify-content-center align-items-center">
                        <h4>Tu carrito está vacío</h4>
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className="flex justify-content-between mt-4">
                        <Button
                            label="Vaciar Carrito"
                            icon="pi pi-trash"
                            className="p-button-help p-button-outlined"
                            onClick={clearCart}
                        />
                        <Button
                            label="Realizar venta"
                            icon="pi pi-credit-card"
                            className="p-button-success"
                            onClick={() => {/* Acción para proceder al pago */ }}
                        />
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default CartModal;
