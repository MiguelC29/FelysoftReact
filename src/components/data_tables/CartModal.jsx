import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { useCart } from '../context/CartContext';
import { confirmDialog, confirmDialogFooter, DialogFooter, formatCurrency, inputNumberChange } from '../../functionsDataTable';
import { Button } from 'primereact/button';
import Request_Service from '../service/Request_Service';
import { Toast } from 'primereact/toast';
import { FloatDropdownIcon } from '../Inputs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSale } from '../context/SaleContext';

const CartModal = ({ visible, onHide }) => {
    const { cartItems, updateCartItemQuantity, clearCart, removeFromCart } = useCart();
    const { setSaleConfirmed } = useSale();

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const item = cartItems.find(item => item.id === itemId);
    
        if (item) {
            const stockAvailable = item.stock;
    
            // Verificar si la nueva cantidad es válida
            if (newQuantity <= 0) {
                removeFromCart(itemId);
            } else if (newQuantity <= stockAvailable) {
                updateCartItemQuantity(itemId, newQuantity);
            }
            /*
            else {
                toast.current.show({ severity: 'error', summary: 'Cantidad excede stock', detail: `Solo hay ${stockAvailable} unidades disponibles`, life: 3000 });
            }*/
        }
    };    

    let emptySale = {
        idSale: null,
        details: [],
        // payment
        methodPayment: '',
        total: null,
        state: ''
    };

    const MethodPayment = {
        EFECTIVO: 'EFECTIVO',
        NEQUI: 'NEQUI',
        TRANSACCION: 'TRANSACCION'
    };

    const State = {
        PENDIENTE: 'PENDIENTE',
        CANCELADO: 'CANCELADO',
        REEMBOLSADO: 'REEMBOLSADO',
        VENCIDO: 'VENCIDO'
    };

    const URL = '/sale/';
    const navigate = useNavigate();
    const location = useLocation();
    const [sale, setSale] = useState(emptySale);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [saleDialog, setSaleDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const openNew = () => {
        setSale({ ...emptySale, total: getTotal() });
        setSelectedMethodPayment('');
        setSelectedState('');
        setSubmitted(false);
        setSaleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSaleDialog(false);
    };

    const hideConfirmSaleDialog = () => {
        setConfirmDialogVisible(false);
    };

    const saveSale = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid =
            sale.total &&
            sale.methodPayment &&
            sale.state;

        const processedDetails = cartItems.map(detail => ({
            idDetail: detail.id,
            quantity: detail.quantity,
            unitPrice: detail.product.salePrice,
            idProduct: detail.product.idProduct
        }));

        let url, method, parameters;
        parameters = {
            details: processedDetails,
            //payment
            total: sale.total,
            state: sale.state,
            methodPayment: sale.methodPayment
        };
        url = URL + 'create';
        method = 'POST';

        if (isValid) {
            await Request_Service.sendRequestSale(method, parameters, url, toast, navigate, location);
            setSaleDialog(false);
            setSale(emptySale);
            onHide();
            clearCart();
            setSaleConfirmed(true); // Al confirmar la venta, actualiza el estado
        }
    }

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };    

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, sale, setSale);
    };

    const purchaseDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmSaleDialogFooter = (
        confirmDialogFooter(hideConfirmSaleDialog, saveSale)
    );

    const stateOptions = Object.keys(State).map(key => ({
        label: State[key],
        value: key
    }));

    const methodPaymentOptions = Object.keys(MethodPayment).map(key => ({
        label: MethodPayment[key],
        value: key
    }));

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
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
                                                    disabled={item.quantity >= item.stock} // Deshabilitar si se alcanza el stock
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
                                <tr style={{ fontSize: '15px' }}>
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
                                onClick={() => openNew()}
                            />
                        </div>
                    )}
                </div>
            </Dialog>

            {/* CONFIRM SALE */}
            <Dialog visible={saleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar venta" modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                <FloatDropdownIcon
                    className="field mt-5"
                    icon='currency_exchange' field='methodPayment' required
                    value={selectedMethodPayment}
                    handleChange={setSelectedMethodPayment}
                    onInputNumberChange={onInputNumberChange}
                    options={methodPaymentOptions}
                    placeholder="Seleccionar el método de pago"
                    submitted={submitted} fieldForeign={sale.methodPayment}
                    label="Método de pago" errorMessage="Método de pago es requerido."
                />
                <FloatDropdownIcon
                    className="field mt-5"
                    icon='new_releases' field='state' required
                    value={selectedState}
                    handleChange={setSelectedState}
                    onInputNumberChange={onInputNumberChange}
                    options={stateOptions}
                    placeholder="Seleccionar el estado"
                    submitted={submitted} fieldForeign={sale.state}
                    label="Estado" errorMessage="Estado es requerido."
                />
                <p className='mt-4'>
                    <span className="text-right font-bold" style={{ padding: '1rem' }}>Total:</span>
                    <span className="text-center font-bold" style={{ padding: '1rem' }}>{formatCurrency(getTotal())}</span>
                </p>
            </Dialog>

            {confirmDialog(confirmDialogVisible, 'Venta', confirmSaleDialogFooter, hideConfirmSaleDialog, sale, 1)}
        </div>
    );
};

export default CartModal;
