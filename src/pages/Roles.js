import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';

export default function Roles() {
    let emptyRole = {
        idRole: null,
        name: ''
    }

    const URL = 'http://localhost:8086/api/role/';
    const [roles, setRoles] = useState([]);
    const [roleDialog, setRoleDialog] = useState(false);
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
    const [role, setRole] = useState(emptyRole);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
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
        deleteData(URL, role.idRole, setRoles, toast, setDeleteRoleDialog, setRole, emptyRole, 'Role');
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
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

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={roles}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} roles"
                    globalFilter={globalFilter}
                    header={header('Roles', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={roleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={roleDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Nombre
                        </label>
                        <InputText id="name" value={role.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !role.name })} maxLength={30}/>
                        {submitted && !role.name && <small className="p-error">Nombre del rol es requerido.</small>}
                    </div>
                </Dialog>

                {DialogDelete(deleteRoleDialog, 'Rol', deleteRoleDialogFooter, hideDeleteRoleDialog, role, role.name, 'el rol')}

                {confirmDialog(confirmDialogVisible, 'Rol', confirmRoleDialogFooter, hideConfirmRoleDialog, role, operation)}
            </div>
        </div>
    )
}