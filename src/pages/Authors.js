import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, leftToolbarTemplateAsociation, rightToolbarTemplate, sendRequest, sendRequestAsc } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';
import { InputMask } from 'primereact/inputmask';
import AsociationDialog from '../componets/AsociationDialog';

export default function Authors() {
    let emptyAuthor = {
        idAuthor: null,
        name: '',
        nationality: '',
        dateBirth: '',
        biography:''
    };

    const emptyAsociation = {
        authorId: null,
        genreId: null
    }

    const URLASC = 'http://localhost:8086/api/genre/add-author';
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genres, setGenres] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);

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

    useEffect(() => {
        getData(URL, setAuthors);
    }, []);


    const openNew = () => {
        setAuthor(emptyAuthor);
        setTitle('Registrar Autor');
        setOperation(1);
        setSubmitted(false);
        setAuthorDialog(true);
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


    const editAuthor = (author) => {
        setAuthor({ ...author });
        setTitle('Editar Autor');
        setOperation(2);
        setAuthorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAuthorDialog(false);
        setAsociationDialog(false);
    };

  const hideConfirmAsociationDialog = () => {
        setConfirmAscDialogVisible(false); 
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

            sendRequest(method, parameters, url, setAuthors, URL, operation, toast, 'Autor ');
            setAuthorDialog(false);
            setAuthor(emptyAuthor);
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

    const confirmDeleteAuthor = (author) => {
        confirmDelete(author, setAuthor, setDeleteAuthorDialog);
    };

    const deleteAuthor = () => {
        deleteData(URL, author.idAuthor, setAuthors, toast, setDeleteAuthorDialog, setAuthor, emptyAuthor,'Autor ');
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

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );
    const confirmAsociationDialogFooter = (
        confirmDialogFooter(hideConfirmAsociationDialog, saveAsociation)
    );


    const authorDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmAuthorDialogFooter = (
        confirmDialogFooter(hideConfirmAuthorDialog, saveAuthor)
    );
    const deleteAuthorDialogFooter = (
        deleteDialogFooter(hideDeleteAuthorDialog, deleteAuthor)
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
        { field: 'nationality', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { field: 'dateBirth', header: 'Fecha de Nacimiento', sortable: true, style: { minWidth: '10rem' } },
        { field: 'biography', header: 'Biografia', sortable: true, style: { minWidth: '16rem' } },
        { body: actionBodyTemplateA, exportable: false, style: { minWidth: '12rem' } },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplateAsociation(openNew, 'Genero', openAsociation)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

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
                    <InputMask id="dateBirth" value={author.dateBirth} onChange={(e) => onInputChange(e, 'dateBirth')}  type="date" required className={classNames({ 'p-invalid': submitted && !author.dateBirth })} />
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