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

    const URL = '/genre/';
    const [genre, setGenre] = useState(emptyGenre);
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [genreDialog, setGenreDialog] = useState(false);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [deleteGenreDialog, setDeleteGenreDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // ROLES
    const isAdmin = UserService.isAdmin();
    const isInventoryManager = UserService.isInventoryManager();

    useEffect(() => {
        fetchGeres();
    }, [onlyDisabled]);

    const fetchGeres = async () =>{
        try{
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setGenres);
        }catch (error){
            console.error("Fallo al recuperar los géneros:",error);
        }
    };

    const openNew = () => {
        setGenre(emptyGenre);
        setTitle('Registrar Género');
        setOperation(1);
        setSubmitted(false);
        setGenreDialog(true);
    };

    const openAsociation = () => {
        setAsociation(emptyAsociation);
        setSelectedGenre('');
        setSelectedAuthor('');
        setTitle('Registrar Asociación');
        Request_Service.getData(URL.concat('all'), setGenres);
        Request_Service.getData('/author/all', setAuthors);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const editGenre = (genre) => {
        setGenre({ ...genre });
        setTitle('Editar Género');
        setOperation(2);
        setGenreDialog(true);
    };
    const toggleDisabled = () =>{
        setOnlyDisabled(!onlyDisabled);
    }

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

    const saveGenre = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid = genre.name.trim() && genre.description.trim();

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (genre.idGenre && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idGenre: genre.idGenre,
                name: genre.name.trim(),
                description: genre.description.trim()
            };
            url = URL + 'update/' + genre.idGenre;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                name: genre.name.trim(),
                description: genre.description.trim()
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Género ', URL.concat('all'), setGenres);
            setGenreDialog(false);
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
            await Request_Service.sendRequestAsociation(parameters, URL.concat('add-author'), toast);
            setAsociationDialog(false);
        }
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteGenre = (genre) => {
        confirmDelete(genre, setGenre, setDeleteGenreDialog);
    };

    const deleteGenre = () => {
        Request_Service.deleteData(URL, genre.idGenre, setGenres, toast, setDeleteGenreDialog, setGenre, emptyGenre, 'Género ', URL.concat('all'));
    };

    const handleEnable =(genre) => {
        Request_Service.sendRequestEnable(URL,genre.idGenre,setGenres,toast,'Genero ');
    }

    const onInputChange = (e, name) => {
        inputChange(e, name, genre, setGenre);
    };

    const actionBodyTemplateG = (rowData) => {
        return actionBodyTemplate(rowData, editGenre, confirmDeleteGenre, onlyDisabled,handleEnable);
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
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateG, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, genres, 'Reporte_Géneros') };
    const handleExportExcel = () => { exportExcel(genres, columns, 'Géneros') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                {(isAdmin || isInventoryManager) &&
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplateAsociation(openNew,onlyDisabled, toggleDisabled,'Autor', openAsociation)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
                <CustomDataTable
                    dt={dt}
                    data={genres}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Géneros"
                    globalFilter={globalFilter}
                    header={header('Géneros', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={genreDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={genreDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <InputText id="name" value={genre.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !genre.name })} />
                            <label htmlFor="name" className="font-bold">Nombre</label>
                        </FloatLabel>
                    </div>
                    {submitted && !genre.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" value={genre.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !genre.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !genre.description && <small className="p-error">Descripción es requerida.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteGenreDialog, 'Género', deleteGenreDialogFooter, hideDeleteGenreDialog, genre, genre.name, 'el Género')}

            {confirmDialog(confirmDialogVisible, 'Género', confirmGenreDialogFooter, hideConfirmGenreDialog, genre, operation)}

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
