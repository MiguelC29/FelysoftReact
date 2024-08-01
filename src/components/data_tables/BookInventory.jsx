import React, { useEffect, useRef, useState } from 'react';
import { exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, headerInv, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import CustomDataTable from '../CustomDataTable';
import Request_Service from '../service/Request_Service';

export default function BookInventory() {
    const [booksInv, setBooksInv] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData('/inventory/inventoryBooks', setBooksInv);
    }, []);

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.book.priceTime);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} style={{ background: getSeverity(rowData) }}></Tag>;
    };

    const getSeverity = (book) => {
        switch (book.state) {
            case 'DISPONIBLE':
                return '#0D9276';
            case 'RESERVADO':
                return 'rgb(14, 165, 233)';
            default:
                return null;
        }
    };

    const columns = [
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '5rem' } },
        { field: 'book.priceTime', header: 'Precio Tiempo', body: priceBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'book.author.name', header: 'Autor', sortable: true, style: { minWidth: '8rem' } },
        { field: 'book.genre.name', header: 'Género', sortable: true, style: { minWidth: '12rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } }
    ];
    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, booksInv, 'Reporte_Inventario_Libros') };
    const handleExportExcel = () => { exportExcel(booksInv, columns, 'Inventario_Libros') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={booksInv}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Libros"
                    globalFilter={globalFilter}
                    header={headerInv('Libros', setGlobalFilter)}
                    columns={columns}
                />
            </div>
        </div>
    );
};
