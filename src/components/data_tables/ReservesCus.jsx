import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import Request_Service from '../service/Request_Service';
import { confirmDialog, confirmDialogFooter, DialogFooter, formatCurrency, inputChange, inputNumberChange } from '../../functionsDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import UserService from '../service/UserService';
import { Toast } from 'primereact/toast';

export default function ReservesCus() {
    let emptyReserve = {
        idReserve: null,
        dateReserve: '',
        description: '',
        deposit: null,
        time: null,
        book: '',
        user: ''
    };

    const URL = '/reserve/';
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [reserveDialog, setReserveDialog] = useState(false);
    const [reserve, setReserve] = useState(emptyReserve);
    const toast = useRef(null);

    useEffect(() => {
        //fetchProfileInfo();
        getBooks();
    }, []);

    const getBooks = () => {
        Request_Service.getData('/inventory/invBooksNoReserved', setBooks);
    }

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperar token de localStorage
            const response = await UserService.getYourProfile(token);
            setReserve(prevReserve => ({ ...prevReserve, user: response.user })); // Asignar usuario al estado reserve
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const openReserveDialog = (book) => {
        setReserve({
            ...emptyReserve,
            book: book,
        });
        fetchProfileInfo();
        setSubmitted(false);
        setReserveDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setReserveDialog(false);
    };

    const hideConfirmReserveDialog = () => {
        setConfirmDialogVisible(false);
    };

    const saveReserve = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        const isValid = reserve.dateReserve &&
            reserve.description.trim() &&
            reserve.deposit &&
            reserve.time &&
            reserve.book &&
            reserve.user; // Verificar que el usuario está presente

        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if (!(reserve.time > 0 && reserve.time <= 3)) {
            return;
        }

        let parameters;
        const url = URL + 'create';

        parameters = {
            dateReserve: reserve.dateReserve,
            description: reserve.description.trim(),
            deposit: reserve.deposit,
            time: reserve.time,
            fkIdBook: reserve.book.idBook,
            fkIdUser: reserve.user.idUser
        };

        if (isValid) {
            await Request_Service.sendRequestReserve('POST', parameters, url, toast, '/inventory/invBooksNoReserved', setBooks);
            setReserveDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmReserveDialogFooter = (
        confirmDialogFooter(hideConfirmReserveDialog, saveReserve)
    );

    const reserveDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData);
    };

    const onInputChange = (e, name) => {
        /*const { value } = e.target;
        setReserve(prevReserve => ({
            ...prevReserve,
            [description]: value
        }));*/
        inputChange(e, name, reserve, setReserve);
    };

    const onInputNumberChange = (e, name) => {
        /*const { value } = e;
        setReserve(prevReserve => ({
            ...prevReserve,
            [description]: value
        }));*/
        inputNumberChange(e, name, reserve, setReserve);
    };

    const listItem = (book, index) => (
        <div className="col-12" key={book.id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <img className="w-9 sm:w-16rem xl:w-10rem block xl:block mx-auto" src={`data:${book.book.typeImg};base64,${book.book.image}`} alt={`Imagen Libro ${book.book.title}`} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{book.book.title}</div>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-book"></i>
                                <span className="font-semibold">{book.book.genre.name}</span>
                            </span>
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-user"></i>
                                <span className="font-semibold">{book.book.author.name}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">{priceBodyTemplate(book.book.priceTime)}</span>
                        <Button label="Reservar libro" icon="pi pi-book" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} onClick={() => openReserveDialog(book.book)} />
                    </div>
                </div>
            </div>
        </div>
    );

    const gridItem = (book) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book.id}>
            <div className="p-4 border-1 surface-border border-round">
                <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-book"></i>
                        <span className="font-semibold">{book.book.genre.name}</span>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-user"></i>
                        <span className="font-semibold">{book.book.author.name}</span>
                    </div>
                </div>
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-5 sm:w-16rem lg:10rem xl:w-10rem block xl:block mx-auto" src={`data:${book.book.typeImg};base64,${book.book.image}`} alt={`Imagen Libro ${book.book.title}`} />
                    <div className="text-2xl font-bold">{book.book.title}</div>
                </div>
                <div className="flex align-items-center justify-content-between">
                    <span className="text-2xl font-semibold">{priceBodyTemplate(book.book.priceTime)}</span>
                    <Button label="Reservar libro" icon="pi pi-book" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} onClick={() => openReserveDialog(book.book)} disabled={book.state === 'RESERVADO'} />
                </div>
            </div>
        </div>
    );

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? listItem(book, index) : gridItem(book);
    };

    const filteredBooks = books.filter(book => book?.book?.title?.toLowerCase().includes(globalFilter.toLowerCase()));

    const header = () => (
        <>
            <div className="flex justify-content-start">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar libro..." />
                </span>
            </div>
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} position="bottom-right" />
            <DataView
                value={filteredBooks}
                layout={layout}
                header={header()}
                itemTemplate={itemTemplate}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={"Mostrando {first} de {last} de {totalRecords} libros"}
                emptyMessage="No hay libros disponibles"
            />

            <Dialog visible={reserveDialog} style={{ width: '40rem' }} header="Reservar Libro" modal className="p-fluid" footer={reserveDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="dateReserve" className="font-bold">Fecha de Reserva</label>
                    <InputText id="dateReserve" value={reserve.dateReserve} onChange={(e) => onInputChange(e, 'dateReserve')} type="date" required autoFocus className={classNames({ 'p-invalid': submitted && !reserve.dateReserve })} />
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
                            <InputText id="description" value={reserve.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !reserve.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !reserve.description && <small className="p-error">Descripción es requerida.</small>}
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
                    </div>
                    {submitted && !reserve.deposit && <small className="p-error">Depósito es requerido.</small>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3 ms-2">
                        <div className="d-flex align-items-start">
                            <span className="material-symbols-outlined me-2">calendar_add_on</span>
                            <div>
                                <label htmlFor="book" className="font-bold d-block">Libro</label>
                                <p>{reserve.book.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog >

            {confirmDialog(confirmDialogVisible, 'Reserva', confirmReserveDialogFooter, hideConfirmReserveDialog, reserve, 1)}
        </div >
    );
}
