import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, inputNumberChange, leftToolbarTemplateAsociation, rightToolbarTemplate, sendRequest, sendRequestAsc } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';
import AsociationDialog from '../components/AsociationDialog';

export default function Providers() {

    let emptyProvider = {
        idProvider: null,
        nit: '',
        name: '',
        phoneNumber: 0,
        email: ''
    }

    const emptyAsociation = {
        categoryId: null,
        providerId: null
    }

    const URLASC = 'http://localhost:8086/api/category/add-provider';
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);

    const URL = 'http://localhost:8086/api/provider/';
    const [providers, setProviders] = useState([]);
    const [providerDialog, setProviderDialog] = useState(false);
    const [deleteProviderDialog, setDeleteProviderDialog] = useState(false);
    const [provider, setProvider] = useState(emptyProvider);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
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

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
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

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplateAsociation(openNew, 'Categoria', openAsociation)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={providers}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} proveedores"
                    globalFilter={globalFilter}
                    header={header('Proveedores', setGlobalFilter)}
                    columns={columns}
                />
                <Dialog visible={providerDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={providerDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="nit" className="font-bold">
                                Nit
                            </label>
                            <InputText id="nit" value={provider.nit} onChange={(e) => onInputChange(e, 'nit')} required autoFocus className={classNames({ 'p-invalid': submitted && !provider.nit })} />
                            {submitted && !provider.nit && <small className="p-error">Nit es requerido.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name" className="font-bold">
                                Nombre
                            </label>
                            <InputText id="name" value={provider.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !provider.name })} />
                            {submitted && !provider.name && <small className="p-error">Nombre de proveedor es requerido.</small>}
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="phoneNumbers" className="font-bold block mb-2">Número de celular</label>
                            <InputNumber inputId="phoneNumbers" value={provider.phoneNumber} onValueChange={(e) => onInputNumberChange(e, 'phoneNumber')} useGrouping={false} required maxLength={10} className={classNames({ 'p-invalid': submitted && !provider.phoneNumber })} />
                            {submitted && !provider.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="email" className="font-bold">
                                Correo Eletrónico
                            </label>
                            <InputText id="email" value={provider.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !provider.email })} placeholder='mi_correo@micorreo.com' />
                            {submitted && !provider.email && <small className="p-error">Correo Eletrónico es requerido.</small>}
                        </div>
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
                    labelId='category'
                    nameTable='Categoria'
                    labelId2='provider'
                    nameTableTwo='Proveedor'
                    selectedOne={selectedCategory}
                    setSelectedOne={setSelectedCategory}
                    idOnInputNumberOne='categoryId'
                    idOnInputNumberTwo='providerId'
                    valueTemplate={selectedCategoryTemplate}
                    itemTemplate={categoryOptionTemplate}
                    id={asociation.categoryId}
                    id2={asociation.providerId}
                    selectedTwo={selectedProvider}
                    setSelected2={setSelectedProvider}
                    options={categories}
                    options2={providers}
                    valueTemplateTwo={selectedProviderTemplate}
                    itemTemplateTwo={providerOptionTemplate}
                    filter submitted={submitted}
                    confirmDialogVisible={confirmAscDialogVisible}
                    confirmAsociationDialogFooter={confirmAsociationDialogFooter}
                    hideConfirmAsociationDialog={hideConfirmAsociationDialog}
                />
            </div>
        </div>
    );
}