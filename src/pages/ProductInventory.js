import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';
import { Password } from 'primereact/password';
import CustomDataTable from '../components/CustomDataTable';

export default function ProductInventory() {

    // ESTADO AUTOMATICA DE ACUERDO A LA CANTIDAD DE STOCK, METODO DE ACTUALIZAR STOCK Y VALIDAR QUE VALOR DIGITA DE ACUERDO A ESO ACTUALIZAR EL ESTADO

    let URL = 'http://localhost:8086/api/inventory/inventoryProducts';
    const [productsInv, setProductsInv] = useState([]);
    // const [productsInvDialog, setProductsInvDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
    };

    useEffect(() => {
        getOneData(URL, setProductsInv);
    }, []);

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, '', '');
    };

    const columns = [
        { field: 'product.name', header: 'Producto', sortable: true, style: { minWidth: '5rem' } },
        { field: 'product.salePrice', header: 'Precio de Venta', sortable: true, style: { minWidth: '12rem' } },
        { field: 'stock', header: 'Stock', sortable: true, style: { minWidth: '12rem' } },
        { field: 'state', header: 'Estado', sortable: true, style: { minWidth: '12rem' } },
        { field: 'product.category.name', header: 'Categoria', sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '16rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate('')} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={productsInv}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos"
                    globalFilter={globalFilter}
                    header={header('Productos', setGlobalFilter)}
                    columns={columns}
                />
            </div>
        </div>
    )
}