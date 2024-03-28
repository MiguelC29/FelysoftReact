import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../components/CustomDataTable';
import { format } from 'date-fns';

export default function Payments() {

    let emptyPayment = {
        idPayment: null,
        methodPayment: '',
        state: '',
        date: '',
        total: 0,
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
      };

    const URL = 'http://localhost:8086/api/payment/';
    const [payments, setPayments] = useState([]);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
    const [payment, setPayment] = useState(emptyPayment);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setPayments);
        //getData('http://localhost:8086/api/provider/', setProviders);
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };

    const openNew = () => {
        setPayment(emptyPayment);
        setTitle('Registrar Pago');
        setOperation(1);
        setSubmitted(false);
        setPaymentDialog(true);
    };

    const editPayment = (payment) => {
        setPayment({ ...payment });
        setTitle('Editar Pago');
        setOperation(2);
        setPaymentDialog(true);
    };

    // quizas se puede poner en el archivo functions
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

    const savePayment = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (payment.methodPayment && payment.state && payment.date && payment.total) {
            let url, method, parameters;

            if (payment.idPayment && operation === 2) {
                parameters = {
                    idPayment: payment.idPayment, methodPayment: payment.methodPayment, state: payment.state, date: payment.date, total: payment.total
                };
                url = URL + 'update/' + payment.idPayment;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    methodPayment: payment.methodPayment, state: payment.state, date: payment.date, total: payment.total
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setPayments, URL, operation, toast);
            setPaymentDialog(false);
            setPayment(emptyPayment);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeletePayment = (payment) => {
        confirmDelete(payment, setPayment, setDeletePaymentDialog);
    };

    const deletePayment = () => {
        deleteData(URL, payment.idPayment, setPayments, toast, setDeletePaymentDialog, setPayment, emptyPayment);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, payment, setPayment);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, payment, setPayment);
    };


    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editPayment, confirmDeletePayment);
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

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={payments}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} pagos"
                    globalFilter={globalFilter}
                    header={header('Pagos', setGlobalFilter)}
                    columns={columns}
                />
            </div>


            <Dialog visible={paymentDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={paymentDialogFooter} onHide={hideDialog}>
            <div className="field">
                    <label htmlFor="methodPayment" className="font-bold">
                        Método de pago
                    </label>
                    <Dropdown id="methodPayment" value={payment.methodPayment} onChange={(e) => onInputChange(e, 'methodPayment')} required className={classNames({ 'p-invalid': submitted && !payment.methodPayment })} />
                {submitted && !payment.methodPayment && <small className="p-error">Método de pago es requerido.</small>}
            
            </div>

            <div className="field">
                    <label htmlFor="state" className="font-bold">
                        Estado
                    </label>
                    <Dropdown id="state" value={payment.state} onChange={(e) => onInputChange(e, 'state')} required className={classNames({ 'p-invalid': submitted && !payment.state })} />
                    {submitted && !payment.state && <small className="p-error">Estado es requerido.</small>}
            </div>
            
                <div className="field col">
                    <label htmlFor="total" className="font-bold">
                        Total
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="total" value={payment.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !payment.total })} />
                    </div>
                    {submitted && !payment.total && <small className="p-error">Total del pago es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deletePaymentDialog, 'Pago', deletePaymentDialogFooter, hideDeletePaymentDialog, payment, 'compra', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Pago', confirmPaymentDialogFooter, hideConfirmPaymentDialog, payment, operation)}

        </div>
    );
}