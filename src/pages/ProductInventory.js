import React, { useState, useEffect, useRef } from 'react';
import { DialogFooter, actionBodyTemplateInv, confirmDialogFooter, confirmDialogStock, getOneData, headerInv, inputNumberChange, rightToolbarTemplate, sendRequestStock } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import CustomDataTable from '../components/CustomDataTable';
import { Tag } from 'primereact/tag';

export default function ProductInventory() {

    let emptyProductInv = {
        idInventory: null,
        stock: 0
    }

    let URL = 'http://localhost:8086/api/inventory/';
    const [productsInv, setProductsInv] = useState([]);
    const [productInv, setProductInv] = useState(emptyProductInv);
    const [productsInvDialog, setProductsInvDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getOneData(URL.concat('inventoryProducts'), setProductsInv);
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };

    const openUpdate = (product) => {
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
        console.log(productInv.idInventory);
        if (productInv.idInventory && productInv.stock) {
            if (operation === 1) {
                url = URL.concat('updateStock/' + productInv.idInventory);
            } else {
                url = URL.concat('resetStock/' + productInv.idInventory);
            }

            sendRequestStock(method, parameters, url, setProductsInv, URL, toast);
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.salePrice);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplateInv(rowData, openUpdate, openReset);
    };

    const productInvDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmProductDialogFooter = (
        confirmDialogFooter(hideConfirmProductsInvDialog, updateStock)
    );

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} severity={getSeverity(rowData)}></Tag>;
    };

    const stockBodyTemplate = (rowData) => {
        return <Tag value={rowData.stock} severity={getSeverityStock(rowData)} rounded></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.state) {
            case 'DISPONIBLE':
                return 'success';

            case 'BAJO':
                return 'warning';

            case 'AGOTADO':
                return 'danger';

            default:
                return null;
        }
    };

    const getSeverityStock = (product) => {

        if (product.stock <= 1) {
            return 'danger';
        } else if (product.stock < 6) {
            return 'warning';
        } else if (product.stock >= 6) {
            return 'success';
        } else {
            return null
        }
    };

    const columns = [
        { field: 'product.name', header: 'Producto', sortable: true, style: { minWidth: '5rem' } },
        { field: 'product.salePrice', header: 'Precio de Venta', body: priceBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'stock', header: 'Stock', body: stockBodyTemplate, sortable: true, style: { minWidth: '6rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.category.name', header: 'Categoria', sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '12rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={productsInv}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos"
                    globalFilter={globalFilter}
                    header={headerInv('Productos', setGlobalFilter)}
                    columns={columns}
                />
                <Dialog visible={productsInvDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productInvDialogFooter} onHide={hideDialog}>
                    <div className="field col">
                        <label htmlFor="stock" className="font-bold">
                            Stock
                        </label>
                        <InputNumber id="stock" value={(operation === 2) && productInv.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} required className={classNames({ 'p-invalid': submitted && !productInv.stock })} />
                        {submitted && !productInv.stock && <small className="p-error">Stock es requerido.</small>}
                    </div>
                </Dialog>

                {confirmDialogStock(confirmDialogVisible, 'Stock', confirmProductDialogFooter, hideConfirmProductsInvDialog, productInv, operation)}
            </div>
        </div>
    )
}