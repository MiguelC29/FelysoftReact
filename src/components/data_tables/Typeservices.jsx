import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';

export default function TypeServices() {
  let emptyTypeService = {
    idTypeService: null,
    name: '',
    description: '',
    price: null,
  };

  const URL = '/typeservice/';
  const [typeService, setTypeService] = useState(emptyTypeService);
  const [typeservices, setTypeservices] = useState([]);
  const [typeServiceDialog, setTypeServiceDialog] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [deleteTypeServiceDialog, setDeleteTypeServiceDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    Request_Service.getData(URL.concat('all'), setTypeservices);
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

  const hideDeleteTypeServiceDialog = () => {
    setDeleteTypeServiceDialog(false);
  };

  const saveTypeService = async () => {
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
      await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Tipo de Servicio ', URL.concat('all'), setTypeservices);
      setTypeServiceDialog(false);
      setTypeService(emptyTypeService);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteTypeService = (typeService) => {
    confirmDelete(typeService, setTypeService, setDeleteTypeServiceDialog);
  };

  const deleteTypeService = () => {
    Request_Service.deleteData(URL, typeService.idTypeService, setTypeservices, toast, setDeleteTypeServiceDialog, setTypeService, emptyTypeService, 'Tipo de Servicio ', URL.concat('all'));
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, typeService, setTypeService);
  };

  const onInputNumberChange = (e, name) => {
    inputNumberChange(e, name, typeService, setTypeService);
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  const actionBodyTemplateP = (rowData) => {
    return actionBodyTemplate(rowData, editTypeService, confirmDeleteTypeService);
  };

  const typeServiceDialogFooter = (
    DialogFooter(hideDialog, confirmSave)
  );

  const confirmTypeServiceDialogFooter = (
    confirmDialogFooter(hideConfirmTypeServiceDialog, saveTypeService)
  );

  const deleteTypeServiceDialogFooter = (
    deleteDialogFooter(hideDeleteTypeServiceDialog, deleteTypeService)
  );

  const columns = [
    { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
    { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
    { field: 'price', header: 'Precio', body: priceBodyTemplate, sortable: true, style: { minWidth: '10rem' } },
    { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
  ];

  // EXPORT DATA
  const handleExportPdf = () => { exportPdf(columns, typeservices, 'Reporte_Tipo_Servicios') };
  const handleExportExcel = () => { exportExcel(typeservices, columns, 'Tipo_Servicios') };
  const handleExportCsv = () => { exportCSV(false, dt) };

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="card" style={{ background: '#9bc1de' }}>
        <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={typeservices}
          dataKey="idTypeService"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Tipos de Servicios"
          globalFilter={globalFilter}
          header={header('Tipos de Servicios', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={typeServiceDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={typeServiceDialogFooter} onHide={hideDialog}>
        <div className="field mt-4">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">title</span>
            </span>
            <FloatLabel>
              <InputText id="name" value={typeService.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !typeService.name })} />
              <label htmlFor="name" className="font-bold">Nombre</label>
            </FloatLabel>
          </div>
          {submitted && !typeService.name && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="field mt-5">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">description</span>
            </span>
            <FloatLabel>
              <InputText id="description" value={typeService.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !typeService.description })} />
              <label htmlFor="description" className="font-bold">Descripción</label>
            </FloatLabel>
          </div>
          {submitted && !typeService.description && <small className="p-error">Descripción es requerida.</small>}
        </div>
        <div className="field mt-5">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">monetization_on</span>
            </span>
            <FloatLabel>
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
              <label htmlFor="price" className="font-bold">Precio</label>
            </FloatLabel>
          </div>
          {submitted && !typeService.price && <small className="p-error">Precio es requerido.</small>}
        </div>
      </Dialog>

      {DialogDelete(deleteTypeServiceDialog, 'Tipo de Servicio', deleteTypeServiceDialogFooter, hideDeleteTypeServiceDialog, typeService, typeService.name, 'el tipo de servicio')}

      {confirmDialog(confirmDialogVisible, 'Tipo de Servicio', confirmTypeServiceDialogFooter, hideConfirmTypeServiceDialog, typeService, operation)}
    </div>
  );
};