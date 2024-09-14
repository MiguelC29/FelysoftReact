import React, { useEffect, useRef, useState } from 'react'
import Request_Service from '../service/Request_Service';
import { DialogDelete, confirmDialogFooter, DialogFooter, exportCSV, exportExcel, exportPdf, header, rightToolbarTemplateExport, deleteDialogFooter } from '../../functionsDataTable';
import AsociationDialog from '../AsociationDialog';
import CustomDataTable from '../CustomDataTable';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';

export default function AssociationProviderCategory() {

    const emptyAssociation = {
        categoryId: null,
        providerId: null
    }

    const emptyAssociationName = {
        categoryName: null,
        providerName: null
    }

    // ROLES
    const isAdmin = UserService.isAdmin();

    const URL = '/category/';
    const [listAssociation, setListAssociation] = useState(null);
    const [association, setAssociation] = useState(emptyAssociation);
    const [associationName, setAssociationName] = useState(emptyAssociationName);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [associationDialog, setAssociationDialog] = useState(false);
    const [deleteAssociationDialog, setDeleteAssociationDialog] = useState(false);
    const [confirmAscDialogVisible, setConfirmAscDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('categoryProviderAssociations'), setListAssociation);
    }, []);

    const openAsociation = () => {
        setAssociation(emptyAssociation);
        setSelectedCategory('');
        setSelectedProvider('');
        setTitle('Registrar Nueva Asociación');
        Request_Service.getData(URL.concat('all'), setCategories);
        Request_Service.getData('/provider/all', setProviders);
        setSubmitted(false);
        setAssociationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAssociationDialog(false);
    };

    const hideDeleteAssociationDialog = () => {
        setDeleteAssociationDialog(false);
    };

    const hideConfirmAssociationDialog = () => {
        setConfirmAscDialogVisible(false);
    };

    const saveAssociation = async () => {
        setSubmitted(true);
        setConfirmAscDialogVisible(false);
        if (association.categoryId && association.providerId) {
            let parameters = {
                categoryId: association.categoryId.idCategory,
                providerId: association.providerId.idProvider,
            };

            await Request_Service.sendRequestAsociation(parameters, URL.concat('add-provider'), toast);

            // Actualiza la lista de asociaciones después de guardar
            Request_Service.getData(URL.concat('categoryProviderAssociations'), setListAssociation);

            setAssociationDialog(false);
        }
    };

    const confirmAsc = () => {
        setConfirmAscDialogVisible(true);
    };

    const confirmDeleteAssociation = (rowData) => {
        // Establece la asociación con los valores de la fila seleccionada
        setAssociationName({
            categoryName: rowData[0],
            providerName: rowData[1]
        });
        setDeleteAssociationDialog(true);
    };

    const deleteAsociation = () => {
        if (associationName.categoryName && associationName.providerName) {
            Request_Service.deleteAsociation(associationName, setListAssociation, toast, setDeleteAssociationDialog, setAssociationName, emptyAssociationName, 'Asociación ', URL.concat('categoryProviderAssociations'), URL)
        }
    };

    const associationDialogFooter = (
        DialogFooter(hideDialog, confirmAsc)
    );

    const confirmAssociationDialogFooter = (
        confirmDialogFooter(hideConfirmAssociationDialog, saveAssociation)
    );

    const deleteAssociationDialogFooter = (
        deleteDialogFooter(hideDeleteAssociationDialog, deleteAsociation)
    );

    const actionBodyTemplateP = (rowData) => {
        return <Button icon="pi pi-trash" className="rounded" severity="danger" onClick={() => confirmDeleteAssociation(rowData)} />
    };

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
        (isAdmin && { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } })
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, listAssociation, 'Reporte_Asociaciones_Categorías_y_Proveedores') };
    const handleExportExcel = () => { exportExcel(listAssociation, columns, 'Asociaciones_Categorías_y_Proveedores') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={<Button label={'Registrar Asociación'} icon="pi pi-arrows-h" className="rounded" onClick={openAsociation} style={{ background: '#0D9276', border: 'none' }} />} right={isAdmin && rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={listAssociation}
                    dataKey="category.idCategory"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Asociaciones"
                    globalFilter={globalFilter}
                    header={header('Asociaciones entre Categorías y Proveedores', setGlobalFilter)}
                    columns={columns}
                />

                <AsociationDialog
                    asociation={association}
                    setAsociation={setAssociation}
                    visible={associationDialog}
                    title={title}
                    footer={associationDialogFooter}
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
                    id={association.categoryId}
                    id2={association.providerId}
                    selectedTwo={selectedProvider}
                    setSelected2={setSelectedProvider}
                    options={categories}
                    options2={providers}
                    valueTemplateTwo={selectedProviderTemplate}
                    itemTemplateTwo={providerOptionTemplate}
                    filter submitted={submitted}
                    confirmDialogVisible={confirmAscDialogVisible}
                    confirmAsociationDialogFooter={confirmAssociationDialogFooter}
                    hideConfirmAsociationDialog={hideConfirmAssociationDialog}
                />

                {DialogDelete(deleteAssociationDialog, 'Asociación', deleteAssociationDialogFooter, hideDeleteAssociationDialog, association, `${associationName.categoryName} y ${associationName.providerName}`, 'la asociación entre')}
            </div>
        </div>
    )
}