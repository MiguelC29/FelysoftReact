import React, { useState, useEffect, useRef, useCallback } from 'react';
import { exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, header, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toolbar } from 'primereact/toolbar';
import CustomDataTable from '../CustomDataTable';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function Sales() {
    let emptySale = {
        idSale: null,
        dateSale: '',
        totalSale: null,
        details: [],
        payment: '',
    }

    const URL = '/sale/';
    const [sale, setSale] = useState(emptySale);
    const [sales, setSales] = useState([]);
    const [saleDetailDialog, setSaleDetailDialog] = useState(false);
    const [detailsList, setDetailsList] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    // Roles
    const isAdmin = UserService.isAdmin();

    const fetchSales = useCallback(async () => {
        try {
            await Request_Service.getData(`${URL}all`, setSales);
        } catch (error) {
            console.error("Fallo al recuperar ventas:", error);
        }
    }, [URL]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const openDetail = (sale) => {
        setSale({ ...sale });
        Request_Service.getData(`/detail/saleDetails/${sale.idSale}`, setDetailsList);
        setSaleDetailDialog(true);
    }

    const hideDialog = () => {
        setSaleDetailDialog(false);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.totalSale);
    };

    const dateTemplate = (rowData) => {
        return formatDate(rowData.date);
    }

    const detailsBodyTemplate = (rowData) => {
        return <Button icon="pi pi-angle-right" className="p-button-text" onClick={() => openDetail(rowData)} style={{ background: 'none', border: 'none', padding: '0', boxShadow: 'none', color: '#183462' }}
        />
    }

    const columns = [
        { body: detailsBodyTemplate, exportable: false, style: { minWidth: '1rem' } },
        { field: 'dateSale', header: 'Fecha', sortable: true, body: (rowData) => formatDate(rowData.dateSale), style: { minWidth: '12rem' } },
        { field: 'totalSale', header: 'Total', body: priceBodyTemplate, sortable: true, style: { minWidth: '16rem' } },
        { field: 'payment.methodPayment', header: 'Método de Pago', sortable: true, style: { minWidth: '10rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, sales, 'Reporte_Ventas') };
    const handleExportExcel = () => { exportExcel(sales, columns, 'Ventas') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={sales}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Ventas"
                    globalFilter={globalFilter}
                    header={header('Ventas', setGlobalFilter)}
                    columns={columns}
                />

                {/* DIALOG DETAIL */}
                <Dialog visible={saleDetailDialog} style={{ width: '65rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Datos Venta" modal className="p-fluid" onHide={hideDialog}>
                    <div className="container mt-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">calendar_clock</span>
                                    <div>
                                        <label htmlFor="date" className="font-bold d-block">Fecha</label>
                                        <p>{(sale.payment) && dateTemplate(sale.payment)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">monetization_on</span>
                                    <div>
                                        <label htmlFor="provider" className="font-bold d-block">Total</label>
                                        <p>{(sale.totalSale) && priceBodyTemplate(sale)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">currency_exchange</span>
                                    <div>
                                        <label htmlFor="methodPayment" className="font-bold d-block">Método de pago</label>
                                        <p>{(sale.payment) && sale.payment.methodPayment}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-start">
                                    <span className="material-symbols-outlined me-2">new_releases</span>
                                    <div>
                                        <label htmlFor="state" className="font-bold d-block">Estado</label>
                                        <p>{(sale.payment) && sale.payment.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4 className='text-center'>Lista de Detalles</h4>
                        {detailsList && (
                            detailsList.map((detail, index) => (
                                <div key={index} className="row mb-3">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">inventory_2</span>
                                            <div>
                                                <label htmlFor="product" className="font-bold d-block">Producto</label>
                                                <p>{(detail.product) && detail.product.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">production_quantity_limits</span>
                                            <div>
                                                <label htmlFor="quantity" className="font-bold d-block">Cantidad</label>
                                                <p>{(detail.product) && detail.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">monetization_on</span>
                                            <div>
                                                <label htmlFor="unitPrice" className="font-bold d-block">Precio Unitario</label>
                                                <p>{(detail.unitPrice) && formatCurrency(detail.unitPrice)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="d-flex align-items-start">
                                            <span className="material-symbols-outlined me-2">monetization_on</span>
                                            <div>
                                                <label htmlFor="unitPrice" className="font-bold d-block">Subtotal</label>
                                                <p>{(detail.unitPrice && detail.quantity) && formatCurrency((detail.unitPrice*detail.quantity))}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
