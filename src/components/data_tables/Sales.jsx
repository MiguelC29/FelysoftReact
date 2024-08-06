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

export default function Sales() {
    let emptySale = {
        idSale: null,
        dateSale: '',
        totalSale: null,
        payment: '',
    }

    const URL = '/sale/';
    const [sale, setSale] = useState(emptySale);
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [saleDialog, setSaleDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteSaleDialog, setDeleteSaleDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // Roles
    const isAdmin = UserService.isAdmin();

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setSales);
        Request_Service.getData('/payment/all', setPayments);
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

    const saveSale = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid = sale.totalSale && sale.payment;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (sale.idSale && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idSale: sale.idSale,
                totalSale: sale.totalSale,
                fkIdPayment: sale.payment.idPayment
            };
            url = URL + 'update/' + sale.idSale;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                totalSale: sale.totalSale,
                fkIdPayment: sale.payment.idPayment
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Venta ', URL.concat('all'), setSales);
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
        Request_Service.deleteData(URL, sale.idSale, setSales, toast, setDeleteSaleDialog, setSale, emptySale, 'Venta ', URL.concat('all'));
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
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={sales}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Ventas"
                    globalFilter={globalFilter}
                    header={header('Ventas', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={saleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={saleDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="totalSale" maxLength={10} value={sale.totalSale} onValueChange={(e) => onInputNumberChange(e, 'totalSale')} mode="decimal" currency="COP" locale="es-CO" autoFocus required className={classNames({ 'p-invalid': submitted && !sale.totalSale })} />
                            <label htmlFor="totalSale" className="font-bold">Total</label>
                        </FloatLabel>
                    </div>
                    {submitted && !sale.totalSale && <small className="p-error">Total de venta es requerido.</small>}
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
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !sale.payment && !selectedPayment })}`}
                            />
                            <label htmlFor="payment" className="font-bold">Método de pago</label>
                        </FloatLabel>
                    </div>
                    {submitted && !sale.payment && !selectedPayment && <small className="p-error">Método de pago es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteSaleDialog, 'Venta', deleteSaleDialogFooter, hideDeleteSaleDialog, sale, 'venta', 'esta')}

            {confirmDialog(confirmDialogVisible, 'Venta', confirmSaleDialogFooter, hideConfirmSaleDialog, sale, operation)}
        </div>
    );
};
