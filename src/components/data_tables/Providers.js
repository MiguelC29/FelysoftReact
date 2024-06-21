import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, getData, header, inputChange, inputNumberChange, leftToolbarTemplateAsociation, rightToolbarTemplateExport, sendRequest, sendRequestAsc } from '../../functionsDataTable'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import CustomDataTable from '../CustomDataTable';
import AsociationDialog from '../AsociationDialog';
import { FloatInputNumberIcon, FloatInputTextIcon } from '../Inputs';

export default function Providers() {
    let emptyProvider = {
        idProvider: null,
        nit: '',
        name: '',
        phoneNumber: null,
        email: ''
    }

    const emptyAsociation = {
        categoryId: null,
        providerId: null
    }

    const URL = 'http://localhost:8086/api/provider/';
    const URLASC = 'http://localhost:8086/api/category/add-provider';
    const [provider, setProvider] = useState(emptyProvider);
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [providerDialog, setProviderDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [deleteProviderDialog, setDeleteProviderDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setProviders);
    }, []);

    const openNew = () => {
        setProvider(emptyProvider);
        setTitle('Registrar Proveedor');
        setOperation(1);
        setSubmitted(false);
        setProviderDialog(true);
    };

    const openAsociation = () => {
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Asociación');
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const editProvider = (provider) => {
        setProvider({ ...provider });
        setTitle('Editar Proveedor');
        setOperation(2);
        setProviderDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProviderDialog(false);
        setAsociationDialog(false);
    };

    const hideConfirmProviderDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideConfirmAsociationDialog = () => {
        setConfirmAscDialogVisible(false); //
    };

    const hideDeleteProviderDialog = () => {
        setDeleteProviderDialog(false);
    };

    const saveProvider = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if (
            provider.nit.trim() &&
            provider.name.trim() &&
            provider.phoneNumber &&
            provider.email.trim()) {
            let url, method, parameters;
            if (provider.idProvider && operation === 2) {
                parameters = {
                    idProvider: provider.idProvider,
                    nit: provider.nit.trim(),
                    name: provider.name.trim(),
                    phoneNumber: provider.phoneNumber,
                    email: provider.email.trim()
                }
                url = URL + 'update/' + provider.idProvider;
                method = 'PUT';
            } else {
                parameters = {
                    nit: provider.nit.trim(),
                    name: provider.name.trim(),
                    phoneNumber: provider.phoneNumber,
                    email: provider.email.trim()
                }
                url = URL + 'create';
                method = 'POST';
            }
            sendRequest(method, parameters, url, setProviders, URL, operation, toast, 'Proveedor ');
            setProviderDialog(false);
            setProvider(emptyProvider);
        }
    };

    const saveAsociation = () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.categoryId && asociation.providerId) {
            let parameters = {
                categoryId: asociation.categoryId.idCategory, providerId: asociation.providerId.idProvider,
            };
            sendRequestAsc('POST', parameters, URLASC, toast);
            setAsociationDialog(false);
            setAsociation(emptyAsociation);
            setSelectedCategory('');
            setSelectedProvider('');
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteProvider = (provider) => {
        confirmDelete(provider, setProvider, setDeleteProviderDialog);
    };

    const deleteProvider = () => {
        deleteData(URL, provider.idProvider, setProviders, toast, setDeleteProviderDialog, setProvider, emptyProvider, 'Proveedor');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, provider, setProvider);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, provider, setProvider);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editProvider, confirmDeleteProvider);
    };

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );

    const confirmAsociationDialogFooter = (
        confirmDialogFooter(hideConfirmAsociationDialog, saveAsociation)
    );

    const providerDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmProviderDialogFooter = (
        confirmDialogFooter(hideConfirmProviderDialog, saveProvider)
    );

    const deleteProviderDialogFooter = (
        deleteDialogFooter(hideDeleteProviderDialog, deleteProvider)
    );

    const selectedCategoryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const categoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedProviderTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const providerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'nit', header: 'Nit', sortable: true, style: { minWidth: '12rem' } },
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'phoneNumber', header: 'Número de Télefono', sortable: true, style: { minWidth: '10rem' } },
        { field: 'email', header: 'Correo Eletrónico', sortable: true, style: { minWidth: '10rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, providers, 'Reporte_Proveedores') };
    const handleExportExcel = () => { exportExcel(providers, columns, 'Proveedores') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplateAsociation(openNew, 'Categoría', openAsociation)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={providers}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Proveedores"
                    globalFilter={globalFilter}
                    header={header('Proveedores', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={providerDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={providerDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid mt-4">
                        <FloatInputTextIcon
                            className="field col"
                            icon='badge'
                            value={provider.nit}
                            onInputChange={onInputChange} field='nit'
                            maxLength={11} required autoFocus
                            submitted={submitted}
                            label='NIT'
                            errorMessage='NIT es requerido.'
                        />
                        <FloatInputTextIcon
                            className="field col"
                            icon='id_card'
                            value={provider.name}
                            onInputChange={onInputChange} field='name'
                            maxLength={50} required
                            submitted={submitted}
                            label='Nombre'
                            errorMessage='Nombre de proveedor es requerido.'
                        />
                    </div>
                    <div className="formgrid grid mt-4">
                        <FloatInputNumberIcon
                            className="field col"
                            icon='call'
                            value={provider.phoneNumber}
                            onInputNumberChange={onInputNumberChange} field='phoneNumber'
                            useGrouping={false}
                            maxLength={10} required
                            submitted={submitted}
                            label='Número de celular'
                            errorMessage='Número de celular es requerido.'
                        />
                        <FloatInputTextIcon
                            className="field col"
                            icon='mail'
                            value={provider.email}
                            onInputChange={onInputChange} field='email'
                            maxLength={50} required placeholder='mi_correo@micorreo.com'
                            submitted={submitted}
                            label='Correo Eletrónico'
                            errorMessage='Correo Eletrónico es requerido.'
                        />
                    </div>
                </Dialog>

                {DialogDelete(deleteProviderDialog, 'Proveedor', deleteProviderDialogFooter, hideDeleteProviderDialog, provider, provider.name, 'el proveedor')}

                {confirmDialog(confirmDialogVisible, 'Proveedor', confirmProviderDialogFooter, hideConfirmProviderDialog, provider, operation)}

                <AsociationDialog
                    asociation={asociation}
                    setAsociation={setAsociation}
                    visible={asociationDialog}
                    title={title}
                    footer={asociationDialogFooter}
                    onHide={hideDialog}
                    nameTable='Proveedor'
                    nameTableTwo='Categoría'
                    labelId='provider'
                    labelId2='category'
                    selectedOne={selectedProvider}
                    selectedTwo={selectedCategory}
                    setSelectedOne={setSelectedProvider}
                    setSelected2={setSelectedCategory}
                    idOnInputNumberOne='providerId'
                    idOnInputNumberTwo='categoryId'
                    valueTemplate={selectedProviderTemplate}
                    valueTemplateTwo={selectedCategoryTemplate}
                    itemTemplate={providerOptionTemplate}
                    itemTemplateTwo={categoryOptionTemplate}
                    id={asociation.providerId}
                    id2={asociation.categoryId}
                    options={providers}
                    options2={categories}
                    filter submitted={submitted}
                    confirmDialogVisible={confirmAscDialogVisible}
                    confirmAsociationDialogFooter={confirmAsociationDialogFooter}
                    hideConfirmAsociationDialog={hideConfirmAsociationDialog}
                />
            </div>
        </div>
    );
};