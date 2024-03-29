import React, { useState, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, header, inputChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';
import { InputMask } from 'primereact/inputmask';

export default function Authors() {
    let emptyAuthor = {
        idAuthor: null,
        name: '',
        nationality: '',
        dateBirth: '',
        biography:''
    };

    const URL = 'http://localhost:8086/api/author/';
    const [authors, setAuthors] = useState([]);
    const [authorDialog, setAuthorDialog] = useState(false);
    const [deleteAuthorDialog, setDeleteAuthorDialog] = useState(false);
    const [author, setAuthor] = useState(emptyAuthor);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const openNew = () => {
        setAuthor(emptyAuthor);
        setTitle('Registrar Autor');
        setOperation(1);
        setSubmitted(false);
        setAuthorDialog(true);
    };

    const editAuthor = (author) => {
        setAuthor({ ...author });
        setTitle('Editar Autor');
        setOperation(2);
        setAuthorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAuthorDialog(false);
    };

    const hideConfirmAuthorDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteAuthorDialog = () => {
        setDeleteAuthorDialog(false);
    };

    const saveAuthor = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (
            author.name.trim() && 
            author.nationality.trim() &&
            author.dateBirth &&
            author.biography.trim() ){
            let url, method, parameters;

            if (author.idAuthor && operation === 2) {
                parameters = {
                    idAuthor: author.idAuthor, 
                    name: author.name.trim(),
                    nationality: author.nationality.trim(),
                    dateBirth: author.dateBirth,
                    biography: author.biography.trim() 
                };
                url = URL + 'update/' + author.idAuthor;
                method = 'PUT';
            } else {
                    parameters = {
                        idAuthor: author.idAuthor, 
                        name: author.name.trim(),
                        nationality: author.nationality.trim(),
                        dateBirth: author.dateBirth,
                        biography: author.biography.trim() 
                    };
                    url = URL + 'create';
                    method = 'POST';
                
            }

            sendRequest(method, parameters, url, setAuthors, URL, operation, toast);
            setAuthorDialog(false);
            setAuthor(emptyAuthor);
        }
    };
    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteAuthor = (author) => {
        confirmDelete(author, setAuthor, setDeleteAuthorDialog);
    };

    const deleteAuthor = () => {
        deleteData(URL, author.idAuthor, setAuthors, toast, setDeleteAuthorDialog, setAuthor, emptyAuthor);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, author, setAuthor);
    };


    const actionBodyTemplateA = (rowData) => {
        return actionBodyTemplate(rowData, editAuthor, confirmDeleteAuthor);
    };

    const authorDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmAuthorDialogFooter = (
        confirmDialogFooter(hideConfirmAuthorDialog, saveAuthor)
    );
    const deleteAuthorDialogFooter = (
        deleteDialogFooter(hideDeleteAuthorDialog, deleteAuthor)
    );

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'nationality', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { field: 'dateBirth', header: 'Fecha de Nacimiento', sortable: true, style: { minWidth: '10rem' } },
        { field: 'biography', header: 'Biografia', sortable: true, style: { minWidth: '16rem' } },
        { body: actionBodyTemplateA, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={authors}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Autores"
                    globalFilter={globalFilter}
                    header={header('Autores', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={authorDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={authorDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={author.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !author.name })} />
                    {submitted && !author.name && <small className="p-error">Nombre es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="nationality" className="font-bold">
                        Nacionalidad  
                    </label>
                    <InputText id="natioality" value={author.nationality} onChange={(e) => onInputChange(e, 'nationality')} required className={classNames({ 'p-invalid': submitted && !author.nationality })} />
                    {submitted && !author.nationality && <small className="p-error">Nacionalidad es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="dateBirth" className="font-bold">
                        Fecha de Nacimiento
                    </label>
                    <InputMask id="dateBirth" value={author.dateBirth} onChange={(e) => onInputChange(e, 'dateBirth')} mask="9999-99-99" placeholder="9999-99-99" slotChar="yyyy-mm-dd" required className={classNames({ 'p-invalid': submitted && !author.dateBirth })} />
                    {submitted && !author.dateBirth && <small className="p-error">Fecha de Nacimiento es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="biography" className="font-bold">
                        Biografia
                    </label>
                    <InputText id="biography" value={author.biography} onChange={(e) => onInputChange(e, 'biography')} required className={classNames({ 'p-invalid': submitted && !author.biography })} />
                    {submitted && !author.biography && <small className="p-error">Biografia es requerida.</small>}
                </div>

            </Dialog>

            {DialogDelete(deleteAuthorDialog, 'Autor', deleteAuthorDialogFooter, hideDeleteAuthorDialog, author, author.name, 'el Autor')}

            {confirmDialog(confirmDialogVisible, 'Autor', confirmAuthorDialogFooter, hideConfirmAuthorDialog, author, operation)}

        </div>
    );
}