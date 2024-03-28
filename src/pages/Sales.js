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


export default function Sales() {

    let emptySale = {
        idSale: null,
        dateSale: '',
        totalSale: 0,
        payment: '',
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
      };

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

    const formatCurrency = (value) => {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };

    const openNew = () => {
        setSale(emptySale);
        setTitle('Registrar Venta');
        setSelectedPayment('');
        //getData('http://localhost:8086/api/payment/', setPayments);
        setOperation(1);
        setSubmitted(false);
        setSaleDialog(true);
    };

    const editSale = (sale) => {
        setSale({ ...sale });
        //getData('http://localhost:8086/api/payment/', setPayments);
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

        if (sale.dateSale && sale.totalSale && sale.payment) {
            let url, method, parameters;

            if (sale.idSale && operation === 2) {
                parameters = {
                    idSale: sale.idSale, dateSale: sale.dateSale, totalSale: sale.totalSale, fkIdPayment: sale.payment.idPayment
                };
                url = URL + 'update/' + sale.idSale;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    dateSale: sale.dateSale, totalSale: sale.totalSale, fkIdPayment: sale.payment.idPayment
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setSales, URL, operation, toast);
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
        deleteData(URL, sale.idSale, setSales, toast, setDeleteSaleDialog, setSale, emptySale);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, sale, setSale);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, sale, setSale);
    };


    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    // };

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


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                {
                    console.log(sale)
                }
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
                        <InputNumber id="totalSale" value={sale.totalSale} onValueChange={(e) => onInputNumberChange(e, 'totalSale')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !sale.totalSale })} />
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
