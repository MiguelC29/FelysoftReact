import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';


export default function Editorials() {
    let emptyEditorial = {
        idEditorial: null,
        name: '',
        description: ''
    };


    const URL = '/editorial/';
    const [editorial, setEditorial] = useState(emptyEditorial);
    const [editorials, setEditorials] = useState([]);
    const [editorialDialog, setEditorialDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteEditorialDialog, setDeleteEditorialDialog] = useState(false);
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

    const fetchEditorials = useCallback(async () => {
        try{
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setEditorials);
        }catch (error){
            console.error("Fallo al recuperar las Editoriales:",error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchEditorials();
    }, [onlyDisabled, fetchEditorials]);

    const openNew = () => {
        setEditorial(emptyEditorial);
        setTitle('Registrar Editorial');
        setOperation(1);
        setSubmitted(false);
        setEditorialDialog(true);
    };

    const editEditorial = (editorial) => {
        setEditorial({ ...editorial });
        setTitle('Editar Editorial');
        setOperation(2);
        setEditorialDialog(true);
    };
    const toggleDisabled = () =>{
        setOnlyDisabled(!onlyDisabled);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEditorialDialog(false);
    };

    const hideConfirmEditorialDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteEditorialDialog = () => {
        setDeleteEditorialDialog(false);
    };

    const saveEditorial = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
    
        // Verificar si los campos requeridos están presentes y válidos
        const isValid = editorial.name.trim() && editorial.description.trim(); // Use 'editorial.description'
    
        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }
    
        let url, method, parameters;
    
        if (editorial.idEditorial && operation === 2) { // Corrected 'idGenre' to 'idEditorial'
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idEditorial: editorial.idEditorial,
                name: editorial.name.trim(),
                description: editorial.description.trim()
            };
            url = URL + 'update/' + editorial.idEditorial;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                name: editorial.name.trim(),
                description: editorial.description.trim()
            };
            url = URL + 'create';
            method = 'POST';
        }
    
        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Editorial ', URL.concat('all'), setEditorials);
            setEditorialDialog(false);
        }
    };
    
    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteEditorial = (editorial) => {
        confirmDelete(editorial, setEditorial, setDeleteEditorialDialog);
    };

    const deleteEditorial = () => {
        Request_Service.deleteData(URL, editorial.idEditorial, setEditorials, toast, setDeleteEditorialDialog, setEditorial, emptyEditorial, 'Editorial ', URL.concat('all'));
    };

    const handleEnable =(editorial) => {
        Request_Service.sendRequestEnable(URL,editorial.idEditorial,setEditorials,toast,'Editorial ');
    }

    const onInputChange = (e, name) => {
        inputChange(e, name, editorial, setEditorial);
    };

    const actionBodyTemplateE = (rowData) => {
        return actionBodyTemplate(rowData, editEditorial, confirmDeleteEditorial, onlyDisabled,handleEnable);
    };

    const editorialDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmEditorialDialogFooter = (
        confirmDialogFooter(hideConfirmEditorialDialog, saveEditorial)
    );

    const deleteEditorialDialogFooter = (
        deleteDialogFooter(hideDeleteEditorialDialog, deleteEditorial)
    );

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateE, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, editorials, 'Reporte_Editoriales') };
    const handleExportExcel = () => { exportExcel(editorials, columns, 'Editoriales') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                {(isAdmin || isInventoryManager) &&
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew,onlyDisabled, toggleDisabled)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
                <CustomDataTable
                    dt={dt}
                    data={editorials}
                    dataKey="idEditorial"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Géneros"
                    globalFilter={globalFilter}
                    header={header('Editoriales', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={editorialDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={editorialDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <InputText id="name" value={editorial.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !editorial.name })} />
                            <label htmlFor="name" className="font-bold">Nombre</label>
                        </FloatLabel>
                    </div>
                    {submitted && !editorial.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" value={editorial.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !editorial.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !editorial.description && <small className="p-error">Descripción es requerida.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteEditorialDialog, 'Editorial', deleteEditorialDialogFooter, hideDeleteEditorialDialog, editorial, editorial.name, ' la Editorial')}

            {confirmDialog(confirmDialogVisible, 'Editorial', confirmEditorialDialogFooter, hideConfirmEditorialDialog, editorial, operation)}
        </div>
    );
};
