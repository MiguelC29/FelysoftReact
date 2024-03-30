import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange,leftToolbarTemplateAsociation, rightToolbarTemplate, sendRequest, sendRequestAsc } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';
import AsociationDialog from '../componets/AsociationDialog';

export default function Genres() {
    let emptyGenre = {
        idGenre: null,
        name: '',
        description: ''
    };

    const emptyAsociation = {
        genreId: null,
        authorId: null
    }

    const URLASC = 'http://localhost:8086/api/genre/add-author';
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);

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

    useEffect(() => {
        getData(URL, setGenres);
    }, []);

    const openNew = () => {
        setGenre(emptyGenre);
        setTitle('Registrar Genero');
        setOperation(1);
        setSubmitted(false);
        setGenreDialog(true);
    };

    const openAsociation = () => {
        setSelectedGenre('');
        setSelectedAuthor('');
        setTitle('Registrar Asociación');
        getData('http://localhost:8086/api/genre/', setGenres);
        getData('http://localhost:8086/api/author/', setAuthors);
        setSubmitted(false);
        setAsociationDialog(true);
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
        setAsociationDialog(false);
    };

    const hideConfirmGenreDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideConfirmAsociationDialog = () => {
        setConfirmAscDialogVisible(false); 
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

            sendRequest(method, parameters, url, setGenres, URL, operation, toast, 'Genero ');
            setGenreDialog(false);
            setGenre(emptyGenre);
        }
    };
    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const saveAsociation = () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.genreId && asociation.authorId) {
            let parameters = {
                genreId: asociation.genreId.idGenre, authorId: asociation.authorId.idAuthor,
            };

            sendRequestAsc('POST', parameters, URLASC, toast);
            setAsociationDialog(false);
            setAsociation(emptyAsociation);
            setSelectedGenre('');
            setSelectedAuthor('');
        }
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteGenre = (genre) => {
        confirmDelete(genre, setGenre, setDeleteGenreDialog);
    };

    const deleteGenre = () => {
        deleteData(URL, genre.idGenre, setGenres, toast, setDeleteGenreDialog, setGenre, emptyGenre, 'Genero ');
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

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );
    const confirmAsociationDialogFooter = (
        confirmDialogFooter(hideConfirmAsociationDialog, saveAsociation)
    );

    const genreDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmGenreDialogFooter = (
        confirmDialogFooter(hideConfirmGenreDialog, saveGenre)
    );
    const deleteGenreDialogFooter = (
        deleteDialogFooter(hideDeleteGenreDialog, deleteGenre)
    );

    const selectedAuthorTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const authorOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedGenreTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const genreOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { body: actionBodyTemplateG, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplateAsociation(openNew, 'Autor', openAsociation)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

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

             <AsociationDialog
                    asociation={asociation}
                    setAsociation={setAsociation}
                    visible={asociationDialog}
                    title={title}
                    footer={asociationDialogFooter}
                    onHide={hideDialog}
                    labelId='author'
                    nameTable='Autor'
                    labelId2='genre'
                    nameTableTwo='Genero'
                    selectedOne={selectedAuthor}
                    setSelectedOne={setSelectedAuthor}
                    idOnInputNumberOne='authorId'
                    idOnInputNumberTwo='genreId'
                    valueTemplate={selectedAuthorTemplate}
                    itemTemplate={authorOptionTemplate}
                    id={asociation.authorId}
                    id2={asociation.genreId}
                    selectedTwo={selectedGenre}
                    setSelected2={setSelectedGenre}
                    options={authors}
                    options2={genres}
                    valueTemplateTwo={selectedGenreTemplate}
                    itemTemplateTwo={genreOptionTemplate}
                    filter submitted={submitted}
                    confirmDialogVisible={confirmAscDialogVisible}
                    confirmAsociationDialogFooter={confirmAsociationDialogFooter}
                    hideConfirmAsociationDialog={hideConfirmAsociationDialog}
                />
        </div>
    );
}