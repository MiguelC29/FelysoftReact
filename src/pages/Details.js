import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, formatCurrency, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../components/CustomDataTable';


export default function Details() {

    let emptyDetail = {
        idDetail: null,
        quantity: 0,
        unitPrice: 0,
        book: '',
        product: '',
        service: '',
    }

    const URL = 'http://localhost:8086/api/detail/';
    const [details, setDetails] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [detailDialog, setDetailDialog] = useState(false);
    const [deleteDetailDialog, setDeleteDetailDialog] = useState(false);
    const [detail, setDetail] = useState(emptyDetail);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setDetails);
        getData('http://localhost:8086/api/book/', setBooks);
        getData('http://localhost:8086/api/product/', setProducts);
        getData('http://localhost:8086/api/service/', setServices);
    }, []);

    const openNew = () => {
        setDetail(emptyDetail);
        setTitle('Registrar Detalle');
        setSelectedBook('');
        setSelectedProduct('');
        setSelectedService('');
        setOperation(1);
        setSubmitted(false);
        setDetailDialog(true);
    };

    const editDetail = (detail) => {
        setDetail({ ...detail });
        setSelectedBook(detail.book);
        setSelectedBook(detail.product);
        setSelectedBook(detail.service);
        setTitle('Editar Detalle');
        setOperation(2);
        setDetailDialog(true);
    };

    // quizas se puede poner en el archivo functions
    const hideDialog = () => {
        setSubmitted(false);
        setDetailDialog(false);
    };

    const hideConfirmDetailDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteDetailDialog = () => {
        setDeleteDetailDialog(false);
    };
    
    const saveDetail = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (detail.quantity && detail.unitPrice && detail.book && detail.product && detail.service) {
            let url, method, parameters;

            if (detail.idDetail && operation === 2) {
                parameters = {
                    idDetail: detail.idDetail, quantity: detail.quantity, unitPrice: detail.unitPrice, fkIdBook: detail.book.idBook, fkIdProduct: detail.product.idProduct, fkIdService: detail.service.idService
                };
                url = URL + 'update/' + detail.idDetail;
                method = 'PUT';
            } else {
                // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                parameters = {
                    quantity: detail.quantity, unitPrice: detail.unitPrice, fkIdBook: detail.book.idBook, fkIdProduct: detail.product.idProduct, fkIdService: detail.service.idService
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setDetails, URL, operation, toast, "Detalle ");
            setDetailDialog(false);
            setDetail(emptyDetail);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteDetail = (sale) => {
        confirmDelete(detail, setDetail, setDeleteDetailDialog);
    };

    const deleteDetail = () => {
        deleteData(URL, detail.idDetail, setDetails, toast, setDeleteDetailDialog, setDetail, emptyDetail);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, detail, setDetail);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.unitPrice);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editDetail, confirmDeleteDetail);
    };

    const detailDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmDetailDialogFooter = (
        confirmDialogFooter(hideConfirmDetailDialog, saveDetail)
    );
    const deleteDetailDialogFooter = (
        deleteDialogFooter(hideDeleteDetailDialog, deleteDetail)
    );

    const columns = [
        { field: 'quantity', header: 'Cantidad', sortable: true, style: { minWidth: '16rem' } },,
        { field: 'unitPrice', header: 'Precio único', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'product.name', header: 'Producto', sortable: true, style: { minWidth: '10rem' } },
        { field: 'service.state', header: 'Servicio', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={details}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} detalles"
                    globalFilter={globalFilter}
                    header={header('Detalles', setGlobalFilter)}
                    columns={columns}
                />
            </div>


            <Dialog visible={detailDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={detailDialogFooter} onHide={hideDialog}>
                <div className="field col">
                    <label htmlFor="quantity" className="font-bold">
                        Cantidad
                    </label>
                    <div className="p-inputgroup">
                        <InputNumber id="quantity"  maxLength={8} value={detail.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !detail.quantity })} />
                    </div>
                    {submitted && !detail.quantity && <small className="p-error">Cantidad es requerido.</small>}
                </div>

                <div className="field col">
                    <label htmlFor="unitPrice" className="font-bold">
                        Precio único
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="unitPrice" maxLength={10} value={detail.unitPrice} onValueChange={(e) => onInputNumberChange(e, 'unitPrice')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !detail.unitPrice })} />
                    </div>
                    {submitted && !detail.unitPrice && <small className="p-error">Precio único es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="book" className="font-bold">
                        Libro
                    </label>
                    <Dropdown
                        id="book"
                        value={selectedBook}
                        onChange={(e) => {
                            setSelectedBook(e.value);
                            onInputNumberChange(e, 'book');
                        }}
                        options={books}
                        optionLabel="title"
                        placeholder="Seleccionar Libro"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.book && !selectedBook })}`}
                    />
                    {submitted && !detail.book && !selectedBook && <small className="p-error">Libro es requerido.</small>}
                </div>


                <div className="field">
                    <label htmlFor="product" className="font-bold">
                        Producto
                    </label>
                    <Dropdown
                        id="product"
                        value={selectedProduct}
                        onChange={(e) => {
                            setSelectedProduct(e.value);
                            onInputNumberChange(e, 'product');
                        }}
                        options={products}
                        optionLabel="name"
                        placeholder="Seleccionar Producto"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.product && !selectedProduct })}`}
                    />
                    {submitted && !detail.product && !selectedProduct && <small className="p-error">Producto es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="service" className="font-bold">
                        Servicio
                    </label>
                    <Dropdown
                        id="service"
                        value={selectedService}
                        onChange={(e) => {
                            setSelectedService(e.value);
                            onInputNumberChange(e, 'service');
                        }}
                        options={services}
                        optionLabel="state"
                        placeholder="Seleccionar Servicio"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.service && !selectedService })}`}
                    />
                    {submitted && !detail.service && !selectedService && <small className="p-error">Servicio es requerido.</small>}
                </div>

                </Dialog>

            {DialogDelete(deleteDetailDialog, 'Detalle', deleteDetailDialogFooter, hideDeleteDetailDialog, detail, 'detalle', 'este')}

            {confirmDialog(confirmDialogVisible, 'Detalle', confirmDetailDialogFooter, hideConfirmDetailDialog, detail, operation)}

        </div>
    );
}
    

