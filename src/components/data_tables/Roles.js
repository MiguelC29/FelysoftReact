import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, getData, header, inputChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import CustomDataTable from '../CustomDataTable';
import { FloatInputText } from '../Inputs';

export default function Roles() {
    let emptyRole = {
        idRole: null,
        name: ''
    }

    const URL = 'https://felysoftspring-production.up.railway.app/api/role/';
    const [role, setRole] = useState(emptyRole);
    const [roles, setRoles] = useState([]);
    const [roleDialog, setRoleDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setRoles);
    }, []);

    const openNew = () => {
        setRole(emptyRole);
        setTitle('Registrar Rol');
        setOperation(1);
        setSubmitted(false);
        setRoleDialog(true);
    };

    const editRole = (role) => {
        setRole({ ...role });
        setTitle('Editar Rol');
        setOperation(2);
        setRoleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRoleDialog(false);
    };

    const hideConfirmRoleDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteRoleDialog = () => {
        setDeleteRoleDialog(false);
    };

    const saveRole = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if (role.name.trim()) {
            let url, method, parameters;
            if (role.idRole && operation === 2) {
                parameters = { idRole: role.idRole, name: role.name.trim() }
                url = URL + 'update/' + role.idRole;
                method = 'PUT';
            } else {
                parameters = { name: role.name.trim() }
                url = URL + 'create';
                method = 'POST';
            }
            sendRequest(method, parameters, url, setRoles, URL, operation, toast, 'Rol ');
            setRoleDialog(false);
            setRole(emptyRole);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteRole = (role) => {
        confirmDelete(role, setRole, setDeleteRoleDialog);
    };

    const deleteRole = () => {
        deleteData(URL, role.idRole, setRoles, toast, setDeleteRoleDialog, setRole, emptyRole, 'Rol');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, role, setRole);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editRole, confirmDeleteRole);
    };

    const roleDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmRoleDialogFooter = (
        confirmDialogFooter(hideConfirmRoleDialog, saveRole)
    );

    const deleteRoleDialogFooter = (
        deleteDialogFooter(hideDeleteRoleDialog, deleteRole)
    );

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, roles, 'Reporte_Roles') };
    const handleExportExcel = () => { exportExcel(roles, columns, 'Roles') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={roles}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Roles"
                    globalFilter={globalFilter}
                    header={header('Roles', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={roleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={roleDialogFooter} onHide={hideDialog}>
                    <FloatInputText
                        className="field mt-4"
                        value={role.name}
                        onInputChange={onInputChange} field='name'
                        maxLength={30} required autoFocus
                        submitted={submitted}
                        label='Nombre'
                        errorMessage='Nombre del rol es requerido.'
                    />
                </Dialog>

                {DialogDelete(deleteRoleDialog, 'Rol', deleteRoleDialogFooter, hideDeleteRoleDialog, role, role.name, 'el rol')}

                {confirmDialog(confirmDialogVisible, 'Rol', confirmRoleDialogFooter, hideConfirmRoleDialog, role, operation)}
            </div>
        </div>
    );
};