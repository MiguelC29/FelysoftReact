import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';

export default function Purchases() {

    let emptyPurchase = {
        idPurchase: null,
        total: 0,
        description: '',
        methodPayment: '',
        state: '',
        provider: '',
    }

    const MethodPayment = {
        EFECTIVO: 'EFECTIVO',
        NEQUI: 'NEQUI',
        TRANSACCION: 'TRANSACCION',
    };

    const State = {
        PENDIENTE: 'PENDIENTE',
        CANCELADO: 'CANCELADO',
        REEMBOLSADO: 'REEMBOLSADO',
        VENCIDO: 'VENCIDO'
    };
    

    const URL = 'http://localhost:8086/api/purchase/';
    const [purchases, setPurchases] = useState([]);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const [expensePurchase, setExpensePurchase] = useState();

    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [deletePurchaseDialog, setDeletePurchaseDialog] = useState(false);
    const [purchase, setPurchase] = useState(emptyPurchase);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setPurchases);
        getData('http://localhost:8086/api/provider/', setProviders);
    }, []);

    const openNew = () => {
        setPurchase(emptyPurchase);
        setTitle('Registrar Compra');
        setSelectedProvider('');
        //getData('http://localhost:8086/api/provider/', setProviders);
        setOperation(1);
        setSubmitted(false);
        setPurchaseDialog(true);
    };
    
    const Url = "http://localhost:8086/api/purchase/expensePurchase/";
    const editPurchase = (purchase) => {
        setPurchase({ ...purchase });
        getData('http://localhost:8086/api/provider/', setProviders);
        getOneData(Url.concat(purchase.idPurchase), setExpensePurchase);
        setSelectedProvider(purchase.provider);
        (!expensePurchase) || setSelectedMethodPayment(expensePurchase.payment.methodPayment);
        (!expensePurchase) || setSelectedState(expensePurchase.payment.state);
        setTitle('Editar Compra');
        setOperation(2);
        setPurchaseDialog(true);
    };

    // quizas se puede poner en el archivo functions
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

    

    const savePurchase = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (purchase.total && purchase.provider) {
            let url, method, parameters;

            if (purchase.idPurchase && operation === 2) {
                parameters = {
                    idPurchase: purchase.idPurchase, total: purchase.total, description: purchase.description, methodPayment: purchase.methodPayment, state: purchase.state, fkIdProvider: purchase.provider.idProvider
                };
                url = URL + 'update/' + purchase.idPurchase;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    total: purchase.total, description: purchase.description, methodPayment: purchase.methodPayment, state: purchase.state, fkIdProvider: purchase.provider.idProvider
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setPurchases, URL, operation, toast, "Compra ");
            setPurchaseDialog(false);
            setPurchase(emptyPurchase);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeletePurchase = (purchase) => {
        confirmDelete(purchase, setPurchase, setDeletePurchaseDialog);
    };

    const deletePurchase = () => {
        deleteData(URL, purchase.idPurchase, setPurchases, toast, setDeletePurchaseDialog, setPurchase, emptyPurchase, "Compra");
    };

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
        return actionBodyTemplate(rowData, editPurchase, confirmDeletePurchase);
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

    const columns = [
        { field: 'date', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.date), style: { minWidth: '12rem' } },
        { field: 'total', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
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
    const handleExportCsv = () => { exportCSV(false, dt)};

    return (
        <div>
            <Toast ref={toast} />
            <div className="card" style={{background: '#9bc1de'}}>
                <Toolbar className="mb-4" style={{background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none'}} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={purchases}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} compras"
                    globalFilter={globalFilter}
                    header={header('Compras', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={purchaseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                <div className="field col">
                    <label htmlFor="total" className="font-bold">
                        Total
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="total" maxLength={10} value={purchase.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !purchase.total })} />
                    </div>
                    {submitted && !purchase.total && <small className="p-error">Total de compra es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Desc
                    </label>
                    <InputText id="description" maxLength={100} value={(expensePurchase) && expensePurchase.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !expensePurchase.description })} />
                    {submitted && !expensePurchase.description && <small className="p-error">Descripcion es requerida.</small>}
                </div>

                <div className="field col">
                        {<label htmlFor="methodPayment" className="font-bold">
                            Método de pago
                        </label>}
                        <Dropdown
                            id="methodPayment"
                            value={selectedMethodPayment}
                            onChange={(e) => { setSelectedMethodPayment(e.value); onInputNumberChange(e, 'methodPayment');}}
                            options={methodPaymentOptions}
                            placeholder="Seleccionar el método de pago"
                            required
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !purchase.methodPayment && !selectedMethodPayment })}`}
                        />
                        {submitted && !purchase.methodPayment && !selectedMethodPayment && <small className="p-error">Método de pago es requerido.</small>}
                    </div>

                    <div className="field col">
                        {<label htmlFor="state" className="font-bold">
                            Estado
                        </label>}
                        <Dropdown
                            id="state"
                            value={selectedState}
                            onChange={(e) => { setSelectedState(e.value); onInputNumberChange(e, 'state'); }}
                            options={stateOptions}
                            placeholder="Seleccionar el estado"
                            required
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !purchase.state && !selectedState })}`}
                        />
                        {submitted && !purchase.state && !selectedState && <small className="p-error">Estado es requerido.</small>}
                    </div>



                <div className="field">
                    <label htmlFor="provider" className="font-bold">
                        Proveedor
                    </label>
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
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !purchase.provider && !selectedProvider })}`}
                    />

                </div>
            </Dialog>

            {DialogDelete(deletePurchaseDialog, 'Compra', deletePurchaseDialogFooter, hideDeletePurchaseDialog, purchase, 'compra', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Compra', confirmPurchaseDialogFooter, hideConfirmPurchaseDialog, purchase, operation)}

        </div>
    );
}
