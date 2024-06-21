import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { DialogFooter, actionBodyTemplateInv, confirmDialogFooter, confirmDialogStock, exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getOneData, headerInv, inputNumberChange, rightToolbarTemplateExport, sendRequestStock } from '../../functionsDataTable';
import CustomDataTable from '../CustomDataTable';
import { Image } from 'primereact/image';
import { FloatInputNumber } from '../Inputs';

export default function ProductInventory() {
    let emptyProductInv = {
        idInventory: null,
        stock: null
    }

    let URL = 'http://localhost:8086/api/inventory/';
    const [productsInv, setProductsInv] = useState([]);
    const [productInv, setProductInv] = useState(emptyProductInv);
    const [productsInvDialog, setProductsInvDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getOneData(URL.concat('inventoryProducts'), setProductsInv);
    }, [URL]);

    function openUpdate(product) {
        setProductInv({ ...product });
        setTitle('Actualizar Stock');
        setOperation(1);
        setSubmitted(false);
        setProductsInvDialog(true);
    }

    const openReset = (product) => {
        setProductInv({ ...product });
        setTitle('Reiniciar Stock');
        setOperation(2);
        setSubmitted(false);
        setProductsInvDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductsInvDialog(false);
    };

    const hideConfirmProductsInvDialog = () => {
        setConfirmDialogVisible(false);
    };

    const updateStock = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        let url, method = 'PUT', parameters = { idInventory: productInv.idInventory, stock: productInv.stock };
        if (productInv.idInventory && (productInv.stock || productInv.stock === 0)) {
            if (operation === 1) {
                url = URL.concat('updateStock/' + productInv.idInventory);
            } else {
                url = URL.concat('resetStock/' + productInv.idInventory);
            }
            sendRequestStock(method, parameters, url, setProductsInv, URL.concat('inventoryProducts'), toast);
            setProductsInvDialog(false);
            setProductInv(emptyProductInv);
        }
    }

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, productInv, setProductInv);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.salePrice);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplateInv(rowData, openUpdate, openReset);
    };

    const imageBodyTemplate = (rowData) => {
        const imageData = rowData.product.image;
        const imageType = rowData.product.imageType;
        if (imageData) {
            return <Image src={`data:${imageType};base64,${imageData}`} alt={`Imagen producto ${rowData.product.name}`} className="shadow-2 border-round" width="80" height="80" preview />;
        } else {
            return <p>No hay imagen</p>;
        }
    };

    const productInvDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmProductDialogFooter = (
        confirmDialogFooter(hideConfirmProductsInvDialog, updateStock)
    );

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} style={{ background: getSeverity(rowData) }}></Tag>;
    };

    const stockBodyTemplate = (rowData) => {
        return <Tag value={rowData.stock} style={{ background: getSeverityStock(rowData) }} rounded></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.state) {
            case 'DISPONIBLE':
                return '#0D9276';

            case 'BAJO':
                return '#ff9209';

            case 'AGOTADO':
                return '#e72929';

            default:
                return null;
        }
    };

    const getSeverityStock = (product) => {

        if (product.stock < 1) {
            return '#e72929';
        } else if (product.stock < 6) {
            return '#ff9209';
        } else {
            return '#0D9276';
        }
    };

    const columns = [
        { field: 'product.image', header: 'Imagen', body: imageBodyTemplate, exportable: false, style: { minWidth: '8rem' } },
        { field: 'product.name', header: 'Producto', sortable: true, style: { minWidth: '5rem' } },
        { field: 'product.salePrice', header: 'Precio de Venta', body: priceBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'stock', header: 'Stock', body: stockBodyTemplate, sortable: true, style: { minWidth: '6rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.category.name', header: 'Categoría', sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '12rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns.slice(1, -1), productsInv, 'Reporte_Inventario_Productos') };
    const handleExportExcel = () => { exportExcel(productsInv, columns.slice(1, -1), 'Inventario_Productos') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={productsInv}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Productos"
                    globalFilter={globalFilter}
                    header={headerInv('Productos', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={productsInvDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productInvDialogFooter} onHide={hideDialog}>
                    <FloatInputNumber
                        className="field mt-4"
                        value={(operation === 2) && productInv.stock}
                        onInputNumberChange={onInputNumberChange} field='stock'
                        maxLength={5} required autoFocus
                        submitted={submitted}
                        label='Stock actual'
                        errorMessage='Stock es requerido.'
                    />
                </Dialog>

                {confirmDialogStock(confirmDialogVisible, 'Stock', confirmProductDialogFooter, hideConfirmProductsInvDialog, productInv, operation)}
            </div>
        </div>
    );
};