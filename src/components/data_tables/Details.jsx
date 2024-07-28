import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';

export default function Details() {
    let emptyDetail = {
        idDetail: null,
        quantity: null,
        unitPrice: null,
        book: '',
        product: '',
        service: '',
    }

    const URL = '/detail/';
    const [detail, setDetail] = useState(emptyDetail);
    const [details, setDetails] = useState([]);
    const [books, setBooks] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [detailDialog, setDetailDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteDetailDialog, setDeleteDetailDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setDetails);
        Request_Service.getData('/book/all', setBooks);
        Request_Service.getData('/product/all', setProducts);
        Request_Service.getData('/service/all', setServices);
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

    const saveDetail = async () => {
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
                parameters = {
                    quantity: detail.quantity, unitPrice: detail.unitPrice, fkIdBook: detail.book.idBook, fkIdProduct: detail.product.idProduct, fkIdService: detail.service.idService
                };
                url = URL + 'create';
                method = 'POST';
            }
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Detalle ', URL.concat('all'), setDetails);
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
        Request_Service.deleteData(URL, detail.idDetail, setDetails, toast, setDeleteDetailDialog, setDetail, emptyDetail, 'Detalle ', URL.concat('all'));
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

    const selectedBookTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.title}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const bookOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.title}</div>
            </div>
        );
    };

    const selectedProductTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const productOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedServiceTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.typeService.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const serviceOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.typeService.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'quantity', header: 'Cantidad', sortable: true, style: { minWidth: '16rem' } },
        { field: 'unitPrice', header: 'Precio único', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'product.name', header: 'Producto', sortable: true, style: { minWidth: '10rem' } },
        { field: 'service.state', header: 'Servicio', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, details, 'Reporte_Detalles') };
    const handleExportExcel = () => { exportExcel(details, columns, 'Detalles') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={details}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Detalles"
                    globalFilter={globalFilter}
                    header={header('Detalles', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={detailDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={detailDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">production_quantity_limits</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="quantity" maxLength={8} value={detail.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !detail.quantity })} />
                            <label htmlFor="quantity" className="font-bold">Cantidad</label>
                        </FloatLabel>
                    </div>
                    {submitted && !detail.quantity && <small className="p-error">Cantidad es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="unitPrice" maxLength={10} value={detail.unitPrice} onValueChange={(e) => onInputNumberChange(e, 'unitPrice')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !detail.unitPrice })} />
                            <label htmlFor="unitPrice" className="font-bold">Precio único</label>
                        </FloatLabel>
                    </div>
                    {submitted && !detail.unitPrice && <small className="p-error">Precio único es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">book</span>
                        </span>
                        <FloatLabel>
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
                                filter valueTemplate={selectedBookTemplate}
                                itemTemplate={bookOptionTemplate}
                                emptyMessage="No hay datos"
                                emptyFilterMessage="No hay resultados encontrados"
                                required
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.book && !selectedBook })}`}
                            />
                            <label htmlFor="book" className="font-bold">Libro</label>
                        </FloatLabel>
                    </div>
                    {submitted && !detail.book && !selectedBook && <small className="p-error">Libro es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">inventory_2</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="product"
                                value={selectedProduct}
                                onChange={(e) => {
                                    setSelectedProduct(e.value);
                                    onInputNumberChange(e, 'product');
                                }}
                                options={products}
                                optionLabel="name"
                                filter valueTemplate={selectedProductTemplate}
                                itemTemplate={productOptionTemplate}
                                placeholder="Seleccionar Producto"
                                emptyMessage="No hay datos"
                                emptyFilterMessage="No hay resultados encontrados"
                                required
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.product && !selectedProduct })}`}
                            />
                            <label htmlFor="product" className="font-bold">Producto</label>
                        </FloatLabel>
                    </div>
                    {submitted && !detail.product && !selectedProduct && <small className="p-error">Producto es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">service_toolbox</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="service"
                                value={selectedService}
                                onChange={(e) => {
                                    setSelectedService(e.value);
                                    onInputNumberChange(e, 'service');
                                }}
                                options={services}
                                optionLabel="typeService.name"
                                filter valueTemplate={selectedServiceTemplate}
                                itemTemplate={serviceOptionTemplate}
                                placeholder="Seleccionar Servicio"
                                required
                                emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados"
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !detail.service && !selectedService })}`}
                            />
                            <label htmlFor="service" className="font-bold">Servicio</label>
                        </FloatLabel>
                    </div>
                    {submitted && !detail.service && !selectedService && <small className="p-error">Servicio es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteDetailDialog, 'Detalle', deleteDetailDialogFooter, hideDeleteDetailDialog, detail, 'detalle', 'este')}

            {confirmDialog(confirmDialogVisible, 'Detalle', confirmDetailDialogFooter, hideConfirmDetailDialog, detail, operation)}
        </div>
    );
};
