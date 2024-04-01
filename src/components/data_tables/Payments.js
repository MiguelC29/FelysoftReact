import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { Tooltip } from 'primereact/tooltip';

export default function Payments() {

    let emptyPayment = {
        idPayment: null,
        methodPayment: '',
        state: '',
        date: '',
        total: 0,
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


    const URL = 'http://localhost:8086/api/payment/';
    const [payments, setPayments] = useState([]);
    const [selectedMethodPayment, setSelectedMethodPayment] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
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
    }, []);

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

        if (payment.methodPayment && payment.state && payment.total) {
            let url, method, parameters;

            if (payment.idPayment && operation === 2) {
                parameters = {
                    idPayment: payment.idPayment, methodPayment: payment.methodPayment, state: payment.state, total: payment.total
                };
                url = URL + 'update/' + payment.idPayment;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    methodPayment: payment.methodPayment, state: payment.state, total: payment.total
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setPayments, URL, operation, toast, "Pago ");
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
        deleteData(URL, payment.idPayment, setPayments, toast, setDeletePaymentDialog, setPayment, emptyPayment, "Pago");
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

    const methodPaymentOptions = Object.keys(MethodPayment).map(key => ({
        label: MethodPayment[key],
        value: key
      }));
    
      const stateOptions = Object.keys(State).map(key => ({
        label: State[key],
        value: key
      }));

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, payments, 'Reporte_Pagos') };
    const handleExportExcel = () => { exportExcel(payments, columns, 'Pagos') };
    const handleExportCsv = () => { exportCSV(false, dt)};


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

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
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !payment.methodPayment && !selectedMethodPayment })}`}
                        />
                        {submitted && !payment.methodPayment && !selectedMethodPayment && <small className="p-error">Método de pago es requerido.</small>}
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
                            className={`w-full md:w rem ${classNames({ 'p-invalid': submitted && !payment.state && !selectedState })}`}
                        />
                        {submitted && !payment.state && !selectedState && <small className="p-error">Estado es requerido.</small>}
                    </div>

                    <div className="field col">
                        <label htmlFor="total" className="font-bold">
                            Total
                        </label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                            <InputNumber id="total" maxLength={10} value={payment.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !payment.total })} />
                        </div> 
                        {submitted && !payment.total && <small className="p-error">Total del pago es requerido.</small>}
                    </div>
            </Dialog>

            {DialogDelete(deletePaymentDialog, 'Pago', deletePaymentDialogFooter, hideDeletePaymentDialog, payment, 'compra', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Pago', confirmPaymentDialogFooter, hideConfirmPaymentDialog, payment, operation)}

        </div>
    );
}