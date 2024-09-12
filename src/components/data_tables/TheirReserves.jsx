import React, { useState, useRef, useEffect, useCallback } from 'react';
import { confirmDialogFooter, formatCurrency, header } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import CustomDataTable from '../CustomDataTable';
import Request_Service from '../service/Request_Service';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function TheirReserves() {

    const URL = '/reserve/';
    const [reserves, setReserves] = useState([]);
    const [reserve, setReserve] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchReserves = useCallback(async () => {
        try {
            const url = `${URL}reservesByUser`;
            await Request_Service.getData(url, setReserves);
        } catch (error) {
            console.error("Fallo al recuperar Reservas:", error);
        }
    }, [URL]);

    useEffect(() => {
        fetchReserves();
    }, [fetchReserves]);

    const cancelReserve = (reserve) => {
        Request_Service.cancelReserves(URL, reserve.idReserve, setReserves, toast, setReserve, URL.concat('reservesByUser'));
        setConfirmDialogVisible(false);
    };

    const handleCancel = (reserve) => {
        setReserve(reserve);
        setConfirmDialogVisible(true);
    };

    const actionBodyTemplate = (rowData) => {
        console.log(rowData);
        
        return (
            (rowData.state === "RESERVADA") ?
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger rounded" onClick={() => handleCancel(rowData)} style={{ border: 'none' }} />
            : "No hay Acciones"
        );
    };

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
        { field: 'time', header: 'Duración Reserva (Horas)', body: timeBodyTemplate, sortable: true, style: { minWidth: '10rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'state', header: 'Estado', sortable: true, style: { minWidth: '10rem' } },
        { header: 'Acciones', body: actionBodyTemplate, exportable: false, style: { minWidth: '12rem' } }
    ];


    const hideConfirmDialog = () => {
        setConfirmDialogVisible(false);
    };

    const confirmCancelDialogFooter = (
        confirmDialogFooter(hideConfirmDialog, cancelReserve)
    );

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

            <Dialog
                visible={confirmDialogVisible}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirmar Cancelación"
                modal
                footer={confirmCancelDialogFooter}
                onHide={hideConfirmDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {reserve && (
                        <span>¿Está seguro de que desea cancelar la reserva del libro <b>{reserve.book.title}</b>?</span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
