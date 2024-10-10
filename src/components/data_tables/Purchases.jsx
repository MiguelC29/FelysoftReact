import React, { useState, useEffect, useRef, useCallback } from 'react';
import Request_Service from '../service/Request_Service';
import { confirmDialog, confirmDialogFooter, DialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputNumberChange, leftToolbarTemplatePurchase, rightToolbarTemplateExport } from '../../functionsDataTable';
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
        editorial: '',
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
        salePrice: null,
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
    const [editorials, setEditorials] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedEditorial, setSelectedEditorial] = useState(null);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [purchaseDetailDialog, setPurchaseDetailDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [isProduct, setIsProduct] = useState(true); // true para productos, false para libros
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalFilter, setGlobalFilter] = useState(null);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchPurchases = useCallback(async () => {
        try {
            await Request_Service.getData(`${URL}all`, setPurchases);
        } catch (error) {
            console.error("Fallo al recuperar compras:", error);
        }
    }, []);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    const calculateTotal = useCallback(() => {
        const total = details.reduce((acc, detail) => {
            if (detail.unitPrice) {
                if (detail.product) {
                    if (detail.quantity) {
                        return acc + (detail.quantity * detail.unitPrice);
                    }

                } else if (detail.book) {
                    return acc + (detail.unitPrice);
                }
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

    const getEditorials = () => {
        return Request_Service.getData('/editorial/all', setEditorials);
    }

    const handleProductChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            Request_Service.getData(`/product/productsByProvider/${providerId.idProvider}`, setProducts);
        } else {
            setProducts([]);
        }
    };

    const handleEditorialChange = (editorialId) => {
        setSelectedEditorial(editorialId);
        if (editorialId) {
            Request_Service.getData(`/book/booksByEditorial/${editorialId.idEditorial}`, setBooks);
        } else {
            setProducts([]);
        }
    };

    const handleProductSelection = (index, product) => {
        const updatedDetails = [...details];
        updatedDetails[index].product = product;
        if (product) {
            updatedDetails[index].book = null;

            // Actualiza el salePrice con el valor del producto seleccionado
            if (product) {
                updatedDetails[index].salePrice = product.salePrice; // Asegúrate de que product.salePrice esté disponible
            } else {
                updatedDetails[index].salePrice = null; // Opcional: Limpia el salePrice si no hay producto
            }
        }
        setDetails(updatedDetails);
    };

    const handleBookSelection = (index, book) => {
        const updatedDetails = [...details];
        updatedDetails[index].book = book;
        if (book) {
            updatedDetails[index].product = null;
        }
        setDetails(updatedDetails);
    };

    const openNew = (isProduct) => {
        setPurchase(emptyPurchase);
        setTitle('Registrar Compra');
        setSelectedProvider('');
        setSelectedMethodPayment('');
        setSelectedState('');
        setSelectedEditorial('');
        setProducts([]);
        setSubmitted(false);
        setErrors({});
        setDetails([{ ...emptyDetail }]); // Inicializa con un detalle vacío
        setPurchaseDialog(true);

        if (isProduct) {
            // Si es un producto, cargar proveedores y productos
            getProviders();
        } else {
            // Si es un libro, cargar libros y editoriales
            getEditorials();
        }
    };

    const openDetail = (purchase) => {
        setPurchase({ ...purchase });
        Request_Service.getData(`/detail/purchaseDetails/${purchase.idPurchase}`, setDetailsList);
        setTitle('Datos Compra');
        setPurchaseDetailDialog(true);
    }

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

    const hideDialog = () => {
        setSubmitted(false);
        setPurchaseDialog(false);
        setPurchaseDetailDialog(false);
    };

    const hideConfirmPurchaseDialog = () => {
        setConfirmDialogVisible(false);
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
            purchase.methodPayment &&
            purchase.state &&
            details.length > 0 &&
            details.every(detail => (detail.product && purchase.provider && detail.quantity && detail.unitPrice && detail.salePrice) || (detail.book && purchase.editorial && detail.unitPrice && detail.salePrice));

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
            salePrice: detail.salePrice,
            idProduct: detail.product ? detail.product.idProduct : null,
            idBook: detail.book ? detail.book.idBook : null,
        }));

        let url, method, parameters;

        parameters = {
            details: processedDetails,
            fkIdProvider: purchase.provider.idProvider,
            fkIdEditorial: purchase.editorial.idEditorial,
            //payment
            total: purchase.total,
            state: purchase.state,
            methodPayment: purchase.methodPayment
        };
        url = URL + 'create';
        method = 'POST';

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, 1, toast, 'Compra ', URL.concat('all'), setPurchases);
            setPurchaseDialog(false);
            setPurchase(emptyPurchase);
            setDetails([emptyDetail]); // Resetea los detalles al guardar
        }
    }

    const confirmSave = () => {
        setConfirmDialogVisible(true);
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

    const selectedEditorialTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const editorialOptionTemplate = (option) => {
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
        { field: 'editorial.name', header: 'Editorial', sortable: true, style: { minWidth: '8rem' } }
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns.slice(0, -2), purchases, 'Reporte_Compras') };
    const handleExportExcel = () => { exportExcel(purchases, columns.slice(0, -2), 'Compras') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de', maxWidth: '1200px' }}>
                <Toolbar className="mb-4 toolbar-datatable" left={leftToolbarTemplatePurchase(openNew, setIsProduct)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={purchases}
                    dataKey="idPurchase"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Compras"
                    globalFilter={globalFilter}
                    header={header('Compras', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={purchaseDialog} style={{ width: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                    {isProduct ?
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
                        /> :
                        <FloatDropdownSearchIcon
                            className="field mt-5"
                            icon='collections_bookmark' field='editorial' required autoFocus
                            value={selectedEditorial}
                            handleChange={handleEditorialChange}
                            onInputNumberChange={onInputNumberChange}
                            options={editorials} optionLabel="name"
                            placeholder="Seleccionar editorial"
                            valueTemplate={selectedEditorialTemplate}
                            itemTemplate={editorialOptionTemplate}
                            submitted={submitted} fieldForeign={purchase.editorial}
                            label="Editorial" errorMessage="Editorial es requerida."
                        />
                    }
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
                                <div className="formgrid grid mt-3 align-items-center">
                                    <div className="col-05">
                                        <strong>{index + 1}.</strong>
                                    </div>
                                    {/* Producto Dropdown */}
                                    {isProduct ? (
                                        <div className="field col-3">
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <span className="material-symbols-outlined">inventory_2</span>
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
                                                        className={`w-full md:w-10rem rounded ${classNames({
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
                                    ) : (
                                        <div className="field col-3">
                                            <div className="p-inputgroup flex-1">
                                                <span className="p-inputgroup-addon">
                                                    <span className="material-symbols-outlined">book</span>
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
                                                        className={`w-full md:w-10rem rounded ${classNames({
                                                            'p-invalid': (submitted && (!detail.book && !errors.book && !detail.product)) || errors[`book_${index}`]
                                                        })}`}

                                                        disabled={(!selectedEditorial || !!detail.product) && 'disabled'}
                                                    />
                                                    <label htmlFor={`book-${index}`} className="font-bold">Libro</label>
                                                </FloatLabel>
                                            </div>
                                            {submitted && !detail.book && !detail.product && <small className="p-error">Libro es requerido.</small>}
                                            {errors[`book_${index}`] && <small className="p-error">{errors[`book_${index}`]}</small>}
                                        </div>
                                    )}

                                    {/* Cantidad */}
                                    {isProduct && (
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

                                    {/* Precio Unitario */}
                                    <FloatInputNumberMoneyIcon
                                        className="field col-3"
                                        value={detail.unitPrice}
                                        onInputNumberChange={(e) => handleDetailChange(index, 'unitPrice', e.value)}
                                        field='unitPrice'
                                        label='Precio de Compra'
                                        required
                                        submitted={submitted}
                                        errorMessage='Precio de compra es requerido.'
                                    />

                                    {/* Precio de Venta */}
                                    <FloatInputNumberMoneyIcon
                                        className="field col-3"
                                        value={detail.salePrice}
                                        onInputNumberChange={(e) => handleDetailChange(index, 'salePrice', e.value)}
                                        field='salePrice'
                                        label={isProduct ? 'Precio de Venta' : 'Precio por Hora'}
                                        required
                                        submitted={submitted}
                                        errorMessage={`Precio ${isProduct ? 'de venta' : 'por hora'} es requerido.`}
                                    />
                                    {/* Botón de eliminar */}
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => removeDetail(index)} disabled={details.length === 1} />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <Button label="Agregar Detalle" icon="pi pi-plus" onClick={addDetail} className="p-button-sm" />
                </Dialog>

                {/* DIALOG DETAIL */}
                <Dialog visible={purchaseDetailDialog} style={{ width: '65rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                    <div className="container mt-4">
                        <div className="row text-center">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined me-2">calendar_clock</span>
                                    <div>
                                        <label htmlFor="date" className="font-bold d-block">Fecha</label>
                                        <p>{(purchase.payment) && dateTemplate(purchase.payment)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined me-2">{(purchase.provider) ? 'local_shipping' : 'collections_bookmark'}</span>
                                    <div>
                                        <label htmlFor="provider" className="font-bold d-block">{(purchase.provider) ? 'Proveedor' : 'Editorial'}</label>
                                        <p>{(purchase.provider) ? purchase.provider.name : purchase.editorial.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row text-center">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined me-2">currency_exchange</span>
                                    <div>
                                        <label htmlFor="methodPayment" className="font-bold d-block">Método de pago</label>
                                        <p>{(purchase.payment) && purchase.payment.methodPayment}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined me-2">new_releases</span>
                                    <div>
                                        <label htmlFor="state" className="font-bold d-block">Estado</label>
                                        <p>{(purchase.payment) && purchase.payment.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4 className='text-center fw-semibold'>Lista de Detalles</h4>
                        {/* Tabla de Detalles */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover text-center">
                                <thead>
                                    <tr>
                                        <th>{purchase.provider ? 'Producto' : 'Libro'}</th>
                                        <th>Cantidad</th>
                                        <th>Precio de Compra</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailsList && detailsList.map((detail, index) => (
                                        <tr key={index}>
                                            <td>
                                                {(detail.product && detail.product.name) || (detail.book && detail.book.title)}
                                            </td>
                                            <td>{(detail.product) ? detail.quantity : 1}</td>
                                            <td>{detail.unitPrice && formatCurrency(detail.unitPrice)}</td>
                                            <td>{(detail.product && detail.unitPrice && detail.quantity && formatCurrency(detail.unitPrice * detail.quantity)) || (detail.book && detail.unitPrice && formatCurrency(detail.unitPrice))}</td>
                                        </tr>
                                    ))}
                                    {/* Total */}
                                    <tr>
                                        <td colSpan="3" className="text-end font-bold">Total:</td>
                                        <td>{purchase.total && priceBodyTemplate(purchase)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Dialog>
            </div>

            {confirmDialog(confirmDialogVisible, 'Compra', confirmPurchaseDialogFooter, hideConfirmPurchaseDialog, purchase, 1)}
        </div>
    );
};
