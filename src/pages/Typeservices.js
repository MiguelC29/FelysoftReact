import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';

export default function TypeServices() {
  let emptyTypeService = {
    idTypeService: null,
    name: '',
    description: '',
    price: 0,
  };

  const URL = 'http://localhost:8086/api/typeservice/';
  const [typeservices, setTypeservices] = useState([]);
  const [typeServiceDialog, setTypeServiceDialog] = useState(false);
  const [typeService, setTypeService] = useState(emptyTypeService);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getData(URL, setTypeservices);
  }, []);

  const openNew = () => {
    setTypeService(emptyTypeService);
    setTitle('Registrar Tipo de Servicio');
    setOperation(1);
    setSubmitted(false);
    setTypeServiceDialog(true);
  };

  const editTypeService = (typeService) => {
    setTypeService({ ...typeService });
    setTitle('Editar Tipo de Servicio');
    setOperation(2);
    setTypeServiceDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTypeServiceDialog(false);
  };

  const hideConfirmTypeServiceDialog = () => {
    setConfirmDialogVisible(false);
  };

  const saveTypeService = () => {
    setSubmitted(true);
    setConfirmDialogVisible(false);

    if (typeService.name && typeService.description && typeService.price) {
      let url, method, parameters;

      if (typeService.idTypeService && operation === 2) {
        parameters = {
          idTypeService: typeService.idTypeService,
          name: typeService.name,
          description: typeService.description,
          price: typeService.price,
        };
        url = URL + 'update/' + typeService.idTypeService;
        method = 'PUT';
      } else {
        parameters = {
          name: typeService.name,
          description: typeService.description,
          price: typeService.price,
        };
        url = URL + 'create';
        method = 'POST';
      }

      sendRequest(method, parameters, url, setTypeservices, URL, operation, toast, 'Tipo de Servicio');
      setTypeServiceDialog(false);
      setTypeService(emptyTypeService);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteTypeService = (typeService) => {
    confirmDelete(typeService, setTypeService, setConfirmDialogVisible);
  };

  const deleteTypeService = () => {
    deleteData(URL, typeService.idTypeService, setTypeservices, toast, setConfirmDialogVisible, setTypeService, emptyTypeService);
  };

  const exportCSV = () => {
    if (dt.current) {
      dt.current.exportCSV();
    } else {
      console.error("La referencia 'dt' no está definida.");
    }
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, typeService, setTypeService);
  };

  const onInputNumberChange = (e, name) => {
    inputNumberChange(e, name, typeService, setTypeService);
  };

  const actionBodyTemplateP = (rowData) => {
    return actionBodyTemplate(rowData, editTypeService, confirmDeleteTypeService);
  };
  
  const typeServiceDialogFooter = DialogFooter(hideDialog, saveTypeService);
  const confirmTypeServiceDialogFooter = confirmDialogFooter(hideConfirmTypeServiceDialog, deleteTypeService);

  const columns = [
    { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
    { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
    { field: 'price', header: 'Precio', sortable: true, style: { minWidth: '10rem' } },
    { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
  ];
  

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={typeservices}
          dataKey="idTypeService"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} tipos de servicios"
          globalFilter={globalFilter}
          header={header('Tipos de Servicios', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={typeServiceDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={typeServiceDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText id="name" value={typeService.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !typeService.name })} />
          {submitted && !typeService.name && <small className="p-error">Nombre es requerido.</small>}
        </div>

        <div className="field">
          <label htmlFor="description" className="font-bold">
            Descripción
          </label>
          <InputText id="description" value={typeService.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !typeService.description })} />
          {submitted && !typeService.description && <small className="p-error">Descripción es requerida.</small>}
        </div>

        <div className="field">
          <label htmlFor="price" className="font-bold">
            Precio
          </label>
          <InputNumber
            id="price"
            value={typeService.price}
            onValueChange={(e) => onInputNumberChange(e, 'price')}
            mode="decimal"
            currency="COP"
            locale="es-CO"
            required
            className={classNames({ 'p-invalid': submitted && !typeService.price })}
          />
          {submitted && !typeService.price && <small className="p-error">Precio es requerido.</small>}
        </div>
      </Dialog>

      {DialogDelete(confirmDialogVisible, 'Tipo de Servicio', confirmTypeServiceDialogFooter, hideConfirmTypeServiceDialog, typeService, '', 'el tipo de servicio')}
    </div>
  );
}
