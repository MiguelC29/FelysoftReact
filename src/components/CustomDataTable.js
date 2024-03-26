import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function CustomDataTable({ dt, data, columns, dataKey, currentPageReportTemplate, globalFilter, header }) {
    return (
        <DataTable
            ref={dt}
            value={data}
            dataKey={dataKey}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={currentPageReportTemplate}
            globalFilter={globalFilter}
            header={header}
        >
            {columns.map(column => (
                <Column
                    key={column.field}
                    field={column.field}
                    header={column.header}
                    sortable={column.sortable}
                    style={column.style}
                    body={column.body}
                    exportable={column.exportable}
                />
            ))}
        </DataTable>
    );
}