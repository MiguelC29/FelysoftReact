import React, { useState, useEffect, useRef } from 'react';
import {  formatCurrency, formatDate, getOneData, headerInv, rightToolbarTemplate,  } from '../functionsDataTable'

import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import CustomDataTable from '../components/CustomDataTable';
import { Tag } from 'primereact/tag';

export default function BookInventory() {


    let URL = 'http://localhost:8086/api/inventory/';
    const [booksInv, setBooksInv] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getOneData(URL.concat('inventoryBooks'), setBooksInv);
    }, []);

   
    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.book.priceTime);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };



    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} severity={getSeverity(rowData)}></Tag>;
    };


    const getSeverity = (book) => {
        switch (book.state) {
            case 'RESERVADO':
                return 'success';

            default:
                return null;
        }
    };

    const columns = [
        { field: 'book.name', header: 'Libro', sortable: true, style: { minWidth: '5rem' } },
        { field: 'book.priceTime', header: 'Precio de Tiempo', body: priceBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'book.genre.name', header: 'Genero', sortable: true, style: { minWidth: '8rem' } },
        { field: 'book.author.name', header: 'Autor', sortable: true, style: { minWidth: '12rem' } },
        { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
        { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" right={rightToolbarTemplate(exportCSV)}></Toolbar>

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