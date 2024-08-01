import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, leftToolbarTemplateAsociation, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import AsociationDialog from '../AsociationDialog';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Authors() {
    let emptyAuthor = {
        idAuthor: null,
        name: '',
        nationality: '',
        dateBirth: '',
        biography: ''
    };

    const emptyAsociation = {
        authorId: null,
        genreId: null
    }

    const URL = '/author/';
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [author, setAuthor] = useState(emptyAuthor);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authorDialog, setAuthorDialog] = useState(false);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [deleteAuthorDialog, setDeleteAuthorDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

      // ROLES
        const isAdmin = UserService.isAdmin();
        const isInventoryManager = UserService.isInventoryManager();

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setAuthors);
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
        Request_Service.getData('/genre/all', setGenres);
        Request_Service.getData(URL.concat('all'), setAuthors);
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

    const saveAuthor = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if (
            author.name.trim() &&
            author.nationality.trim() &&
            author.dateBirth &&
            author.biography.trim()) {
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
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Autor ', URL.concat('all'), setAuthors)
            setAuthorDialog(false);
            setAuthor(emptyAuthor);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const saveAsociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.genreId && asociation.authorId) {
            let parameters = {
                genreId: asociation.genreId.idGenre, authorId: asociation.authorId.idAuthor,
            };
            await Request_Service.sendRequestAsociation(parameters, '/genre/add-author', toast);
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
        Request_Service.deleteData(URL, author.idAuthor, setAuthors, toast, setDeleteAuthorDialog, setAuthor, emptyAuthor, 'Autor ', URL.concat('all'));
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
        { field: 'nationality', header: 'Nacionalidad', sortable: true, style: { minWidth: '16rem' } },
        { field: 'dateBirth', header: 'Fecha de Nacimiento', sortable: true, style: { minWidth: '10rem' } },
        { field: 'biography', header: 'Biografía', sortable: true, style: { minWidth: '16rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateA, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, authors, 'Reporte_Autores') };
    const handleExportExcel = () => { exportExcel(authors, columns, 'Autores') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                {  (isAdmin || isInventoryManager) &&
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplateAsociation(openNew, 'Género', openAsociation)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
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
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <InputText id="name" value={author.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !author.name })} />
                            <label htmlFor="name" className="font-bold">Nombre</label>
                        </FloatLabel>
                    </div>
                    {submitted && !author.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">pin_drop</span>
                        </span>
                        <FloatLabel>
                            <InputText id="natioality" value={author.nationality} onChange={(e) => onInputChange(e, 'nationality')} required className={classNames({ 'p-invalid': submitted && !author.nationality })} />
                            <label htmlFor="nationality" className="font-bold">Nacionalidad</label>
                        </FloatLabel>
                    </div>
                    {submitted && !author.nationality && <small className="p-error">Nacionalidad es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="dateBirth" className="font-bold">Fecha de Nacimiento</label>
                    <InputText id="dateBirth" value={author.dateBirth} onChange={(e) => onInputChange(e, 'dateBirth')} type="date" required className={classNames({ 'p-invalid': submitted && !authors.dateBirth })} />
                    {submitted && !author.dateBirth && <small className="p-error">Fecha de Nacimiento es requerida.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">person_book</span>
                        </span>
                        <FloatLabel>
                            <InputText id="biography" value={author.biography} onChange={(e) => onInputChange(e, 'biography')} required className={classNames({ 'p-invalid': submitted && !author.biography })} />
                            <label htmlFor="biography" className="font-bold">Biografía</label>
                        </FloatLabel>
                    </div>
                    {submitted && !author.biography && <small className="p-error">Biografía es requerida.</small>}
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
                nameTableTwo='Género'
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
};
