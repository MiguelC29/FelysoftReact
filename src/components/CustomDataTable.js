import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function CustomDataTable({ dt, data, columns, dataKey, currentPageReportTemplate, globalFilter, header }) {
    return (
        <div className='card' style={{ overflowX: 'auto' }}>
            <DataTable
                ref={dt}
                value={data}
                dataKey={dataKey}
                paginator
                rows={10}
                removableSort //permite que se remueva el sortable
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={currentPageReportTemplate}
                globalFilter={globalFilter}
                header={header}
                emptyMessage="No hay datos disponibles"
                tableStyle={{ minWidth: '60rem', maxWidth: '75rem' }}
            >
                {columns.map((column, index) => (
                    <Column
                        key={`${column.field}-${index}`}
                        field={column.field}
                        header={column.header}
                        sortable={column.sortable}
                        style={{
                            background: '#f3f0f0d2'
                        }}
                        body={column.body}
                        exportable={column.exportable}
                    />
                ))}
            </DataTable>
        </div>
    );
};