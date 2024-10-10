import React, { useEffect, useRef, useState } from 'react'
import Request_Service from '../service/Request_Service';
import { DialogDelete, confirmDialogFooter, DialogFooter, exportCSV, exportExcel, exportPdf, header, rightToolbarTemplateExport, deleteDialogFooter } from '../../functionsDataTable';
import AsociationDialog from '../AsociationDialog';
import CustomDataTable from '../CustomDataTable';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';

export default function AssociationAuthorGenre() {

    const emptyAssociation = {
        genreId: null,
        authorId: null
    }

    const emptyAssociationName = {
        genreName: null,
        authorName: null
    }

    // ROLES
    const isAdmin = UserService.isAdmin();

    const URL = '/genre/';
    const [listAssociation, setListAssociation] = useState(null);
    const [association, setAssociation] = useState(emptyAssociation);
    const [associationName, setAssociationName] = useState(emptyAssociationName);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [associationDialog, setAssociationDialog] = useState(false);
    const [deleteAssociationDialog, setDeleteAssociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('genreAuthorAssociations'), setListAssociation);
    }, []);

    const openAsociation = () => {
        setAssociation(emptyAssociation);
        setSelectedGenre('');
        setSelectedAuthor('');
        setTitle('Registrar Nueva Asociación');
        Request_Service.getData(URL.concat('all'), setGenres);
        Request_Service.getData('/author/all', setAuthors);
        setSubmitted(false);
        setAssociationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAssociationDialog(false);
    };

    const hideDeleteAssociationDialog = () => {
        setDeleteAssociationDialog(false);
    };

    const hideConfirmAssociationDialog = () => {
        setConfirmAscDialogVisible(false);
    };

    const saveAssociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (association.genreId && association.authorId) {
            let parameters = {
                genreId: association.genreId.idGenre,
                authorId: association.authorId.idAuthor,
            };

            await Request_Service.sendRequestAsociation(parameters, URL.concat('add-author'), toast);

            // Actualiza la lista de asociaciones después de guardar
            Request_Service.getData(URL.concat('genreAuthorAssociations'), setListAssociation);

            setAssociationDialog(false);
        }
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteAssociation = (rowData) => {
        // Establece la asociación con los valores de la fila seleccionada
        setAssociationName({
            genreName: rowData[0],
            authorName: rowData[1]
        });
        setDeleteAssociationDialog(true);
    };

    const deleteAssociation = () => {
        if (associationName.genreName && associationName.authorName) {
            Request_Service.deleteAsociation(associationName, setListAssociation, toast, setDeleteAssociationDialog, setAssociationName, emptyAssociationName, 'Asociación ', URL.concat('genreAuthorAssociations'), URL)
        }
    };

    const associationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );

    const confirmAssociationDialogFooter = (
        confirmDialogFooter(hideConfirmAssociationDialog, saveAssociation)
    );

    const deleteAssociationDialogFooter = (
        deleteDialogFooter(hideDeleteAssociationDialog, deleteAssociation)
    );

    const actionBodyTemplateP = (rowData) => {
        return <Button icon="pi pi-trash" className="rounded" severity="danger" onClick={() => confirmDeleteAssociation(rowData)} />
    };

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
        { field: '0', header: 'Género', sortable: true, style: { minWidth: '12rem' } },
        { field: '1', header: 'Autor', sortable: true, style: { minWidth: '12rem' } },
        (isAdmin && { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } })
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, listAssociation, 'Reporte_Asociaciones_Géneros_y_Autores') };
    const handleExportExcel = () => { exportExcel(listAssociation, columns, 'Asociaciones_Géneros_y_Autores') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de', maxWidth: '1200px' }}>
                <Toolbar className="mb-4 toolbar-datatable" left={<Button label={'Registrar Asociación'} icon="pi pi-arrows-h" className="rounded" onClick={openAsociation} style={{ background: '#0D9276', border: 'none', minWidth: '120px' }} />} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={listAssociation}
                    dataKey="author.idAuthor"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Asociaciones"
                    globalFilter={globalFilter}
                    header={header('Asociaciones entre Géneros y Autores', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <AsociationDialog
                asociation={association}
                setAsociation={setAssociation}
                visible={associationDialog}
                title={title}
                footer={associationDialogFooter}
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
                id={association.authorId}
                id2={association.genreId}
                selectedTwo={selectedGenre}
                setSelected2={setSelectedGenre}
                options={authors}
                options2={genres}
                valueTemplateTwo={selectedGenreTemplate}
                itemTemplateTwo={genreOptionTemplate}
                filter submitted={submitted}
                confirmDialogVisible={confirmAscDialogVisible}
                confirmAsociationDialogFooter={confirmAssociationDialogFooter}
                hideConfirmAsociationDialog={hideConfirmAssociationDialog}
            />

            {DialogDelete(deleteAssociationDialog, 'Asociación', deleteAssociationDialogFooter, hideDeleteAssociationDialog, association, `${associationName.genreName} y ${associationName.authorName}`, 'la asociación entre')}
        </div>
    )
}
