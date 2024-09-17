import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, inputNumberChange, leftToolbarTemplateAsociation, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import CustomDataTable from '../CustomDataTable';
import AsociationDialog from '../AsociationDialog';
import { FloatInputNumberIcon, FloatInputTextIcon } from '../Inputs';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

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

    const URL = '/provider/';
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
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [nitValid, setNitValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // ROLES
    const isAdmin = UserService.isAdmin();

    const fetchProviders = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setProviders);
        } catch (error) {
            console.error("Fallo al recuperar los proveedores:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchProviders();
    }, [onlyDisabled, fetchProviders]);

    const openNew = () => {
        setProvider(emptyProvider);
        setTitle('Registrar Proveedor');
        setOperation(1);
        setSubmitted(false);
        setProviderDialog(true);
    };

    const openAsociation = () => {
        setAsociation(emptyAsociation);
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Asociación');
        Request_Service.getData('/category/all', setCategories);
        Request_Service.getData(URL.concat('all'), setProviders);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const editProvider = (provider) => {
        setProvider({ ...provider });
        setTitle('Editar Proveedor');
        setOperation(2);
        setProviderDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
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

    const saveProvider = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si los campos requeridos están presentes y válidos
        const isValid = provider.nit.trim() &&
            provider.name.trim() &&
            provider.phoneNumber &&
            provider.email.trim();

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if (!validateNit(provider.nit) || !validatePhone(provider.phoneNumber) || !validateEmail(provider.email)) {
            return;
        }

        let url, method, parameters;

        if (provider.idProvider && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idProvider: provider.idProvider,
                nit: provider.nit.trim(),
                name: provider.name.trim(),
                phoneNumber: provider.phoneNumber,
                email: provider.email.trim()
            };
            url = URL + 'update/' + provider.idProvider;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                nit: provider.nit.trim(),
                name: provider.name.trim(),
                phoneNumber: provider.phoneNumber,
                email: provider.email.trim()
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Proveedor ', URL.concat('all'), setProviders);
            setProviderDialog(false);
        }
    };

    const saveAsociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.categoryId && asociation.providerId) {
            let parameters = {
                categoryId: asociation.categoryId.idCategory, providerId: asociation.providerId.idProvider,
            };
            await Request_Service.sendRequestAsociation(parameters, '/category/add-provider', toast);
            setAsociationDialog(false);
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
        Request_Service.deleteData(URL, provider.idProvider, setProviders, toast, setDeleteProviderDialog, setProvider, emptyProvider, 'Proveedor ', URL.concat('all'));
    };

    const handleEnable = (provider) => {
        Request_Service.sendRequestEnable(URL, provider.idProvider, setProviders, toast, 'Proveedor ');
    };


    const onInputChange = (e, name) => {
        inputChange(e, name, provider, setProvider);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, provider, setProvider);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editProvider, confirmDeleteProvider, onlyDisabled, handleEnable);
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

    const handleNITChange = (e) => {
        let nit = e.target.value.replace(/[^0-9]/g, '');  // Solo permite números
        if (nit.length > 8) {
            // Inserta el guion antes del último dígito si el NIT tiene más de 8 dígitos
            nit = nit.slice(0, nit.length - 1) + '-' + nit.slice(nit.length - 1);
        }
        // Limitar la longitud total a 12 caracteres (10 dígitos + 1 guion + 1 dígito final)
        if (nit.length > 12) {
            nit = nit.slice(0, 12);
        }

        setNitValid(validateNit(e.target.value));

        onInputChange({ target: { value: nit } }, 'nit');  // Actualiza el NIT en el estado
    };

    const validateNit = (nit) => {
        // Convierte el valor a cadena para evitar errores de longitud
        const nitStr = nit ? nit.toString() : '';
        return nitStr.length >= 9 && nitStr.length <= 12;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phoneNumber) => {
        const phoneNumberStr = phoneNumber ? phoneNumber.toString() : '';
        return phoneNumberStr.length === 10;
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
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplateAsociation(openNew, onlyDisabled, toggleDisabled, 'Categoría', openAsociation)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={providers}
                    dataKey="idProvider"
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
                            handle={handleNITChange}
                            maxLength={12} required autoFocus
                            submitted={submitted}
                            label='NIT'
                            errorMessage='NIT es requerido.'
                            valid={nitValid}
                            validMessage='El nit debe tener de 9 a 12 dígitos.'
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
                            onChange={(e) => setPhoneValid(validatePhone(e.value))}
                            useGrouping={false}
                            maxLength={10} required
                            submitted={submitted}
                            label='Número de celular'
                            errorMessage='Número de celular es requerido.'
                            small={provider.phoneNumber && !phoneValid}
                            smallMessage='El número de celular debe tener 10 dígitos.'
                        />
                        <FloatInputTextIcon
                            className="field col"
                            icon='mail'
                            value={provider.email}
                            onInputChange={onInputChange} field='email'
                            handle={(e) => setEmailValid(validateEmail(e.target.value))}
                            maxLength={50} required placeholder='mi_correo@micorreo.com'
                            submitted={submitted}
                            label='Correo Eletrónico'
                            errorMessage='Correo Eletrónico es requerido.'
                            valid={emailValid}
                            validMessage='Correo Eletrónico no es válido.'
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
                    nameTableTwo='Categoria'
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
