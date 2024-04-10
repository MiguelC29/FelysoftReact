import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { FloatLabel } from 'primereact/floatlabel';

export default function Reserves() {
    let emptyReserve = {
        idReserve: null,
        dateReserve: '',
        description: '',
        deposit: null,
        time: '',
        book: '',
        user: ''
    };

    const URL = 'http://localhost:8086/api/reserve/';
    const [reserve, setReserve] = useState(emptyReserve);
    const [reserves, setReserves] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reserveDialog, setReserveDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteReserveDialog, setDeleteReserveDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setReserves);
        getData('http://localhost:8086/api/book/', setBooks);
        getData('http://localhost:8086/api/user/', setUsers);
    }, []);

    const openNew = () => {
        setReserve(emptyReserve);
        setTitle('Registrar Reserva');
        setSelectedBook('');
        setSelectedUser('');
        getData('http://localhost:8086/api/book/', setBooks);
        getData('http://localhost:8086/api/user/', setUsers);
        setOperation(1);
        setSubmitted(false);
        setReserveDialog(true);
    };
    const editReserve = (reserve) => {
        setReserve({ ...reserve });
        setSelectedBook(reserve.book);
        setSelectedUser(reserve.user);
        getData('http://localhost:8086/api/book/', setBooks);
        getData('http://localhost:8086/api/user/', setUsers);
        setTitle('Editar Reserva');
        setOperation(2);
        setReserveDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setReserveDialog(false);
    };

    const hideConfirmReserveDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteReserveDialog = () => {
        setDeleteReserveDialog(false);
    };

    const saveReserve = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if (
            reserve.dateReserve &&
            reserve.description.trim() &&
            reserve.deposit &&
            reserve.time &&
            reserve.book &&
            reserve.user
        ) {
            let url, method, parameters;
            if (reserve.idReserve && operation === 2) {
                parameters = {
                    idReserve: reserve.idReserve,
                    dateReserve: reserve.dateReserve,
                    description: reserve.description.trim(),
                    deposit: reserve.deposit,
                    time: reserve.time,
                    fkIdBook: reserve.book.idBook,
                    fkIdUser: reserve.user.idUser
                };
                url = URL + 'update/' + reserve.idReserve;
                method = 'PUT';
            } else {
                parameters = {
                    dateReserve: reserve.dateReserve,
                    description: reserve.description.trim(),
                    deposit: reserve.deposit,
                    time: reserve.time,
                    fkIdBook: reserve.book.idBook,
                    fkIdUser: reserve.user.idUser
                };
                url = URL + 'create';
                method = 'POST';
            }
            sendRequest(method, parameters, url, setReserves, URL, operation, toast, 'Reserva ');
            setReserveDialog(false);
            setReserve(emptyReserve);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteReserve = (reserve) => {
        confirmDelete(reserve, setReserve, setDeleteReserveDialog);
    };

    const deleteReserve = () => {
        deleteData(URL, reserve.idReserve, setReserves, toast, setDeleteReserveDialog, setReserve, emptyReserve, 'Reserva ');
    };

    const onInputNumberChange = (e, description) => {
        inputNumberChange(e, description, reserve, setReserve);
    };

    const onInputChange = (e, description) => {
        inputChange(e, description, reserve, setReserve);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.deposit);
    };

    const actionBodyTemplateR = (rowData) => {
        return actionBodyTemplate(rowData, editReserve, confirmDeleteReserve);
    };

    const reserveDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmReserveDialogFooter = (
        confirmDialogFooter(hideConfirmReserveDialog, saveReserve)
    );

    const deleteReserveDialogFooter = (
        deleteDialogFooter(hideDeleteReserveDialog, deleteReserve)
    );

    const selectedBookTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.title}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const bookOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.title}</div>
            </div>
        );
    };

    const selectedUserTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.names}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const userOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.names}</div>
            </div>
        );
    };

    const columns = [
        { field: 'dateReserve', header: 'Fecha de Reserva', sortable: true, style: { minWidth: '10rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        { field: 'deposit', header: 'Depósito', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'time', header: 'Hora Reserva', sortable: true, style: { minWidth: '10rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'user.names', header: 'Usuario', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateR, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, reserves, 'Reporte_Reservas') };
    const handleExportExcel = () => { exportExcel(reserves, columns, 'Reservas') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={reserves}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Reservas"
                    globalFilter={globalFilter}
                    header={header('Reservas', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={reserveDialog} style={{ width: '40rem' }} header={title} modal className="p-fluid" footer={reserveDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="dateReserve" className="font-bold">Fecha de Reserva</label>
                    <InputText id="dateReserve" value={reserve.dateReserve} onChange={(e) => onInputChange(e, 'dateReserve')} type="date" required autoFocus className={classNames({ 'p-invalid': submitted && !reserve.dateReserve })} />
                    {submitted && !reserve.dateReserve && <small className="p-error">Fecha de Reserva es requerida.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">schedule</span>
                        </span>
                        <FloatLabel>
                            <InputMask id="time" value={reserve.time} mask="99:99:99" onChange={(e) => onInputChange(e, 'time')} required className={classNames({ 'p-invalid': submitted && !reserve.time })} />
                            <label htmlFor="time" className="font-bold">Hora Reserva</label>
                        </FloatLabel>
                        {submitted && !reserve.time && <small className="p-error">Hora es requerida.</small>}
                    </div>
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" value={reserve.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !reserve.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                        {submitted && !reserve.description && <small className="p-error">Descripción es requerida.</small>}
                    </div>
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="deposit" value={reserve.deposit} onValueChange={(e) => onInputNumberChange(e, 'deposit')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !reserve.deposit })} />
                            <label htmlFor="deposit" className="font-bold">Depósito</label>
                        </FloatLabel>
                        {submitted && !reserve.deposit && <small className="p-error">Depósito es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">book</span>
                            </span>
                            <FloatLabel>
                                <Dropdown id="book" value={selectedBook} onChange={(e) => { setSelectedBook(e.value); onInputNumberChange(e, 'book'); }} options={books} optionLabel="name" placeholder="Seleccionar Libro"
                                    filter valueTemplate={selectedBookTemplate} itemTemplate={bookOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !reserve.book && !selectedBook })}`} />
                                <label htmlFor="book" className="font-bold">Libro</label>
                            </FloatLabel>
                        </div>
                        {submitted && !reserve.book && !selectedBook && <small className="p-error">Libro es requerido.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">person</span>
                            </span>
                            <FloatLabel>
                                <Dropdown id="user" value={selectedUser} onChange={(e) => { setSelectedUser(e.value); onInputNumberChange(e, 'user'); }} options={users} optionLabel="title" placeholder="Seleccionar Usuario"
                                    filter valueTemplate={selectedUserTemplate} itemTemplate={userOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !reserve.user && !selectedUser })}`} />
                                <label htmlFor="user" className="font-bold">Usuario</label>
                            </FloatLabel>
                        </div>
                        {submitted && !reserve.user && !selectedUser && <small className="p-error">Usuario es requerido.</small>}
                    </div>
                </div>
            </Dialog>

            {DialogDelete(deleteReserveDialog, 'Reserva', deleteReserveDialogFooter, hideDeleteReserveDialog, reserve, reserve.description, 'la Reserva')}

            {confirmDialog(confirmDialogVisible, 'Reserva', confirmReserveDialogFooter, hideConfirmReserveDialog, reserve, operation)}
        </div>
    );
};