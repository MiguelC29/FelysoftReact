import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatCurrency, header } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import CustomDataTable from '../CustomDataTable';
import Request_Service from '../service/Request_Service';

export default function TheirReserves() {;

    const URL = '/reserve/';
    const [reserves, setReserves] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchReserves = useCallback(async () => {
        try{
            const url = `${URL}reservesByUser`;
            await Request_Service.getData(url, setReserves);
        } catch (error) {
            console.error("Fallo al recuperar Reservas:", error);
        }
    }, [URL]);

    useEffect(() => {
        fetchReserves();
    }, [fetchReserves]);



    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.deposit);
    };

    const timeBodyTemplate = (rowData) => {
        return `${rowData.time} horas`;
    };

    const columns = [
        { field: 'dateReserve', header: 'Fecha de Reserva', sortable: true, style: { minWidth: '10rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        { field: 'deposit', header: 'Depósito', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'time', header: 'Duración Reserva',body: timeBodyTemplate , sortable: true, style: { minWidth: '10rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } }
    ];

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <CustomDataTable
                    dt={dt}
                    data={reserves}
                    dataKey="idReserve"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Reservas"
                    globalFilter={globalFilter}
                    header={header('Reservas', setGlobalFilter)}
                    columns={columns}
                />
            </div>
        </div>
    );
}
