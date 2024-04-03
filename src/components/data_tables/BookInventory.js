import React, { useEffect, useRef, useState } from 'react'
import { exportCSV, exportExcel, exportPdf, formatCurrency, formatDate, getOneData, headerInv, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Toolbar } from 'primereact/toolbar';
import CustomDataTable from '../CustomDataTable';

export default function BookInventory() {

    let URL = 'http://localhost:8086/api/inventory/';
    const [booksInv, setBooksInv] = useState([]);
    // const [bookInv, setBookInv] = useState(emptyBookInv);
    // const [booksInvDialog, setBookInvDialog] = useState(false);
    // const [submitted, setSubmitted] = useState(false);
    // const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    // const [operation, setOperation] = useState();
    // const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getOneData(URL.concat('inventoryBooks'), setBooksInv);
    }, [URL]);

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.book.priceTime);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (book) => {
        switch (book.state) {
            case 'DISPONIBLE':
                return 'success';

            case 'RESERVADO':
                return 'danger';

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
            <Toast ref={toast} />
            <div className="card" style={{background: '#9bc1de'}}>
                <Tooltip target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4" style={{background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none'}} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

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
    )
}
