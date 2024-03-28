import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';

export default function Categories() {
    let emptyCategory = {
        idCategory: null,
        name: ''
    }

    const URL = 'http://localhost:8086/api/category/';
    const [categories, setCategories] = useState([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setCategories);
    }, []);

    const openNew = () => {
        setCategory(emptyCategory);
        setTitle('Registrar Categoria');
        setOperation(1);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const editCategory = (category) => {
        setCategory({ ...category });
        setTitle('Editar Categoria');
        setOperation(2);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const hideConfirmCategoryDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const saveCategory = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if (category.name.trim()) {
            let url, method, parameters;
            if (category.idCategory && operation === 2) {
                parameters = { idCategory: category.idCategory, name: category.name.trim() }
                url = URL + 'update/' + category.idCategory;
                method = 'PUT';
            } else {
                parameters = { name: category.name.trim() }
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setCategories, URL, operation, toast, 'Categoria ');
            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteCategory = (category) => {
        confirmDelete(category, setCategory, setDeleteCategoryDialog);
    };

    const deleteCategory = () => {
        deleteData(URL, category.idCategory, setCategories, toast, setDeleteCategoryDialog, setCategory, emptyCategory, 'Categoria');
    };

    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV();
        } else {
            console.error("La referencia 'dt' no está definida.");
        }
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, category, setCategory);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editCategory, confirmDeleteCategory);
    };

    const categoryDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmCategoryDialogFooter = (
        confirmDialogFooter(hideConfirmCategoryDialog, saveCategory)
    );
    const deleteCategoryDialogFooter = (
        deleteDialogFooter(hideDeleteCategoryDialog, deleteCategory)
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
                    data={categories}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} categorias"
                    globalFilter={globalFilter}
                    header={header('Categorias', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={categoryDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Nombre
                        </label>
                        <InputText id="name" value={category.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
                        {submitted && !category.name && <small className="p-error">Nombre de categoria es requerido.</small>}
                    </div>
                </Dialog>

                {DialogDelete(deleteCategoryDialog, 'Categoria', deleteCategoryDialogFooter, hideDeleteCategoryDialog, category, category.name, 'el producto')}

                {confirmDialog(confirmDialogVisible, 'Categoria', confirmCategoryDialogFooter, hideConfirmCategoryDialog, category, operation)}
            </div>
        </div>
    )
}