import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, leftToolbarTemplateAsociation, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import CustomDataTable from '../CustomDataTable';
import AsociationDialog from '../AsociationDialog';
import { FloatInputText } from '../Inputs';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Categories() {
    const emptyCategory = {
        idCategory: null,
        name: ''
    }

    const emptyAsociation = {
        categoryId: null,
        providerId: null
    }

    const URL = '/category/';
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // ROLES
    const isAdmin = UserService.isAdmin();

    const fetchCategories = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setCategories);
        } catch (error) {
            console.error("Fallo al recuperar las categorias:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchCategories();
    }, [onlyDisabled, fetchCategories]);

    const openNew = () => {
        setCategory(emptyCategory);
        setTitle('Registrar Categoría');
        setOperation(1);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const openAsociation = () => {
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Asociación');
        Request_Service.getData(URL.concat('all'), setCategories);
        Request_Service.getData('/provider/all', setProviders);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const editCategory = (category) => {
        setCategory({ ...category });
        setTitle('Editar Categoría');
        setOperation(2);
        setCategoryDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
        setAsociationDialog(false);
    };

    const hideConfirmCategoryDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideConfirmAsociationDialog = () => {
        setConfirmAscDialogVisible(false); //
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const saveAsociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.categoryId && asociation.providerId) {
            let parameters = {
                categoryId: asociation.categoryId.idCategory, providerId: asociation.providerId.idProvider,
            };
            await Request_Service.sendRequestAsociation(parameters, URL.concat('add-provider'), toast);
            setAsociationDialog(false);
        }
    };

    const saveCategory = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid = category.name.trim();

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (category.idCategory && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idCategory: category.idCategory,
                name: category.name.trim()
            };
            url = URL + 'update/' + category.idCategory;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                name: category.name.trim()
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Categoría ', URL.concat('all'), setCategories);
            setCategoryDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteCategory = (category) => {
        confirmDelete(category, setCategory, setDeleteCategoryDialog);
    };

    const deleteCategory = () => {
        Request_Service.deleteData(URL, category.idCategory, setCategories, toast, setDeleteCategoryDialog, setCategory, emptyCategory, 'Categoría ', URL.concat('all'));
    };

    const handleEnable = (category) => {
        Request_Service.sendRequestEnable(URL, category.idCategory, setCategories, toast, 'Categoría ');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, category, setCategory);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editCategory, confirmDeleteCategory, onlyDisabled, handleEnable);
    };

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );

    const confirmAsociationDialogFooter = (
        confirmDialogFooter(hideConfirmAsociationDialog, saveAsociation)
    );

    const categoryDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmCategoryDialogFooter = (
        confirmDialogFooter(hideConfirmCategoryDialog, saveCategory)
    );

    const deleteCategoryDialogFooter = (
        deleteDialogFooter(hideDeleteCategoryDialog, deleteCategory)
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
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, categories, 'Reporte_Categorías') };
    const handleExportExcel = () => { exportExcel(categories, columns, 'Categorías') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplateAsociation(openNew, onlyDisabled, toggleDisabled, 'Proveedor', openAsociation)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={categories}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Categorías"
                    globalFilter={globalFilter}
                    header={header('Categorías', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={categoryDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                    <FloatInputText
                        className="field mt-4"
                        value={category.name}
                        onInputChange={onInputChange} field='name'
                        maxLength={30} required autoFocus
                        submitted={submitted}
                        label='Nombre'
                        errorMessage='Nombre de categoría es requerido.'
                    />
                </Dialog>

                {DialogDelete(deleteCategoryDialog, 'Categoría', deleteCategoryDialogFooter, hideDeleteCategoryDialog, category, category.name, 'la categoría')}

                {confirmDialog(confirmDialogVisible, 'Categoría', confirmCategoryDialogFooter, hideConfirmCategoryDialog, category, operation)}

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
};
