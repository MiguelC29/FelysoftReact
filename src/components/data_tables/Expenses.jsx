import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';

export default function Expenses() {
    let emptyExpense = {
        idExpense: null,
        type: '',
        date: '',
        total: null,
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

    const URL = '/expense/';
    const [expense, setExpense] = useState(emptyExpense);
    const [expenses, setExpenses] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedTypeExpense, setSelectedTypeExpense] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteExpenseDialog, setDeleteExpenseDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setExpenses);
        Request_Service.getData('/purchase/all', setPurchases);
        Request_Service.getData('/payment/all', setPayments);
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

    const saveExpense = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes y válidos
        const isValid = expense.type && expense.total && expense.description.trim() &&
            expense.purchase && expense.payment;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (expense.idExpense && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idExpense: expense.idExpense,
                type: expense.type,
                total: expense.total,
                description: expense.description.trim(),
                fkIdPurchase: expense.purchase.idPurchase,
                fkIdPayment: expense.payment.idPayment
            };
            url = URL + 'update/' + expense.idExpense;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                type: expense.type,
                total: expense.total,
                description: expense.description.trim(),
                fkIdPurchase: expense.purchase.idPurchase,
                fkIdPayment: expense.payment.idPayment
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Gasto ', URL.concat('all'), setExpenses);
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
        Request_Service.deleteData(URL, expense.idExpense, setExpenses, toast, setDeleteExpenseDialog, setExpense, emptyExpense, 'Gasto ', URL.concat('all'));

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

    const selectedProviderTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.provider.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const providerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.provider.name}</div>
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
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={expenses}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Gastos"
                    globalFilter={globalFilter}
                    header={header('Gastos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={expenseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            {/* card_travel or wallet*/}
                            <span class="material-symbols-outlined">water_ec</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="typeExpense"
                                value={selectedTypeExpense}
                                onChange={(e) => { setSelectedTypeExpense(e.value); onInputNumberChange(e, 'typeExpense'); }}
                                options={typeExpenseOptions}
                                placeholder="Seleccionar el tipo de gasto"
                                emptyMessage="No hay datos"
                                required autoFocus
                                className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !expense.typeExpense && !selectedTypeExpense })}`}
                            />
                            <label htmlFor="typeExpense" className="font-bold">Tipo de gasto</label>
                        </FloatLabel>
                    </div>
                    {submitted && !expense.typeExpense && !selectedTypeExpense && <small className="p-error">Tipo de gasto es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="total" maxLength={10} value={expense.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !expense.total })} />
                            <label htmlFor="total" className="font-bold">Total</label>
                        </FloatLabel>
                    </div>
                    {submitted && !expense.total && <small className="p-error">Total del gasto es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" maxLength={100} value={expense.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !expense.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !expense.description && <small className="p-error">Descripcion es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">local_shipping</span>
                        </span>
                        <FloatLabel>
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
                                filter valueTemplate={selectedProviderTemplate}
                                itemTemplate={providerOptionTemplate}
                                emptyMessage="No hay datos"
                                emptyFilterMessage="No hay resultados encontrados"
                                required
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !expense.purchase && !selectedPurchase })}`}
                            />
                            <label htmlFor="purchase" className="font-bold">Proveedor</label>
                        </FloatLabel>
                    </div>
                    {submitted && !expense.purchase && !selectedPurchase && <small className="p-error">Proveedor es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">currency_exchange</span>
                        </span>
                        <FloatLabel>
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
                                emptyMessage="No hay datos"
                                required
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !expense.payment && !selectedPayment })}`}
                            />
                            <label htmlFor="payment" className="font-bold">Método de pago</label>
                        </FloatLabel>
                    </div>
                    {submitted && !expense.payment && !selectedPayment && <small className="p-error">Método de pago es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteExpenseDialog, 'Gasto', deleteExpenseDialogFooter, hideDeleteExpenseDialog, expense, 'gasto', 'este')}

            {confirmDialog(confirmDialogVisible, 'Gasto', confirmExpenseDialogFooter, hideConfirmExpenseDialog, expense, operation)}
        </div>
    );
};
