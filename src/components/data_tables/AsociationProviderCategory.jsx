import React, { useEffect, useRef, useState } from 'react'
import Request_Service from '../service/Request_Service';
import { confirmDialogFooter, DialogFooter, exportCSV, exportExcel, exportPdf, header, rightToolbarTemplateExport } from '../../functionsDataTable';
import AsociationDialog from '../AsociationDialog';
import CustomDataTable from '../CustomDataTable';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';

export default function AsociationProviderCategory() {

    const emptyAsociation = {
        categoryId: null,
        providerId: null
    }

    // ROLES
    const isAdmin = UserService.isAdmin();

    const URL = '/category/';
    const [listAsociation, setListAsociation] = useState(null);
    const [asociation, setAsociation] = useState(emptyAsociation);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [asociationDialog, setAsociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('categoryProviderAssociations'), setListAsociation);
    }, []);

    const openAsociation = () => {
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Nueva Asociación');
        Request_Service.getData(URL.concat('all'), setCategories);
        Request_Service.getData('/provider/all', setProviders);
        setSubmitted(false);
        setAsociationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAsociationDialog(false);
    };

    const hideConfirmAsociationDialog = () => {
        setConfirmAscDialogVisible(false);
    };

    const saveAsociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (asociation.categoryId && asociation.providerId) {
            let parameters = {
                categoryId: asociation.categoryId.idCategory, providerId: asociation.providerId.idProvider,
            };

            await Request_Service.sendRequestAsociation(parameters, URL.concat('add-provider'), toast);
            
            // Actualiza la lista de asociaciones después de guardar
            Request_Service.getData(URL.concat('categoryProviderAssociations'), setListAsociation);
            
            setAsociationDialog(false);
        }
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const asociationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
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

    const columns = [
        { field: '0', header: 'Categoria', sortable: true, style: { minWidth: '12rem' } },
        { field: '1', header: 'Proveedor', sortable: true, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, listAsociation, 'Reporte_Asociaciones_Categorías_y_Proveedores') };
    const handleExportExcel = () => { exportExcel(listAsociation, columns, 'Asociaciones_Categorías_y_Proveedores') };
    const handleExportCsv = () => { exportCSV(false, dt) };

  return (
    <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={<Button label={'Registrar Asociación'} icon="pi pi-arrows-h" className="rounded" onClick={openAsociation} style={{ background: '#0D9276', border: 'none' }} />} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={listAsociation}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Asociaciones"
                    globalFilter={globalFilter}
                    header={header('Asociaciones entre Categorías y Proveedores', setGlobalFilter)}
                    columns={columns}
                />

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
  )
}