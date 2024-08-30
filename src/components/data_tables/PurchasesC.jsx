import React, { useState, useEffect, useRef } from 'react';
import Request_Service from '../service/Request_Service';
import { actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, DialogDelete, DialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import CustomDataTable from '../CustomDataTable';
import { Dialog } from 'primereact/dialog';
import { FloatDropdownIcon, FloatDropdownSearchIcon, FloatInputNumberMoneyIcon } from '../Inputs';

export default function PurchasesC() {

    let emptyPurchase = {
        idPurchase: null,
        provider: '',
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

    const URL = '/purchase/';
    const [purchase, setPurchase] = useState(emptyPurchase);
    const [purchases, setPurchases] = useState([]);
    const [providers, setProviders] = useState([]); //analizar si el proveedor lo deberia traer automatico
    const [books, setBooks] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deletePurchaseDialog, setDeletePurchaseDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchPurchases();
        //getBooks();
        //getProviders();
        //getProducts();
    }, [onlyDisabled]); // Fetch data when onlyDisabled changes

    const fetchPurchases = async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setPurchases);
        } catch (error) {
            console.error("Fallo al recuperar compras:", error);
        }
    }

    const getProviders = () => {
        return Request_Service.getData('/provider/all', setProviders);
    }

    const getBooks = () => {
        return Request_Service.getData('/book/all', setBooks);
    }

    const getProducts = () => {
        return Request_Service.getData('/product/all', setProducts);
    }

    const handleProductChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            Request_Service.getData(`/product/productsByProvider/${providerId.idProvider}`, setProducts);
        }
    };

    const openNew = () => {
        setPurchase(emptyPurchase);
        //setDetail(emptyDetail);
        setTitle('Registrar Compra');
        setSelectedProvider('');
        setSelectedMethodPayment('');
        setSelectedState('');
        setSelectedBook('');
        setSelectedProduct('');
        getBooks();
        // getProducts();
        setProducts([]);
        getProviders();
        setOperation(1);
        setSubmitted(false);
        //setDetails([emptyDetail]); // Asegura que siempre haya al menos un detalle al abrir el modal
        setPurchaseDialog(true);
    };

    const editPurchase = (purchase) => {
        /*setProduct({ ...product });
        getCategories();
        getProviders();
        setSelectedCategory(product.category);
        setSelectedProvider(product.provider);
        setFile('');
        setSelectedImage('');
        setTitle('Editar Producto');
        setOperation(2);
        setProductDialog(true);*/
    }

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPurchaseDialog(false);
    };

    const hideConfirmPurchaseDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeletePurchaseDialog = () => {
        setDeletePurchaseDialog(false);
    };

    const savePurchase = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid =
            purchase.total &&
            purchase.provider &&
            purchase.methodPayment &&
            purchase.state &&
            purchase.details;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (purchase.idPurchase && operation === 2) {
            parameters = {
                idPurchase: purchase.idPurchase,
                details: purchase.details,
                fkIdProvider: purchase.provider.idProvider,
                //payment
                total: purchase.total,
                state: purchase.state,
                methodPayment: purchase.methodPayment
            };
            url = URL + 'update/' + purchase.idPurchase;
            method = 'PUT';
        } else {
            parameters = {
                //details: purchase.details,
                details: [
                    {
                        "idProduct": 2,
                        "quantity": 20,
                        "unitPrice": 2800
                    }
                ],
                fkIdProvider: purchase.provider.idProvider,
                //payment
                total: purchase.total,
                state: purchase.state,
                methodPayment: purchase.methodPayment
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Compra ', URL.concat('all'), setPurchases);
            setPurchaseDialog(false);
            setPurchase(emptyPurchase);
        }
    }

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeletePurchase = (purchase) => {
        confirmDelete(purchase, setPurchase, setDeletePurchaseDialog);
    };

    const deletePurchase = () => {
        Request_Service.deleteData(URL, purchase.idPurchase, setPurchases, toast, setDeletePurchaseDialog, setPurchase, emptyPurchase, 'Compra ', URL.concat('all'));
    };

    const handleEnable = (purchase) => {
        Request_Service.sendRequestEnable(URL, purchase.idPurchase, setPurchases, toast, 'Compra ');
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, purchase, setPurchase);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total);
    };

    const dateTemplate = (rowData) => {
        return formatDate(rowData.date);
    }

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editPurchase, confirmDeletePurchase, onlyDisabled, handleEnable);
    };

    const purchaseDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmPurchaseDialogFooter = (
        confirmDialogFooter(hideConfirmPurchaseDialog, savePurchase)
    );

    const deletePurchaseDialogFooter = (
        deleteDialogFooter(hideDeletePurchaseDialog, deletePurchase)
    );

    const selectedProviderTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const providerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedProductTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const productOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const stateOptions = Object.keys(State).map(key => ({
        label: State[key],
        value: key
    }));

    const methodPaymentOptions = Object.keys(MethodPayment).map(key => ({
        label: MethodPayment[key],
        value: key
    }));

    const columns = [
        { field: 'date', header: 'Fecha', body: dateTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'total', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '10rem' } },
        { field: 'provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '8rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns.slice(0, -2), purchases, 'Reporte_Compras') };
    const handleExportExcel = () => { exportExcel(purchases, columns.slice(0, -2), 'Compras') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={purchases}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Compras"
                    globalFilter={globalFilter}
                    header={header('Compras', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={purchaseDialog} style={{ width: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                    <FloatDropdownSearchIcon
                        className="field mt-5"
                        icon='local_shipping' field='provider' required autoFocus
                        value={selectedProvider}
                        handleChange={handleProductChange}
                        onInputNumberChange={onInputNumberChange}
                        options={providers} optionLabel="name"
                        placeholder="Seleccionar proveedor"
                        valueTemplate={selectedProviderTemplate}
                        itemTemplate={providerOptionTemplate}
                        submitted={submitted} fieldForeign={purchase.provider}
                        label="Proveedor" errorMessage="Proveedor es requerido."
                    />
                    <div className="formgrid grid mt-5">
                        <FloatInputNumberMoneyIcon
                            className="field col"
                            value={purchase.total}
                            onInputNumberChange={onInputNumberChange} field='total'
                            maxLength={10} required
                            submitted={submitted}
                            label='Total'
                            errorMessage='Total de compra es requerido.'
                        />
                        <FloatDropdownIcon
                            className="field col"
                            icon='currency_exchange' field='methodPayment' required
                            value={selectedMethodPayment}
                            handleChange={setSelectedMethodPayment}
                            onInputNumberChange={onInputNumberChange}
                            options={methodPaymentOptions}
                            placeholder="Seleccionar el método de pago"
                            submitted={submitted} fieldForeign={purchase.methodPayment}
                            label="Método de pago" errorMessage="Método de pago es requerido."
                        />
                    </div>
                    <FloatDropdownIcon
                        className="field mt-3"
                        icon='new_releases' field='state' required
                        value={selectedState}
                        handleChange={setSelectedState}
                        onInputNumberChange={onInputNumberChange}
                        options={stateOptions}
                        placeholder="Seleccionar el estado"
                        submitted={submitted} fieldForeign={purchase.state}
                        label="Estado" errorMessage="Estado es requerido."
                    />

                    <FloatDropdownSearchIcon
                        className="field mt-5"
                        icon='local_shipping' field='product' required
                        value={selectedProduct}
                        handleChange={selectedProduct}
                        onInputNumberChange={onInputNumberChange}
                        options={products} optionLabel="name"
                        placeholder="Seleccionar producto"
                        valueTemplate={selectedProductTemplate}
                        itemTemplate={productOptionTemplate}
                        disabled={(!selectedProvider) && 'disabled'}
                        submitted={submitted} fieldForeign={purchase.provider}
                        label="Producto" errorMessage="Producto es requerido."
                    />
                </Dialog>
            </div>

            {DialogDelete(deletePurchaseDialog, 'Compra', deletePurchaseDialogFooter, hideDeletePurchaseDialog, purchase, purchase.idPurchase, 'la compra')}
            {confirmDialog(confirmDialogVisible, 'Compra', confirmPurchaseDialogFooter, hideConfirmPurchaseDialog, purchase, operation)}
        </div>
    );
};
