import React, { useState, useEffect, useRef, useCallback } from 'react';
import Request_Service from '../service/Request_Service';
import { actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, DialogDelete, DialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import CustomDataTable from '../CustomDataTable';
import { Dialog } from 'primereact/dialog';
import { FloatDropdownIcon, FloatDropdownSearchIcon, FloatInputNumberIcon, FloatInputNumberMoneyIcon } from '../Inputs';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

export default function Purchases() {

    let emptyPurchase = {
        idPurchase: null,
        provider: '',
        details: [],
        // payment
        methodPayment: '',
        total: null,
        state: ''
    };

    let emptyDetail = {
        idDetail: null,
        quantity: null,
        unitPrice: null,
        product: null,
        book: null,
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
    const [providers, setProviders] = useState([]);
    const [details, setDetails] = useState([emptyDetail]); // Inicia con un detalle vacío
    const [detailsList, setDetailsList] = useState([]);
    const [books, setBooks] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [purchaseDetailDialog, setPurchaseDetailDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deletePurchaseDialog, setDeletePurchaseDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [isProductSelected, setIsProductSelected] = useState(null); // null, 'product', or 'book'
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchPurchases = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setPurchases);
        } catch (error) {
            console.error("Fallo al recuperar compras:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchPurchases();
    }, [onlyDisabled, fetchPurchases]);

    const calculateTotal = useCallback(() => {
        const total = details.reduce((acc, detail) => {
            if (detail.quantity && detail.unitPrice) {
                return acc + (detail.quantity * detail.unitPrice);
            }
            return acc;
        }, 0);

        setPurchase(prevPurchase => ({
            ...prevPurchase,
            total
        }));
    }, [details]);

    useEffect(() => {
        calculateTotal();
    }, [details, calculateTotal]);

    const getProviders = () => {
        return Request_Service.getData('/provider/all', setProviders);
    }

    const getBooks = () => {
        return Request_Service.getData('/book/all', setBooks);
    }

    const handleProductChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            Request_Service.getData(`/product/productsByProvider/${providerId.idProvider}`, setProducts);
        } else {
            setProducts([]);
        }
    };

    const openNew = () => {
        setPurchase(emptyPurchase);
        setTitle('Registrar Compra');
        setSelectedProvider('');
        setSelectedMethodPayment('');
        setSelectedState('');
        setIsProductSelected(null);
        setProducts([]);
        getProviders();
        getBooks();
        setOperation(1);
        setSubmitted(false);
        setErrors({});
        setDetails([{ ...emptyDetail }]); // Inicializa con un detalle vacío
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

    const openDetail = (purchase) => {
        setPurchase({ ...purchase });
        Request_Service.getData(`/detail/details/${purchase.idPurchase}`, setDetailsList);
        setTitle('Datos Compra');
        setPurchaseDetailDialog(true);
    }

    const handleProductSelection = (index, product) => {
        const updatedDetails = [...details];
        updatedDetails[index].product = product;
        if (product) {
            updatedDetails[index].book = null;
            if (isProductSelected === null) {
                setIsProductSelected('product');
            }
        }
        setDetails(updatedDetails);
    };

    const handleBookSelection = (index, book) => {
        const updatedDetails = [...details];
        updatedDetails[index].book = book;
        if (book) {
            updatedDetails[index].product = null;
            if (isProductSelected === null) {
                setIsProductSelected('book');
            }
        }
        setDetails(updatedDetails);
    };

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...details];
        if (field === 'product') {
            updatedDetails[index].product = value;
            updatedDetails[index].book = null;
        } else if (field === 'book') {
            updatedDetails[index].book = value;
            updatedDetails[index].product = null;
        } else {
            updatedDetails[index][field] = value;
        }
        setDetails(updatedDetails);
    };

    const addDetail = () => {
        setDetails([...details, { ...emptyDetail }]);
    };

    const removeDetail = (index) => {
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPurchaseDialog(false);
        setPurchaseDetailDialog(false);
    };

    const hideConfirmPurchaseDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeletePurchaseDialog = () => {
        setDeletePurchaseDialog(false);
    };

    const validateDetails = () => {
        const productSet = new Set();
        const bookSet = new Set();
        let errors = {};

        details.forEach((detail, index) => {
            if (detail.product) {
                if (productSet.has(detail.product.idProduct)) {
                    errors[`product_${index}`] = `El producto en el detalle ${index + 1} se repite.`;
                } else {
                    productSet.add(detail.product.idProduct);
                }
            }

            if (detail.book) {
                if (bookSet.has(detail.book.idBook)) {
                    errors[`book_${index}`] = `El libro en el detalle ${index + 1} se repite.`;
                } else {
                    bookSet.add(detail.book.idBook);
                }
            }
        });

        return errors;
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
            details.length > 0 &&
            details.every(detail => (detail.product && detail.quantity && detail.unitPrice) || (detail.book && detail.unitPrice));

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        };

        // Validar los detalles
        const validationErrors = validateDetails();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Si hay errores de validación, no continuar con el guardado
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor corrija los detalles repetidos.', life: 3000 });
            return;
        }

        const processedDetails = details.map(detail => ({
            idDetail: detail.idDetail,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            idProduct: detail.product ? detail.product.idProduct : null,
            idBook: detail.book ? detail.book.idBook : null,
        }));

        let url, method, parameters;

        if (purchase.idPurchase && operation === 2) {
            parameters = {
                idPurchase: purchase.idPurchase,
                details: processedDetails,
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
                details: processedDetails,
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
            setDetails([emptyDetail]); // Resetea los detalles al guardar
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

    const detailsBodyTemplate = (rowData) => {
        return <Button icon="pi pi-angle-right" className="p-button-text" onClick={() => openDetail(rowData)} style={{ background: 'none', border: 'none', padding: '0', boxShadow: 'none', color: '#183462' }}
        />
    }

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

    // Template para mostrar el producto seleccionado
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

    // Template para mostrar el libro seleccionado
    const selectedBookTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.title}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    // Template para opciones de productos
    const productOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    // Template para opciones de libros
    const bookOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.title}</div>
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
        { body: detailsBodyTemplate, exportable: false, style: { minWidth: '1rem' } },
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
                            value={purchase.total} field='total'
                            required
                            label='Total'
                            disabled="disabled"
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

                    <div className="formgrid grid mt-3">
                        {details.map((detail, index) => (
                            <div key={index} className="field col-12">
                                <div className="formgrid grid mt-3">
                                    <div className="col-1">
                                        <strong>{index + 1}.</strong>
                                    </div>
                                    {isProductSelected !== 'book' && (
                                        <div className="field col-3">
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <span class="material-symbols-outlined">inventory_2</span>
                                                </span>
                                                <FloatLabel>
                                                    <Dropdown
                                                        id={`product-${index}`}
                                                        value={detail.product}
                                                        onChange={(e) => { handleProductSelection(index, e.value) }}
                                                        options={products}
                                                        optionLabel="name"
                                                        placeholder="Seleccionar producto"
                                                        emptyMessage="No hay datos"
                                                        emptyFilterMessage="No hay resultados encontrados"
                                                        required
                                                        valueTemplate={selectedProductTemplate}
                                                        itemTemplate={productOptionTemplate}
                                                        className={`w-full md:w-13rem rounded ${classNames({
                                                            'p-invalid': (submitted && (!detail.product && !detail.book)) || errors[`product_${index}`]
                                                        })}`}
                                                        disabled={(!selectedProvider || !!detail.book) && 'disabled'}
                                                    />
                                                    <label htmlFor={`product-${index}`} className="font-bold">Producto</label>
                                                </FloatLabel>
                                            </div>
                                            {submitted && !detail.product && !detail.book && <small className="p-error">Producto es requerido.</small>}
                                            {errors[`product_${index}`] && <small className="p-error">{errors[`product_${index}`]}</small>}
                                        </div>
                                    )}
                                    {isProductSelected !== 'product' && (
                                        <div className="field col-3">
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <span class="material-symbols-outlined">book</span>
                                                </span>
                                                <FloatLabel>
                                                    <Dropdown
                                                        id={`book-${index}`}
                                                        value={detail.book}
                                                        onChange={(e) => { handleBookSelection(index, e.value) }}
                                                        options={books}
                                                        optionLabel="title"
                                                        placeholder="Seleccionar libro"
                                                        emptyMessage="No hay datos"
                                                        emptyFilterMessage="No hay resultados encontrados"
                                                        required
                                                        valueTemplate={selectedBookTemplate}
                                                        itemTemplate={bookOptionTemplate}
                                                        className={`w-full md:w-13rem rounded ${classNames({
                                                            'p-invalid': (submitted && (!detail.book && !errors.book && !detail.product)) || errors[`book_${index}`]
                                                        })}`}

                                                        disabled={(!selectedProvider || !!detail.product) && 'disabled'}
                                                    />
                                                    <label htmlFor={`book-${index}`} className="font-bold">Libro</label>
                                                </FloatLabel>
                                            </div>
                                            {submitted && !detail.book && !detail.product && <small className="p-error">Libro es requerido.</small>}
                                            {errors[`book_${index}`] && <small className="p-error">{errors[`book_${index}`]}</small>}
                                        </div>
                                    )}

                                    {isProductSelected !== 'book' && (
                                        <FloatInputNumberIcon
                                            className="field col-2"
                                            icon='production_quantity_limits'
                                            value={detail.quantity}
                                            onInputNumberChange={(e) => handleDetailChange(index, 'quantity', e.value)}
                                            field='quantity'
                                            label='Cantidad'
                                            maxLength={5} required
                                            submitted={submitted}
                                            errorMessage='Cantidad es requerida.'
                                        />
                                    )}

                                    <FloatInputNumberMoneyIcon
                                        className="field col-2"
                                        value={detail.unitPrice}
                                        onInputNumberChange={(e) => handleDetailChange(index, 'unitPrice', e.value)}
                                        field='unitPrice'
                                        label='Precio Unitario'
                                        required
                                        submitted={submitted}
                                        errorMessage='Precio unitario es requerido.'
                                    />
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => removeDetail(index)} disabled={details.length === 1} />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <Button label="Agregar Detalle" icon="pi pi-plus" onClick={addDetail} className="p-button-sm" />

                </Dialog>

                {/* DIALOG DETAIL */}
                <Dialog visible={purchaseDetailDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                    <div className="container mt-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">local_shipping</span>
                                    <div>
                                        <label htmlFor="provider" className="font-bold d-block">Proveedor</label>
                                        <p>{(purchase.provider) && purchase.provider.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">monetization_on</span>
                                    <div>
                                        <label htmlFor="provider" className="font-bold d-block">Total</label>
                                        <p>{(purchase.total) && priceBodyTemplate(purchase)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">currency_exchange</span>
                                    <div>
                                        <label htmlFor="methodPayment" className="font-bold d-block">Método de pago</label>
                                        <p>{(purchase.payment) && purchase.payment.methodPayment}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">new_releases</span>
                                    <div>
                                        <label htmlFor="state" className="font-bold d-block">Estado</label>
                                        <p>{(purchase.payment) && purchase.payment.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">calendar_clock</span>
                                    <div>
                                        <label htmlFor="date" className="font-bold d-block">Fecha</label>
                                        <p>{(purchase.payment) && dateTemplate(purchase.payment)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4 className='text-center'>Lista de Detalles</h4>
                        {detailsList && (
                            detailsList.map((detail, index) => (
                                <div key={index} className="row mb-3">
                                    <div className={(!detail.book) ? 'col-md-5' : 'col-md-6'}>
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">{(detail.product) ? 'inventory_2' : 'book'}</span>
                                            <div>
                                                <label htmlFor={(detail.product) ? 'product' : 'book'} className="font-bold d-block">{(detail.product) ? 'Producto' : 'Libro'}</label>
                                                <p>{(detail.product) ? detail.product.name : detail.book.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {!detail.book &&
                                        <div className="col-md-3">
                                            <div className="d-flex align-items-start">
                                                <span className="material-symbols-outlined me-2">production_quantity_limits</span>
                                                <div>
                                                    <label htmlFor="quantity" className="font-bold d-block">Cantidad</label>
                                                    <p>{(detail.product) && detail.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className={(!detail.book) ? 'col-md-4' : 'col-md-6'}>
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">monetization_on</span>
                                            <div>
                                                <label htmlFor="unitPrice" className="font-bold d-block">Precio Unitario</label>
                                                <p>{(detail.unitPrice) && formatCurrency(detail.unitPrice)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Dialog>
            </div>

            {DialogDelete(deletePurchaseDialog, 'Compra', deletePurchaseDialogFooter, hideDeletePurchaseDialog, purchase, purchase.idPurchase, 'la compra')}
            {confirmDialog(confirmDialogVisible, 'Compra', confirmPurchaseDialogFooter, hideConfirmPurchaseDialog, purchase, operation)}
        </div>
    );
};
