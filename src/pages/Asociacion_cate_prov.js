import React, { useRef, useState } from 'react'
import { DialogFooter, confirmDialogAsc, confirmDialogFooter, getData, inputNumberChange, sendRequestAsc } from '../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

export default function Asociacion_cate_prov() {

    const emptyAsociation = {
        categoryId: null,
        providerId: null
    }

    const URL = 'http://localhost:8086/api/category/add-provider';

    const [asociation, setAsociation] = useState(emptyAsociation);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [title, setTitle] = useState('');
    const toast = useRef(null);

    const openAsociation = () => {
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Asociación');
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAsociationDialog(false);
    };

    const hideConfirmAsociationDialog = () => {
        setConfirmDialogVisible(false); //
    };

    const saveAsociation = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
        if(asociation.categoryId && asociation.providerId) {
            let parameters = {
                categoryId: asociation.categoryId.idCategory, providerId: asociation.providerId.idProvider,
            };

            sendRequestAsc('POST', parameters, URL, toast);
            setAsociationDialog(false);
            setAsociation(emptyAsociation);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, asociation, setAsociation);
    };

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmAsociationDialogFooter = (
        confirmDialogFooter(hideConfirmAsociationDialog, saveAsociation)
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

    return (
        <div>
            <Toast ref={toast} />

            <Dialog visible={asociationDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={asociationDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="categoryId" className="font-bold">
                            Categoria
                        </label>
                        <Dropdown id="categoryId" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.value); onInputNumberChange(e, 'categoryId'); }} options={categories} optionLabel="name" placeholder="Seleccionar categoria"
                            filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !asociation.categoryId && !selectedCategory })}`} />

                        {submitted && !asociation.categoryId && !selectedCategory && <small className="p-error">Categoria es requerida.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="providerId" className="font-bold">
                            Proveedor
                        </label>
                        <Dropdown id="providerId" value={selectedProvider} onChange={(e) => { setSelectedProvider(e.value); onInputNumberChange(e, 'providerId'); }} options={providers} optionLabel="name" placeholder="Seleccionar proveedor"
                            filter valueTemplate={selectedProviderTemplate} itemTemplate={providerOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !asociation.providerId && !selectedProvider })}`} />
                        {submitted && !asociation.providerId && !selectedProvider && <small className="p-error">Proveedor es requerido.</small>}
                    </div>
                </div>
            </Dialog>

            {confirmDialogAsc(confirmDialogVisible, 'Categoria y Proveedor', confirmAsociationDialogFooter, hideConfirmAsociationDialog, asociation)}
        </div>
    )
}