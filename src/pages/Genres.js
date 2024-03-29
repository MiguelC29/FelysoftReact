import React, { useState, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, header, inputChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';

export default function Genres() {
    let emptyGenre = {
        idGenre: null,
        name: '',
        description: ''
    };

    const URL = 'http://localhost:8086/api/genre/';
    const [genres, setGenres] = useState([]);
    const [genreDialog, setGenreDialog] = useState(false);
    const [deleteGenreDialog, setDeleteGenreDialog] = useState(false);
    const [genre, setGenre] = useState(emptyGenre);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const openNew = () => {
        setGenre(emptyGenre);
        setTitle('Registrar Genero');
        setOperation(1);
        setSubmitted(false);
        setGenreDialog(true);
    };

    const editGenre = (genre) => {
        setGenre({ ...genre });
        setTitle('Editar Genero');
        setOperation(2);
        setGenreDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGenreDialog(false);
    };

    const hideConfirmGenreDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteGenreDialog = () => {
        setDeleteGenreDialog(false);
    };

    const saveGenre = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (
            genre.name.trim() && 
            genre.description.trim()) {
            let url, method, parameters;

            if (genre.idGenre && operation === 2) {
                parameters = {
                    idGenre: genre.idGenre,
                    name: genre.name.trim(), 
                    description: genre.description.trim()
                };
                url = URL + 'update/' + genre.idGenre;
                method = 'PUT';
            } else {
                    parameters = {
                         name: genre.name.trim(), 
                         description: genre.description.trim()
                    };
                    url = URL + 'create';
                    method = 'POST';
                
            }

            sendRequest(method, parameters, url, setGenres, URL, operation, toast);
            setGenreDialog(false);
            setGenre(emptyGenre);
        }
    };
    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteGenre = (genre) => {
        confirmDelete(genre, setGenre, setDeleteGenreDialog);
    };

    const deleteGenre = () => {
        deleteData(URL, genre.idGenre, setGenres, toast, setDeleteGenreDialog, setGenre, emptyGenre);
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, genre, setGenre);
    };


    const actionBodyTemplateG = (rowData) => {
        return actionBodyTemplate(rowData, editGenre, confirmDeleteGenre);
    };

    const genreDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmGenreDialogFooter = (
        confirmDialogFooter(hideConfirmGenreDialog, saveGenre)
    );
    const deleteGenreDialogFooter = (
        deleteDialogFooter(hideDeleteGenreDialog, deleteGenre)
    );

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { body: actionBodyTemplateG, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={genres}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Generos"
                    globalFilter={globalFilter}
                    header={header('Generos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={genreDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={genreDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={genre.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !genre.name })} />
                    {submitted && !genre.name && <small className="p-error">Nombre es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripción 
                    </label>
                    <InputText id="description" value={genre.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !genre.description })} />
                    {submitted && !genre.description && <small className="p-error">Descripcion es requerida.</small>}
                </div>

            </Dialog>

            {DialogDelete(deleteGenreDialog, 'Producto', deleteGenreDialogFooter, hideDeleteGenreDialog, genre, genre.name, 'el Genero')}

            {confirmDialog(confirmDialogVisible, 'Genero', confirmGenreDialogFooter, hideConfirmGenreDialog, genre, operation)}
        </div>
    );
}