import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getData, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { Tooltip } from 'primereact/tooltip';

export default function Sales() {

    let emptySale = {
        idSale: null,
        dateSale: '',
        totalSale: 0,
        payment: '',
    }

    const URL = 'http://localhost:8086/api/sale/';
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [saleDialog, setSaleDialog] = useState(false);
    const [deleteSaleDialog, setDeleteSaleDialog] = useState(false);
    const [sale, setSale] = useState(emptySale);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setSales);
        getData('http://localhost:8086/api/payment/', setPayments);
    }, []);

    const openNew = () => {
        setSale(emptySale);
        setTitle('Registrar Venta');
        setSelectedPayment('');
        setOperation(1);
        setSubmitted(false);
        setSaleDialog(true);
    };

    const editSale = (sale) => {
        setSale({ ...sale });
        setSelectedPayment(sale.payment);
        setTitle('Editar Venta');
        setOperation(2);
        setSaleDialog(true);
    };

    // quizas se puede poner en el archivo functions
    const hideDialog = () => {
        setSubmitted(false);
        setSaleDialog(false);
    };

    const hideConfirmSaleDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteSaleDialog = () => {
        setDeleteSaleDialog(false);
    };


    const saveSale = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (sale.totalSale && sale.payment) {
            let url, method, parameters;

            if (sale.idSale && operation === 2) {
                parameters = {
                    idSale: sale.idSale, totalSale: sale.totalSale, fkIdPayment: sale.payment.idPayment
                };
                url = URL + 'update/' + sale.idSale;
                method = 'PUT';

            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    totalSale: sale.totalSale, fkIdPayment: sale.payment.idPayment
                };
                url = URL + 'create';
                method = 'POST';


            }

            sendRequest(method, parameters, url, setSales, URL, operation, toast, "Venta ");
            setSaleDialog(false);
            setSale(emptySale);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteSale = (sale) => {
        confirmDelete(sale, setSale, setDeleteSaleDialog);
    };

    const deleteSale = () => {
        deleteData(URL, sale.idSale, setSales, toast, setDeleteSaleDialog, setSale, emptySale, "Venta");
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, sale, setSale);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.totalSale);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editSale, confirmDeleteSale);
    };

    const saleDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmSaleDialogFooter = (
        confirmDialogFooter(hideConfirmSaleDialog, saveSale)
    );
    const deleteSaleDialogFooter = (
        deleteDialogFooter(hideDeleteSaleDialog, deleteSale)
    );


    const columns = [
        { field: 'dateSale', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.dateSale), style: { minWidth: '12rem' } },
        { field: 'totalSale', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'payment.methodPayment', header: 'Método de Pago', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, sales, 'Reporte_Ventas') };
    const handleExportExcel = () => { exportExcel(sales, columns, 'Ventas') };
    const handleExportCsv = () => { exportCSV(false, dt)} ;

    return (
        <div>
            <Toast ref={toast} />
            <div className="card" style={{background: '#9bc1de'}}>
                <Tooltip target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4" style={{background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none'}} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={sales}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} ventas"
                    globalFilter={globalFilter}
                    header={header('Ventas', setGlobalFilter)}
                    columns={columns}
                />
            </div>


            <Dialog visible={saleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={saleDialogFooter} onHide={hideDialog}>
                <div className="field col">
                    <label htmlFor="totalSale" className="font-bold">
                        Total
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="totalSale" maxLength={10} value={sale.totalSale} onValueChange={(e) => onInputNumberChange(e, 'totalSale')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !sale.totalSale })} />
                    </div>
                    {submitted && !sale.totalSale && <small className="p-error">Total de venta es requerido.</small>}
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
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !sale.payment && !selectedPayment })}`}
                    />


                    {submitted && !sale.payment && !selectedPayment && <small className="p-error">Método de pago es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteSaleDialog, 'Venta', deleteSaleDialogFooter, hideDeleteSaleDialog, sale, 'venta', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Venta', confirmSaleDialogFooter, hideConfirmSaleDialog, sale, operation)}


        </div>
    );
}
