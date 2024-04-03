import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { Tooltip } from 'primereact/tooltip';

export default function Expenses() {

    let emptyExpense = {
        idExpense: null,
        type: '',
        date: '',
        total: 0,
        description: '',
        purchase: '',
        payment: '',
    }

    const TypeExpense = {
        NOMINA: 'NOMINA',
        ARRIENDO: 'ARRIENDO',
        SERVICIOS: 'SERVICIOS',
        PROVEEDORES: 'PROVEEDORES',
    };


    const URL = 'http://localhost:8086/api/expense/';
    const [expenses, setExpenses] = useState([]);
    const [selectedTypeExpense, setSelectedTypeExpense] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [deleteExpenseDialog, setDeleteExpenseDialog] = useState(false);
    const [expense, setExpense] = useState(emptyExpense);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setExpenses);
        getData('http://localhost:8086/api/purchase/', setPurchases);
        getData('http://localhost:8086/api/payment/', setPayments);
    }, []);

    const openNew = () => {
        setExpense(emptyExpense);
        setTitle('Registrar Gasto');
        setSelectedPurchase('');
        setSelectedPayment('');
        setOperation(1);
        setSubmitted(false);
        setExpenseDialog(true);
    };

    const editExpense = (expense) => {
        setExpense({ ...expense });
        setSelectedPurchase(expense.purchase);
        setSelectedPayment(expense.payment);
        setTitle('Editar Gasto');
        setOperation(2);
        setExpenseDialog(true);
    };

    // quizas se puede poner en el archivo functions
    const hideDialog = () => {
        setSubmitted(false);
        setExpenseDialog(false);
    };

    const hideConfirmExpenseDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteExpenseDialog = () => {
        setDeleteExpenseDialog(false);
    };

    const saveExpense = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (expense.type && expense.total && expense.description.trim() && expense.purchase && expense.payment) {
            let url, method, parameters;

            if (expense.idExpense && operation === 2) {
                parameters = {
                    idExpense: expense.idExpense, type: expense.type, total: expense.total, description: expense.description.trim(), fkIdPurchase: expense.purchase.idPurchase, fkIdPayment: expense.payment.idPayment
                };
                url = URL + 'update/' + expense.idExpense;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    type: expense.type, total: expense.total, description: expense.description.trim(), fkIdPurchase: expense.purchase.idPurchase, fkIdPayment: expense.payment.idPayment
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setExpenses, URL, operation, toast, "Gasto ");
            setExpenseDialog(false);
            setExpense(emptyExpense);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteExpense = (expense) => {
        confirmDelete(expense, setExpense, setDeleteExpenseDialog);
    };

    const deleteExpense = () => {
        deleteData(URL, expense.idExpense, setExpenses, toast, setDeleteExpenseDialog, setExpense, emptyExpense, "Gasto");
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, expense, setExpense);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, expense, setExpense);
    };


    // const typeNotProvider = (rowData) => {
    //     if (rowData.typeExpense === "PROVEEDORES") {
    //         return fo(rowData.purchase.provider); 
    //     }
    //   };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editExpense, confirmDeleteExpense);
    };

    const expenseDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmExpenseDialogFooter = (
        confirmDialogFooter(hideConfirmExpenseDialog, saveExpense)
    );
    const deleteExpenseDialogFooter = (
        deleteDialogFooter(hideDeleteExpenseDialog, deleteExpense)
    );

    const selectedPurchaseTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const purchaseOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedPaymentTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const paymentOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'type', header: 'Tipo de gasto', sortable: true, style: { minWidth: '12rem' } },
        { field: 'date', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.date), style: { minWidth: '12rem' } },
        { field: 'total', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '12rem' } },
        { field: 'purchase.provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '10rem' } },
        { field: 'payment.methodPayment', header: 'Método de pago', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    const typeExpenseOptions = Object.keys(TypeExpense).map(key => ({
        label: TypeExpense[key],
        value: key
    }));

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, expenses, 'Reporte_Gastos') };
    const handleExportExcel = () => { exportExcel(expenses, columns, 'Gastos') };
    const handleExportCsv = () => { exportCSV(false, dt)};


    return (
        <div>
            <Toast ref={toast} />
            <div className="card" style={{background: '#9bc1de'}}>
                <Tooltip target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4"  style={{background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none'}}  left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={expenses}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} gastos"
                    globalFilter={globalFilter}
                    header={header('Gastos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={expenseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
                <div className="field col">
                    {<label htmlFor="typeExpense" className="font-bold">
                        Tipo de gasto
                    </label>}
                    <Dropdown
                        id="typeExpense"
                        value={selectedTypeExpense}
                        onChange={(e) => { setSelectedTypeExpense(e.value); onInputNumberChange(e, 'typeExpense'); }}
                        options={typeExpenseOptions}
                        placeholder="Seleccionar el tipo de gasto"
                        required
                        className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !expense.typeExpense && !selectedTypeExpense })}`}
                    />
                    {submitted && !expense.typeExpense && !selectedTypeExpense && <small className="p-error">Tipo de gasto es requerido.</small>}
                </div>

                <div className="field col">
                    <label htmlFor="total" className="font-bold">
                        Total
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="total" maxLength={10} value={expense.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !expense.total })} />
                    </div>
                    {submitted && !expense.total && <small className="p-error">Total del gasto es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Desc
                    </label>
                    <InputText id="description" maxLength={100} value={expense.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !expense.description })} />
                    {submitted && !expense.description && <small className="p-error">Descripcion es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="purchase" className="font-bold">
                        Proveedor
                    </label>
                    <Dropdown
                        id="purchase"
                        value={selectedPurchase}
                        onChange={(e) => {
                            setSelectedPurchase(e.value);
                            onInputNumberChange(e, 'purchase');
                        }}
                        options={purchases}
                        optionLabel="provider.name"
                        placeholder="Seleccionar Proveedor"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !expense.purchase && !selectedPurchase })}`}
                    />
                    {submitted && !expense.purchase && !selectedPurchase && <small className="p-error">Proveedor es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="payment" className="font-bold">
                        Método de pago
                    </label>
                    <Dropdown
                        id="payment"
                        value={selectedPayment}
                        onChange={(e) => {
                            setSelectedPayment(e.value);
                            onInputNumberChange(e, 'payment');
                        }}
                        options={payments}
                        optionLabel="methodPayment"
                        placeholder="Seleccionar Método de pago"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !expense.payment && !selectedPayment })}`}
                    />

                    {submitted && !expense.payment && !selectedPayment && <small className="p-error">Método de pago es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteExpenseDialog, 'Gasto', deleteExpenseDialogFooter, hideDeleteExpenseDialog, expense, 'gasto', 'este')}

            {confirmDialog(confirmDialogVisible, 'Gasto', confirmExpenseDialogFooter, hideConfirmExpenseDialog, expense, operation)}

        </div>
    );
}
