import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, headerInv, rightToolbarTemplateExport } from '../../functionsDataTable';
import CustomDataTable from '../CustomDataTable';
import { Image } from 'primereact/image';
import Request_Service from '../service/Request_Service';

export default function ProductInventory() {

    const URL = '/inventory/';
    const [productsInv, setProductsInv] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('inventoryProducts'), setProductsInv);
    }, []);

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.salePrice);
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

        if (product.stock <= 0) {
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
        { field: 'product.brand.name', header: 'Marca', sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.salePrice', header: 'Precio de Venta', body: priceBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'stock', header: 'Stock', body: stockBodyTemplate, sortable: true, style: { minWidth: '6rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.category.name', header: 'Categoría', sortable: true, style: { minWidth: '8rem' } },
        { field: 'product.provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '12rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
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
                    dataKey="product.idProduct"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Productos"
                    globalFilter={globalFilter}
                    header={headerInv('Productos', setGlobalFilter)}
                    columns={columns}
                />
            </div>
        </div>
    );
};
