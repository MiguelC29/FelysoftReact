import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';
import { Tag } from 'primereact/tag';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import { FloatInputNumberMoneyIcon } from '../Inputs';

export default function Reserves() {
    let emptyReserve = {
        idReserve: null,
        dateReserve: '',
        description: '',
        deposit: null,
        time: null,
        book: '',
        user: '',
        state: '',
    };

    const URL = '/reserve/';
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
    const [onlyDisabled, setOnlyDisabled] = useState(false);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // ROLES
    const isAdmin = UserService.isAdmin();
    const isSalesPerson = UserService.isSalesPerson();

    const fetchReserves = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setReserves);
        } catch (error) {
            console.error("Fallo al recuperar Reservas:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchReserves();
        getBooks();
        getUsers();
    }, [onlyDisabled, fetchReserves]);

    const getBooks = () => {
        return Request_Service.getData('/book/all', setBooks);
    }

    const getUsers = () => {
        return Request_Service.getData('/user/all', (data) => {
            const customers = data.filter(user => user.role.name === 'CUSTOMER');
            console.log(data);

            setUsers(customers);
        });
    }

    //Constante de los dias que van a estar habilitados y los dias de hoy
    const today = new Date();
    const daysLater = addDays(today, 6);

    //Convierte un objeto Date en una cadena con el formato yyyy-MM-dd
    const formatDate = (date) => {
        const year = date.getFullYear();
        //padStart para asegurar que el mes y el día siempre tengan dos dígitos.
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseDate = (dateString) => {
        // Función para convertir el formato yyyy-MM-dd a un objeto Date
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const selectedDate = reserve.dateReserve ? parseDate(reserve.dateReserve) : null;

    const filterDate = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const isDateValid = (date) => {
        return filterDate(date) && date <= daysLater;
    };

    const onDateChange = (date) => {
        if (date) {
            const formattedDate = formatDate(date);
            setReserve((prevState) => ({ ...prevState, dateReserve: formattedDate }));
        } else {
            setReserve((prevState) => ({ ...prevState, dateReserve: '' }));
        }
    };


    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.state} style={{ background: getSeverity(rowData) }}></Tag>;
    };

    const getSeverity = (reserve) => {
        switch (reserve.state) {
            case 'FINALIZADA':
                return '#0D9276';
            case 'RESERVADA':
                return 'rgb(14, 165, 233)';
            case 'CANCELADA':
                return '#e72929';
            default:
                return null;
        }
    };

    const openNew = () => {
        setReserve(emptyReserve);
        setTitle('Registrar Reserva');
        setSelectedBook('');
        setSelectedUser('');
        getBooks();
        getUsers();
        setOperation(1);
        setSubmitted(false);
        setReserveDialog(true);
    };
    const editReserve = (reserve) => {
        setReserve({ ...reserve });
        setSelectedBook(reserve.book);
        setSelectedUser(reserve.user);
        getBooks();
        getUsers();
        setTitle('Editar Reserva');
        setOperation(2);
        setReserveDialog(true);
    };
    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setReserveDialog(false);
    };

    const hideConfirmReserveDialog = () => {
        setConfirmDialogVisible(false);
    };

    const timeBodyTemplate = (rowData) => {
        return `${rowData.time} ${rowData.time === 1 ? 'hora' : 'horas'}`;
    };


    const hideDeleteReserveDialog = () => {
        setDeleteReserveDialog(false);
    };

    const saveReserve = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid = reserve.dateReserve &&
            reserve.description.trim() &&
            reserve.deposit &&
            reserve.time &&
            reserve.book &&
            reserve.user;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (reserve.idReserve && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
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
            // Verificar que los campos requeridos están presentes al crear
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

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Reserva ', URL.concat('all'), setReserves);
            setReserveDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteReserve = (reserve) => {
        confirmDelete(reserve, setReserve, setDeleteReserveDialog);
    };

    const deleteReserve = () => {
        Request_Service.deleteData(URL, reserve.idReserve, setReserves, toast, setDeleteReserveDialog, setReserve, emptyReserve, 'Reserva ', URL.concat('all'));
    };

    const handleEnable = (reserve) => {
        Request_Service.sendRequestEnable(URL, reserve.idReserve, setReserves, toast, 'Reserva ');
    }

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
        return actionBodyTemplate(rowData, editReserve, confirmDeleteReserve, onlyDisabled, handleEnable);
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

    const onBookChange = (e) => {
        const book = e.value;
        setSelectedBook(book);
        setReserve(prevReserve => ({
            ...prevReserve,
            book: book,
            deposit: book ? prevReserve.time * book.priceTime : null
        }));
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
        { field: 'time', header: 'Duración Reserva (Horas)', body: timeBodyTemplate, sortable: true, style: { minWidth: '10rem' } },
        { field: 'book.title', header: 'Libro', sortable: true, style: { minWidth: '10rem' } },
        { field: 'user.names', header: 'Usuario', sortable: true, style: { minWidth: '10rem' } },
        { field: 'state', header: 'Estado', body: statusBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        (isAdmin || isSalesPerson) && { body: actionBodyTemplateR, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, reserves, 'Reporte_Reservas') };
    const handleExportExcel = () => { exportExcel(reserves, columns, 'Reservas') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                {(isAdmin || isSalesPerson) &&
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
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
                    <DatePicker
                        selected={selectedDate}
                        onChange={onDateChange}
                        filterDate={isDateValid} // Aplicar el filtro de días válidos
                        minDate={today} // Fecha mínima es hoy
                        maxDate={daysLater}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Selecciona una fecha"
                        className={`p-inputtext p-component ${submitted && !reserve.dateReserve ? 'p-invalid' : ''}`}
                    />
                    {submitted && !reserve.dateReserve && <small className="p-error">Fecha de Reserva es requerida.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">hourglass_top</span>
                        </span>
                        <FloatLabel>
                            <label htmlFor="time" className="font-bold">Duracion Reserva</label>
                            <InputNumber
                                id="time"
                                value={reserve.time}
                                onChange={(e) => onInputNumberChange(e, 'time')}
                                required
                                min={1}
                                max={3}
                                showButtons
                                onKeyDown={(e)=>e.preventDefault()}
                                className={classNames({ 'p-invalid': submitted && (!reserve.time || !(reserve.time > 0 && reserve.time <= 3)) })}
                            />
                        </FloatLabel>
                    </div>
                    {submitted && !reserve.time && <small className="p-error">Duración en horas es requerida.</small>}
                    {reserve.time && !(reserve.time > 0 && reserve.time <= 3) && <small className="p-error">Duración de la reserva permitida es de 1 a 3 horas maximo</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" value={reserve.description} onChange={(e) => onInputChange(e, 'description')} required  maxLength={105} className={classNames({ 'p-invalid': submitted && !reserve.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !reserve.description && <small className="p-error">Descripción es requerida.</small>}
                </div>
                <FloatInputNumberMoneyIcon
                    className="field mt-5"
                    value={reserve.deposit} field='deposit'
                    required
                    label='Saldo a Pagar'
                    disabled="disabled"
                />
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">book</span>
                            </span>
                            <FloatLabel>
                                <Dropdown
                                    id="book"
                                    value={selectedBook}
                                    onChange={onBookChange}
                                    options={books}
                                    optionLabel="title"
                                    placeholder="Seleccionar Libro"
                                    filter
                                    valueTemplate={selectedBookTemplate}
                                    itemTemplate={bookOptionTemplate}
                                    emptyMessage="No hay datos"
                                    emptyFilterMessage="No hay resultados encontrados"
                                    required
                                    className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !reserve.book && !selectedBook })}`}
                                />
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
                                <Dropdown id="user" value={selectedUser} onChange={(e) => { setSelectedUser(e.value); onInputNumberChange(e, 'user'); }} options={users} optionLabel="names" placeholder="Seleccionar Usuario"
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