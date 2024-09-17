import axios from 'axios';
import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import ExportDropdown from './components/ExportDropDown';
import UserService from './components/service/UserService';

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
                toast.current.show({ severity: 'success', summary: msg, detail: nameTable + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                getData(mainUrl, setData);
            }
        })
        .catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO ' + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
            console.log(error);
        });
}

export const sendRequestStock = (method, parameters, url, setData, mainUrl, toast) => {
    axios({ method: method, url: url, data: parameters })
        .then((response) => {
            let type = response.data['status'];
            let msg = response.data['data'];
            if (type === 'success') {
                // SI SE QUIERE SE VALIDA LA OP Y SI ES UNO ES ACTUALIZADO Y SI ES 2 ES REINICIADO
                toast.current.show({ severity: 'success', summary: msg, detail: 'Stock Actualizado', life: 3000 });
                getOneData(mainUrl, setData);
            }
        })
        .catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Stock NO Actualizado', life: 3000 });
            console.log(error);
        });
}

export const sendRequestAsc = (method, parameters, url, toast) => {
    axios({ method: method, url: url, data: parameters })
        .then((response) => {
            let type = response.data['status'];
            let msg = response.data['data'];
            if (type === 'success') {
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: msg, life: 3000 });
                // getData(mainUrl, setData);
            }
        })
        .catch((error) => {
            let entity1 = error.response.data.entity1;
            let entity2 = error.response.data.entity2;
            if (error.response.data.data === 'Asociación existente') {
                toast.current.show({
                    severity: 'info',
                    summary: 'Asociación Existente',
                    detail: `La asociación entre ${entity1} y ${entity2} ya existe.`,
                    life: 3000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error en la solicitud',
                    detail: 'Asociación fallida',
                    life: 3000
                });
            }
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
        <h4 className="m-0 text-black">Lista de {nameTable}</h4>
        <span className="p-input-icon-left">
            {/* <i className="pi pi-search" /> */}
            <InputText type="search" onInput={(e) => globalFilter(e.target.value)} placeholder="Buscar..." />
        </span>
    </div>
);

export const headerInv = (nameTable, globalFilter) => (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-black">Inventario de {nameTable}</h4>
        <span className="p-input-icon-left">
            {/* <i className="pi pi-search" /> */}
            <InputText type="search" onInput={(e) => globalFilter(e.target.value)} placeholder="Buscar..." />
        </span>
    </div>
);

export const actionBodyTemplate = (rowData, editData, confirmDelete, onlyDisabled, enable) => {
    const isAdmin = UserService.isAdmin();
    return (
        <React.Fragment>
            {
                onlyDisabled ? (
                    <Button icon="pi pi-check" className="mr-2 rounded" onClick={() => enable(rowData)} style={{ background: '#0D9276', border: 'none' }} />
                ) : (
                    <>
                        <Button icon="pi pi-pencil" className="mr-2 rounded" onClick={() => editData(rowData)} style={{ background: '#0d56df' }} />
                        {isAdmin &&
                            <Button icon="pi pi-trash" className="rounded" severity="danger" onClick={() => confirmDelete(rowData)} />
                        }
                    </>
                )
            }
        </React.Fragment>
    );
};

export const actionBodyTemplateInv = (rowData, updateStock, resetStock) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2 rounded" onClick={() => updateStock(rowData)} style={{ background: '#0d56df', borderColor: '#0d56df' }} />
            <Button icon="pi pi-replay" className="rounded" severity="danger" onClick={() => resetStock(rowData)} />
        </React.Fragment>
    );
};

export const DialogFooter = (hideDialog, saveData) => (
    <React.Fragment>
        <Button label="Cancelar" icon="pi pi-times" className='dialog-btn-cancel mr-2 rounded' severity="danger" outlined onClick={hideDialog} />
        <Button label="Guardar" icon="pi pi-check" className="dialog-btn-confirm rounded" onClick={saveData} />
    </React.Fragment>
);
export const deleteDialogFooter = (hideDeleteDialog, deleteData) => (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className='confirm-dialog-delete mr-2 rounded' outlined onClick={hideDeleteDialog} />
        <Button label="Si" icon="pi pi-check" className='rounded' severity="danger" onClick={deleteData} />
    </React.Fragment>
);

export const confirmDialogFooter = (hideDeleteDialog, saveData) => (
    <React.Fragment>
        <Button label="Cancelar" icon="pi pi-times" className='dialog-btn-cancel mr-2 rounded' severity="danger" outlined onClick={hideDeleteDialog} />
        <Button label="Confirmar" icon="pi pi-check" className='dialog-btn-confirm rounded' severity="info" onClick={saveData} autoFocus />
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

export const confirmDialogPassword = (confirmDialogVisible, DataDialogFooter, hideDataDialog) => {
    return (
        <Dialog visible={confirmDialogVisible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Cambiar Contraseña" modal footer={DataDialogFooter} onHide={hideDataDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>¿Está seguro de cambiar su contraseña?</span>
            </div>
        </Dialog>
    );
}

export const confirmDialogStock = (confirmDialogVisible, nameTable, DataDialogFooter, hideDataDialog, table, op) => {
    return (
        <Dialog visible={confirmDialogVisible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`${(op === 1) ? 'Actualizar' : 'Reiniciar'} ${nameTable}`} modal footer={DataDialogFooter} onHide={hideDataDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {table && (
                    <span>
                        {`¿Está seguro de ${(op === 1) ? 'actualizar' : 'reiniciar'} el stock?`}
                    </span>
                )}
            </div>
        </Dialog>
    );
}

export const confirmDialogAsc = (confirmDialogVisible, nameTable, DataDialogFooter, hideDataDialog, table) => {
    return (
        <Dialog visible={confirmDialogVisible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Asociación de ${nameTable}`} modal footer={DataDialogFooter} onHide={hideDataDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {table && (
                    <span>
                        {`¿Está seguro de asociar los datos?`}
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

export const leftToolbarTemplate = (openNew, onlyDisabled, openDisabled) => {
    const isAdmin = UserService.isAdmin();
    const icon = (!onlyDisabled) ? 'pi-eye-slash' : 'pi-eye';
    return (
        <div className="flex flex-wrap gap-2">
            {!onlyDisabled &&
                <Button label="Nuevo" icon="pi pi-plus" className="rounded" onClick={openNew} style={{ background: '#265073', border: 'none' }} />
            }
            {isAdmin &&
                <Button label={onlyDisabled ? 'Mostrar Todos' : 'Mostrar Deshabilitados'} icon={"pi " + icon} className="rounded" onClick={openDisabled} style={{ background: '#8a0d04', border: 'none' }} />
            }
        </div>
    );
};

export const leftToolbarTemplatePurchase = (openNew, setIsProduct) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="Productos" icon="pi pi-plus" className="rounded" onClick={() => {setIsProduct(true); openNew(true);}} style={{ background: '#265073', border: 'none' }} />
            <Button label="Libros" icon="pi pi-plus" className="rounded" onClick={() => {setIsProduct(false); openNew(false);}} style={{ background: '#265073', border: 'none' }} />
        </div>
    );
};

export const leftToolbarTemplateAsociation = (openNew, onlyDisabled, openDisabled, nameTable, openAsociation) => {
    const isAdmin = UserService.isAdmin();
    const icon = (!onlyDisabled) ? 'pi-eye-slash' : 'pi-eye';
    return (
        <div className="flex flex-wrap gap-2">
            {!onlyDisabled &&
                <>
                    <Button label="Nuevo" icon="pi pi-plus" className="rounded" onClick={openNew} style={{ background: '#265073', border: 'none' }} />

                    <Button label={'Asociar ' + nameTable} icon="pi pi-arrows-h" className="rounded" onClick={openAsociation} style={{ background: '#0D9276', border: 'none' }} />
                </>
            }
            {isAdmin &&
                <Button label={onlyDisabled ? 'Mostrar Todos' : 'Mostrar Deshabilitados'} icon={"pi " + icon} className="rounded" severity="danger" onClick={openDisabled} style={{ background: '#8a0d04', border: 'none' }} />
            }
        </div>
    );
};

export const inputChange = (e, name, data, setData) => {
    const val = (e.target && e.target.value) || '';
    let _data = { ...data };

    _data[`${name}`] = val;

    setData(_data);
};

export const inputNumberChange = (e, name, data, setData) => {
    const val = e.value;
    let _data = { ...data };

    _data[`${name}`] = val;

    setData(_data);
};

export const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm:ss');
};

// Export data
export const rightToolbarTemplateExport = (exportCSV, exportExcel, exportPDF) => {
    return (
        <ExportDropdown exportCSV={exportCSV} exportExcel={exportExcel} exportPDF={exportPDF} />
    )
};

const exportColumns = (columns) => columns.map((col) => ({ title: col.header, dataKey: col.field }));

// NO FUNCIONA CON FORANEAS
/* export const exportPdf = (columns, data, fileName) => {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default('l', 'pt', 'letter'); // 'l' para orientación horizontal
            doc.autoTable(exportColumns(columns), data);
            doc.save(`${fileName}.pdf`);
        });
    });
}; */

export const exportPdf = (columns, data, fileName) => {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default('l', 'pt', 'letter'); // 'l' para orientación horizontal

            const formattedData = data.map((item) => {
                return columns.map((col) => {
                    if (col.field) {
                        const fields = col.field.split('.');
                        let value = item;
                        for (const field of fields) {
                            value = value[field];
                            if (value === undefined) {
                                return ''; // Manejar datos faltantes (opcional)
                            }
                        }
                        return value;
                    }
                    return ''; // Manejar campos no anidados
                });
            });

            doc.autoTable(exportColumns(columns), formattedData);
            doc.save(`${fileName}.pdf`);
        });
    });
};

export const exportExcel = (data, columns, fileName) => {
    import('xlsx').then((xlsx) => {
        const filteredData = data.map((item) => {
            const filteredItem = {};
            columns.forEach((col) => {
                if (col.field) {
                    const fields = col.field.split('.'); // Dividir el campo si hay un punto (.) para acceder a campos anidados
                    let value = item;
                    for (const field of fields) {
                        value = value[field];
                    }
                    filteredItem[col.header] = value;
                }
            });
            return filteredItem;
        });

        const worksheet = xlsx.utils.json_to_sheet(filteredData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, fileName); // Nombre del archivo Excel
    });
};

const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + EXCEL_EXTENSION); // NAME FILE

        }
    });
};

export const exportCSV = (selectionOnly, dt) => {
    dt.current.exportCSV({ selectionOnly });
};