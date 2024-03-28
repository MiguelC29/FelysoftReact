import React from 'react';
import axios from 'axios'
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const getData = async (url, setData) => {
    await axios.get(url + 'all')
        .then((response) => {
            setData(response.data.data);
        })
}

export const getOneData = async (url, setData) => {
    await axios.get(url)
        .then((response) => {
            setData(response.data.data);
        })
}

export const sendRequest = (method, parameters, url, setData, mainUrl, op, toast, nameTable) => {
    axios({ method: method, url: url, data: parameters })
        .then((response) => {
            let type = response.data['status'];
            let msg = response.data['data'];
            if (type === 'success') {
                // toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto Creado', life: 3000 });
                toast.current.show({ severity: 'success', summary: msg, detail: nameTable + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                getData(mainUrl, setData);
            }
        })
        .catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO ' + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
            console.log(error);
        });
}

export const deleteData = (url, id, setData, toast, setDeleteDataDialog, setTable, emptyData, nameTable) => {
    const durl = url + 'delete/' + id;
    axios({ method: 'PUT', url: durl, data: { id: id } })
        .then((response) => {
            let type = response.data['status'];
            let msg = response.data['data'];
            // show_alert(msg, type);
            if (type === 'success') {
                toast.current.show({ severity: 'success', summary: msg, detail: nameTable + ' Eliminado', life: 3000 });
                getData(url, setData);
            }
        })
        .catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO Eliminado', life: 3000 });
            console.log(error);
        });

    setDeleteDataDialog(false);
    setTable(emptyData);
}

export const confirmDelete = (nameTable, setData, setDeleteDialog) => {
    setData(nameTable);
    setDeleteDialog(true);
};

export const header = (nameTable, globalFilter) => (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0">Lista de {nameTable}</h4>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => globalFilter(e.target.value)} placeholder="Buscar..." />
        </span>
    </div>
);

export const actionBodyTemplate = (rowData, editData, confirmDelete) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editData(rowData)} />
            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDelete(rowData)} />
        </React.Fragment>
    );
};

export const DialogFooter = (hideDialog, saveData) => (
    <React.Fragment>
        <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Guardar" icon="pi pi-check" onClick={saveData} />
    </React.Fragment>
);
export const deleteDialogFooter = (hideDeleteDialog, deleteData) => (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
        <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteData} />
    </React.Fragment>
);

export const confirmDialogFooter = (hideDeleteDialog, saveData) => (
    <React.Fragment>
        <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
        <Button label="Confirmar" icon="pi pi-check" severity="danger" onClick={saveData} />
    </React.Fragment>
);

export const confirmDialog = (confirmDialogVisible, nameTable, DataDialogFooter, hideDataDialog, table, op) => {
    return (
        <Dialog visible={confirmDialogVisible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`${(op === 1) ? 'Guardar' : 'Actualizar'} ${nameTable}`} modal footer={DataDialogFooter} onHide={hideDataDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {table && (
                    <span>
                        {`¿Está seguro de ${(op === 1) ? 'guardar' : 'actualizar'} los datos?`}
                    </span>
                )}
            </div>
        </Dialog>
    );
}

export const DialogDelete = (deleteDataDialog, nameTable, deleteDataDialogFooter, hideDeleteDataDialog, table, field, msg) => {
    return (
        <Dialog visible={deleteDataDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Eliminar ${nameTable}`} modal footer={deleteDataDialogFooter} onHide={hideDeleteDataDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {table && (
                    <span>
                        {`¿Está seguro de eliminar ${msg}`} <b>{field}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
}

export const leftToolbarTemplate = (openNew) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );
};

export const rightToolbarTemplate = (exportCSV) => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
};

export const inputChange = (e, name, data, setData) => {
    const val = (e.target && e.target.value) || '';
    let _data = { ...data };

    _data[`${name}`] = val;

    setData(_data);
};

export const inputNumberChange = (e, name, data, setData) => {
    const val = e.value || 0;
    let _data = { ...data };

    _data[`${name}`] = val;

    setData(_data);
};