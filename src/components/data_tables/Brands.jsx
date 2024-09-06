import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import CustomDataTable from '../CustomDataTable';
import { FloatInputText } from '../Inputs';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Brands() {
    const emptyBrand = {
        idBrand: null,
        name: ''
    }

    const URL = '/brand/';
    const [brand, setBrand] = useState(emptyBrand);
    const [brands, setBrands] = useState([]);
    const [brandDialog, setBrandDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteBrandDialog, setDeleteBrandDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    // ROLES
    const isAdmin = UserService.isAdmin();

    const fetchBrands = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setBrands);
        } catch (error) {
            console.error("Fallo al recuperar las categorias:", error);
        }
    },  [onlyDisabled, URL]);

    useEffect(() => {
        fetchBrands();
    }, [onlyDisabled, fetchBrands]);

    const openNew = () => {
        setBrand(emptyBrand);
        setTitle('Registrar Marca');
        setOperation(1);
        setSubmitted(false);
        setBrandDialog(true);
    };

    const editBrand = (brand) => {
        setBrand({ ...brand });
        setTitle('Editar Marca');
        setOperation(2);
        setBrandDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBrandDialog(false);
    };

    const hideConfirmBrandDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteBrandDialog = () => {
        setDeleteBrandDialog(false);
    };

    const saveBrand = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid = brand.name.trim();

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (brand.idBrand && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idBrand: brand.idBrand,
                name: brand.name.trim()
            };
            url = URL + 'update/' + brand.idBrand;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                name: brand.name.trim()
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Marca ', URL.concat('all'), setBrands);
            setBrandDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteBrand = (brand) => {
        confirmDelete(brand, setBrand, setDeleteBrandDialog);
    };

    const deleteBrand = () => {
        Request_Service.deleteData(URL, brand.idBrand, setBrands, toast, setDeleteBrandDialog, setBrand, emptyBrand, 'Marca ', URL.concat('all'));
    };

    const handleEnable = (brand) => {
        Request_Service.sendRequestEnable(URL, brand.idBrand, setBrands, toast, 'Marca ');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, brand, setBrand);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editBrand, confirmDeleteBrand, onlyDisabled, handleEnable);
    };

    const brandDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmBrandDialogFooter = (
        confirmDialogFooter(hideConfirmBrandDialog, saveBrand)
    );

    const deleteBrandDialogFooter = (
        deleteDialogFooter(hideDeleteBrandDialog, deleteBrand)
    );

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, brands, 'Reporte_Marcas') };
    const handleExportExcel = () => { exportExcel(brands, columns, 'Marcas') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={brands}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Marcas"
                    globalFilter={globalFilter}
                    header={header('Marcas', setGlobalFilter)}
                    columns={columns}
                />

                <Dialog visible={brandDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={brandDialogFooter} onHide={hideDialog}>
                    <FloatInputText
                        className="field mt-4"
                        value={brand.name}
                        onInputChange={onInputChange} field='name'
                        maxLength={30} required autoFocus
                        submitted={submitted}
                        label='Nombre'
                        errorMessage='Nombre de marca es requerido.'
                    />
                </Dialog>

                {DialogDelete(deleteBrandDialog, 'Marca', deleteBrandDialogFooter, hideDeleteBrandDialog, brand, brand.name, 'la marca')}

                {confirmDialog(confirmDialogVisible, 'Marca', confirmBrandDialogFooter, hideConfirmBrandDialog, brand, operation)}
            </div>
        </div>
    );
};
