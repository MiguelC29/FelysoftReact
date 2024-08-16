import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Payments() {
    let emptyPayment = {
        idPayment: null,
        methodPayment: '',
        state: '',
        date: '',
        total: null,
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

    const URL = '/payment/';
    const [payment, setPayment] = useState(emptyPayment);
    const [payments, setPayments] = useState([]);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [onlyDisabled, setOnlyDisabled] = useState(false);

    // ROLES
    const isAdmin = UserService.isAdmin();

    useEffect(() => {
        fetchPayments();
    }, [onlyDisabled]);

    const fetchPayments = async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setPayments);
        } catch (error) {
            console.error("Fallo al recuperar pagos:", error);
        }
    }
    const openNew = () => {
        setPayment(emptyPayment);
        setTitle('Registrar Pago');
        setSelectedMethodPayment('');
        setSelectedState('');
        setOperation(1);
        setSubmitted(false);
        setPaymentDialog(true);
    };

    const editPayment = (payment) => {
        setPayment({ ...payment });
        setSelectedMethodPayment(payment.methodPayment);
        setSelectedState(payment.state);
        setTitle('Editar Pago');
        setOperation(2);
        setPaymentDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentDialog(false);
    };

    const hideConfirmPaymentDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeletePaymentDialog = () => {
        setDeletePaymentDialog(false);
    };

    const savePayment = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid = payment.methodPayment && payment.state && payment.total;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (payment.idPayment && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idPayment: payment.idPayment,
                methodPayment: payment.methodPayment,
                state: payment.state,
                total: payment.total
            };
            url = URL + 'update/' + payment.idPayment;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                methodPayment: payment.methodPayment,
                state: payment.state,
                total: payment.total
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Pago ', URL.concat('all'), setPayments);
            setPaymentDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeletePayment = (payment) => {
        confirmDelete(payment, setPayment, setDeletePaymentDialog);
    };

    const deletePayment = () => {
        Request_Service.deleteData(URL, payment.idPayment, setPayments, toast, setDeletePaymentDialog, setPayment, emptyPayment, 'Pago ', URL.concat('all'));
    };

    const handleEnable = (payment) => {
        Request_Service.sendRequestEnable(URL, payment.idPayment, setPayments, toast, 'Pago ');
    }

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, payment, setPayment);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editPayment, confirmDeletePayment, onlyDisabled, handleEnable);
    };

    const paymentDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmPaymentDialogFooter = (
        confirmDialogFooter(hideConfirmPaymentDialog, savePayment)
    );

    const deletePaymentDialogFooter = (
        deleteDialogFooter(hideDeletePaymentDialog, deletePayment)
    );

    const columns = [
        { field: 'methodPayment', header: 'Método de pago', sortable: true, style: { minWidth: '12rem' } },
        { field: 'state', header: 'Estado', sortable: true, style: { minWidth: '12rem' } },
        { field: 'date', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.date), style: { minWidth: '12rem' } },
        { field: 'total', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
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

    const icon = (!onlyDisabled) ? 'pi-eye-slash' : 'pi-eye';

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, payments, 'Reporte_Pagos') };
    const handleExportExcel = () => { exportExcel(payments, columns, 'Pagos') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled, icon)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={payments}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Pagos"
                    globalFilter={globalFilter}
                    header={header('Pagos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={paymentDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={paymentDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
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
                                emptyMessage="No hay datos"
                                required autoFocus
                                className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !payment.methodPayment && !selectedMethodPayment })}`}
                            />
                            {<label htmlFor="methodPayment" className="font-bold">Método de pago</label>}
                        </FloatLabel>
                    </div>
                    {submitted && !payment.methodPayment && !selectedMethodPayment && <small className="p-error">Método de pago es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="total" maxLength={10} value={payment.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !payment.total })} />
                            <label htmlFor="total" className="font-bold">Total</label>
                        </FloatLabel>
                    </div>
                    {submitted && !payment.total && <small className="p-error">Total del pago es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <FloatLabel>
                        <Dropdown
                            id="state"
                            value={selectedState}
                            onChange={(e) => { setSelectedState(e.value); onInputNumberChange(e, 'state'); }}
                            options={stateOptions}
                            placeholder="Seleccionar el estado"
                            emptyMessage="No hay datos"
                            required
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !payment.state && !selectedState })}`}
                        />
                        {<label htmlFor="state" className="font-bold">Estado</label>}
                    </FloatLabel>
                    {submitted && !payment.state && !selectedState && <small className="p-error">Estado es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deletePaymentDialog, 'Pago', deletePaymentDialogFooter, hideDeletePaymentDialog, payment, 'compra', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Pago', confirmPaymentDialogFooter, hideConfirmPaymentDialog, payment, operation)}
        </div>
    );
};
