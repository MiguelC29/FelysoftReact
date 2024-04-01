import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { Tooltip } from 'primereact/tooltip';

export default function Reserves() {
    let emptyReserve = {
        idReserve: null,
        dateReserve: '',
        description: '',
        deposit: 0,
        time: '',
        book: '',
        user: ''
    };

    const URL = 'http://localhost:8086/api/reserve/';
    const [reserves, setReserves] = useState([]);

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [reserveDialog, setReserveDialog] = useState(false);
    const [deleteReserveDialog, setDeleteReserveDialog] = useState(false);
    const [reserve, setReserve] = useState(emptyReserve);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
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

    const handleBookChange = (bookId) => {
        setSelectedBook(bookId);
    };
    
    const handleUserChange = (userId) => {
        setSelectedUser(userId);
    };
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
                    fkIdUser: reserve.user.numIdentification
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
                    fkIdUser: reserve.user.numIdentification
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setReserves, URL, operation, toast,'Reserva ');
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
        deleteData(URL, reserve.idReserve, setReserves, toast, setDeleteReserveDialog, setReserve, emptyReserve,'Reserva ');
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
        { field: 'description', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { field: 'deposit', header: 'Deposito', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'time', header: 'Hora Reserva', sortable: true, style: { minWidth: '10rem' } },

        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'user.names', header: 'Usuario', sortable: true, style: { minWidth: '10rem' } },

        { body: actionBodyTemplateR, exportable: false, style: { minWidth: '12rem' } },
    ];

      // EXPORT DATA
      const handleExportPdf = () => { exportPdf(columns, reserves, 'Reporte_Reservas') };
      const handleExportExcel = () => { exportExcel(reserves, columns, 'Reservas') };
      const handleExportCsv = () => { exportCSV(false, dt)};

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
            <Tooltip
             target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

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
                    <label htmlFor="dateReserve" className="font-bold">
                        Fecha de Reserva
                    </label>
                    <InputText id="dateReserve" value={reserve.dateReserve} onChange={(e) => onInputChange(e, 'dateReserve')} type="date" required className={classNames({ 'p-invalid': submitted && !reserve.dateReserve })} />
                    {submitted && !reserve.dateReserve && <small className="p-error">Fecha de Reserva es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripción
                    </label>
                    <InputText id="description" value={reserve.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !reserve.description })} />
                    {submitted && !reserve.description && <small className="p-error">Descripcion es requerida.</small>}
                </div>

                <div className="field col">
                    <label htmlFor="deposit" className="font-bold">
                        Deposito
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="deposit" value={reserve.deposit} onValueChange={(e) => onInputNumberChange(e, 'deposit')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !reserve.deposit })} />
                    </div>
                    {submitted && !reserve.deposit && <small className="p-error">Deposito es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="time" className="font-bold">
                      Hora Reserva (HH:MM:SS)
                    </label>
                    <InputMask id="time" value={reserve.time} mask="99:99:99" onChange={(e) => onInputChange(e, 'time')} required className={classNames({ 'p-invalid': submitted && !reserve.time })} />
                    {submitted && !reserve.time && <small className="p-error">Hora es requerida.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="book" className="font-bold">
                           Libro
                        </label>
                        <Dropdown id="book" value={selectedBook} onChange={(e) => { handleBookChange(e.target.value);onInputNumberChange(e, 'book'); }} options={books} optionLabel="name" placeholder="Seleccionar Libro"
                            filter valueTemplate={selectedBookTemplate} itemTemplate={bookOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !reserve.book && !selectedBook })}`} />

                        {submitted && !reserve.book && !selectedBook && <small className="p-error">Libro es requerido.</small>}
                    </div>

                    <div className="field col">
                        <label htmlFor="user" className="font-bold">
                            Usuario
                        </label>
                        <Dropdown id="user" value={selectedUser} onChange={(e) => {handleUserChange(e.target.value);onInputNumberChange(e, 'user'); }} options={users} optionLabel="name" placeholder="Seleccionar Usuario"
                            filter valueTemplate={selectedUserTemplate} itemTemplate={userOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !reserve.user && !selectedUser })}`} />
                        {submitted && !reserve.user && !selectedUser && <small className="p-error">Usuario es requerido.</small>}
                    </div>
                </div>

            </Dialog>
            {DialogDelete(deleteReserveDialog, 'Reserva', deleteReserveDialogFooter, hideDeleteReserveDialog, reserve, reserve.description, 'la Reserva')}

            {confirmDialog(confirmDialogVisible, 'Reserva', confirmReserveDialogFooter, hideConfirmReserveDialog, reserve, operation)}
        </div>
    );
}