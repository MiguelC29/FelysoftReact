import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';

export default function Purchases() {
    let emptyPurchase = {
        idPurchase: null,
        total: null,
        description: '',
        methodPayment: '',
        state: '',
        provider: '',
    }

    let emptyDetail = {
        idDetail: null,
        quantity: null,
        unitPrice: null,
        book: '',
        product: '',
        service: '',
    }

    const initialDetail = {
        product: "",
        book: "",
        // otros campos si es necesario
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
    const [expensePurchase, setExpensePurchase] = useState();
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deletePurchaseDialog, setDeletePurchaseDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [onlyDisabled, setOnlyDisabled] = useState(false);
    // Estado para manejar detalles de compra
    const [detail, setDetail] = useState(emptyDetail);
    const [details, setDetails] = useState([initialDetail]);
    const [books, setBooks] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const isAdmin = UserService.isAdmin();
    const isInventoryManager = UserService.isInventoryManager();
    const isFinancialManager = UserService.isFinancialManager();

    useEffect(() => {
        fetchPurchases();
        Request_Service.getData('/provider/all', setProviders);
        Request_Service.getData('/book/all', setBooks);
        Request_Service.getData('/product/all', setProducts);
        Request_Service.getData('/service/all', setServices);

        // Verifica si expensePurchase tiene datos y si contiene la descripción
        if (expensePurchase && expensePurchase.description) {
            setPurchase(prevPurchase => ({ ...prevPurchase, description: expensePurchase.description })); // Establece la descripción basada en los datos recibidos
        }
        // Verifica si expensePurchase tiene datos de pago y si contiene el método de pago
        if (expensePurchase && expensePurchase.payment && expensePurchase.payment.methodPayment) {
            setSelectedMethodPayment(expensePurchase.payment.methodPayment); // Establece el método de pago basado en los datos recibidos
        }
        // Verifica si expensePurchase tiene datos de pago y si contiene el estado
        //NO FUNCIONA
        if (expensePurchase && expensePurchase.payment && expensePurchase.payment.state) {
            setSelectedState(expensePurchase.payment.state); // Establece el estado basado en los datos recibidos
        }
    }, [onlyDisabled]);

    const fetchPurchases = async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setPurchases);
        } catch (error) {
            console.error("Fallo al recuperar compras:", error);
        }
    }

    const openNew = () => {
        setPurchase(emptyPurchase);
        setDetail(emptyDetail);
        setTitle('Registrar Compra');
        setSelectedProvider('');
        setSelectedMethodPayment('');
        setSelectedState('');
        setSelectedBook('');
        setSelectedProduct('');
        setSelectedService('');
        setOperation(1);
        setSubmitted(false);
        setDetails([emptyDetail]); // Asegura que siempre haya al menos un detalle al abrir el modal
        setPurchaseDialog(true);
    };

    const editPurchase = (purchase) => {
        setPurchase({ ...purchase });
        // Obtener los datos de expensePurchase
        Request_Service.getData(URL.concat('expensePurchase/', purchase.idPurchase), setExpensePurchase);
        setSelectedProvider(purchase.provider);
        setTitle('Editar Compra');
        setOperation(2);
        setPurchaseDialog(true);
    };

    const addDetail = () => {
        setDetails([...details, initialDetail]);
    };

    const onDetailChange = (e, index, field) => {
        const newDetails = [...details];
        newDetails[index][field] = e.value;
        setDetails(newDetails);
    };

    const removeDetail = (index) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
    };

    // Definir métodos para manejar el cambio de producto y libro
    const handleProductChange = (e, index) => {
        const updatedDetails = [...details];
        updatedDetails[index].selectedProduct = e.value;
        updatedDetails[index].selectedBook = null; // Resetea el libro seleccionado
        setDetails(updatedDetails);
    };

    const handleBookChange = (e, index) => {
        const updatedDetails = [...details];
        updatedDetails[index].selectedBook = e.value;
        updatedDetails[index].selectedProduct = null; // Resetea el producto seleccionado
        setDetails(updatedDetails);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPurchaseDialog(false);
        setDetails([]); // Limpia los detalles al cerrar el modal
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
        const isValid = purchase.total &&
            purchase.provider &&
            purchase.description.trim() &&
            purchase.methodPayment &&
            purchase.state;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (purchase.idPurchase && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idPurchase: purchase.idPurchase,
                total: purchase.total,
                description: purchase.description.trim(),
                methodPayment: purchase.methodPayment,
                state: purchase.state,
                fkIdProvider: purchase.provider.idProvider
            };
            url = URL + 'update/' + purchase.idPurchase;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                total: purchase.total,
                description: purchase.description.trim(),
                methodPayment: purchase.methodPayment,
                state: purchase.state,
                fkIdProvider: purchase.provider.idProvider
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Compra ', URL.concat('all'), setPurchases);
            setPurchaseDialog(false);
        }
    };

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
    }

    const onInputChange = (e, name) => {
        inputChange(e, name, purchase, setPurchase);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, purchase, setPurchase);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total);
    };

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

    const bookOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.title}</div>
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

    const selectedServiceTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.typeService.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const serviceOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.typeService.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'date', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.date), style: { minWidth: '12rem' } },
        { field: 'total', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '10rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    const methodPaymentOptions = Object.keys(MethodPayment).map(key => ({
        label: MethodPayment[key],
        value: key
    }));

    const stateOptions = Object.keys(State).map(key => ({
        label: State[key],
        value: key
    }));

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, purchases, 'Reporte_Compras') };
    const handleExportExcel = () => { exportExcel(purchases, columns, 'Compras') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={(isAdmin || isInventoryManager) && leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={(isAdmin || isFinancialManager) && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={purchases}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Compras"
                    globalFilter={globalFilter}
                    header={header('Compras', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={purchaseDialog} style={{ width: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">local_shipping</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="provider"
                                value={selectedProvider}
                                onChange={(e) => {
                                    setSelectedProvider(e.value);
                                    onInputNumberChange(e, 'provider');
                                }}
                                options={providers}
                                optionLabel="name"
                                placeholder="Seleccionar Proveedor"
                                filter valueTemplate={selectedProviderTemplate}
                                itemTemplate={providerOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados"
                                required
                                autoFocus
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !purchase.provider && !selectedProvider })}`}
                            />
                            <label htmlFor="provider" className="font-bold">Proveedor</label>
                        </FloatLabel>
                    </div>
                    {submitted && !purchase.state && !selectedState && <small className="p-error">Proveedor es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" maxLength={100} value={purchase.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !purchase.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !purchase.description && <small className="p-error">Descripcion es requerida.</small>}
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">monetization_on</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="total" maxLength={10} value={purchase.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': submitted && !purchase.total })}`} />
                                <label htmlFor="total" className="font-bold">Total</label>
                            </FloatLabel>
                        </div>
                        {submitted && !purchase.total && <small className="p-error">Total de compra es requerido.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">currency_exchange</span>
                            </span>
                            <FloatLabel>
                                <Dropdown
                                    id="methodPayment"
                                    value={selectedMethodPayment}
                                    onChange={(e) => { setSelectedMethodPayment(e.value); onInputNumberChange(e, 'methodPayment'); }}
                                    options={methodPaymentOptions}
                                    placeholder="Seleccionar el método de pago"
                                    emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados"
                                    required
                                    className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': submitted && !purchase.methodPayment && !selectedMethodPayment })}`}
                                />
                                <label htmlFor="methodPayment" className="font-bold">Método de pago</label>
                            </FloatLabel>
                        </div>
                        {submitted && !purchase.methodPayment && !selectedMethodPayment && <small className="p-error">Método de pago es requerido.</small>}
                    </div>
                </div>
                <div className="field mt-3">
                    <FloatLabel>
                        <Dropdown
                            id="state"
                            name='state'
                            value={selectedState}
                            onChange={(e) => { setSelectedState(e.value); onInputNumberChange(e, 'state'); }}
                            options={stateOptions}
                            placeholder="Seleccionar el estado"
                            emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados"
                            required
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !purchase.state && !selectedState })}`}
                        />
                        <label htmlFor="state" className="font-bold">Estado</label>
                    </FloatLabel>
                    {submitted && !purchase.state && !selectedState && <small className="p-error">Estado es requerido.</small>}
                </div>
                {details.map((detail, index) => (
                    <div key={index} className="formgrid grid mt-5">
                        <div className="field col">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <span class="material-symbols-outlined">inventory_2</span>
                                </span>
                                <FloatLabel>
                                    <Dropdown
                                        id="product"
                                        value={detail.product}
                                        /*onChange={(e) => {
                                            setSelectedProduct(e.value);
                                            onInputNumberChange(e, 'product');
                                            handleProductChange(e, index);
                                        }}*/
                                        onChange={(e) => {
                                            const newDetails = [...details];
                                            newDetails[index].product = e.target.value;
                                            setDetails(newDetails);
                                        }}
                                        options={products}
                                        optionLabel="name"
                                        filter valueTemplate={selectedProductTemplate}
                                        itemTemplate={productOptionTemplate}
                                        placeholder="Seleccionar Producto"
                                        emptyMessage="No hay datos"
                                        emptyFilterMessage="No hay resultados encontrados"
                                        required
                                        disabled={detail.book !== ""}
                                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.product && !selectedProduct })}`}
                                    />
                                    <label htmlFor="product" className="font-bold">Producto</label>
                                </FloatLabel>
                            </div>
                            {submitted && !detail.product && !selectedProduct && <small className="p-error">Producto es requerido.</small>}
                        </div>

                        <div className="field col">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <span class="material-symbols-outlined">book</span>
                                </span>
                                <FloatLabel>
                                    <Dropdown
                                        id="book"
                                        value={detail.book}
                                        onChange={(e) => {
                                            const newDetails = [...details];
                                            newDetails[index].book = e.target.value;
                                            setDetails(newDetails);
                                        }}
                                        options={books}
                                        optionLabel="title"
                                        placeholder="Seleccionar Libro"
                                        filter valueTemplate={selectedBookTemplate}
                                        itemTemplate={bookOptionTemplate}
                                        emptyMessage="No hay datos"
                                        emptyFilterMessage="No hay resultados encontrados"
                                        required
                                        disabled={detail.product !== ""}
                                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.book && !selectedBook })}`}
                                    />
                                    <label htmlFor="book" className="font-bold">Libro</label>
                                </FloatLabel>
                            </div>
                            {submitted && !detail.book && !selectedBook && <small className="p-error">Libro es requerido.</small>}
                        </div>

                        <div className="field col">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <span class="material-symbols-outlined">production_quantity_limits</span>
                                </span>
                                <FloatLabel>
                                    <InputNumber
                                        id={`quantity-${index}`}
                                        value={detail.quantity}
                                        onValueChange={(e) => onDetailChange(e, index, 'quantity')}
                                        mode="decimal"
                                        required
                                        className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': submitted && !detail.quantity })}`}
                                    />
                                    <label htmlFor={`quantity-${index}`} className="font-bold">Cantidad</label>
                                </FloatLabel>
                            </div>
                            {submitted && !detail.quantity && <small className="p-error">Cantidad es requerida.</small>}
                        </div>

                        <div className="field col">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <span class="material-symbols-outlined">monetization_on</span>
                                </span>
                                <FloatLabel>
                                    <InputNumber
                                        id={`price-${index}`}
                                        value={detail.price}
                                        onValueChange={(e) => onDetailChange(e, index, 'price')}
                                        mode="currency"
                                        currency="COP"
                                        required
                                        className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': submitted && !detail.price })}`}
                                    />
                                    <label htmlFor={`price-${index}`} className="font-bold">Precio</label>
                                </FloatLabel>
                            </div>
                            {submitted && !detail.price && <small className="p-error">Precio es requerido.</small>}
                        </div>

                        <div className="field col">
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-sm" severity='danger' onClick={() => removeDetail(index)} />
                        </div>
                    </div>
                ))}

                <div className="field mt-5">
                    <button type="button" className="p-button p-component p-button-outlined" onClick={addDetail}>
                        <span class="material-symbols-outlined">add</span>
                        Agregar Detalle
                    </button>
                </div>
            </Dialog>

            {DialogDelete(deletePurchaseDialog, 'Compra', deletePurchaseDialogFooter, hideDeletePurchaseDialog, purchase, 'compra', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Compra', confirmPurchaseDialogFooter, hideConfirmPurchaseDialog, purchase, operation)}
        </div>
    );
};
