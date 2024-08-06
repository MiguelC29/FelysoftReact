import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatDate, header, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Services() {
  let emptyService = {
    idService: null,
    state: '',
    priceAdditional: null,
    total: '',
    typeService: '',
  };

  // TODO: CUANDO SE ACTUALIZA EL PRECIO DEL TIPO DE SERVICIO, NO SE ACTUALIZA EN LA VISTA DE SERVICIOS
  const State = {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO',
  };

  const URL = '/service/';
  const [service, setService] = useState(emptyService);
  const [services, setServices] = useState([]);
  const [typeservices, setTypeservices] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedTypeservice, setSelectedTypeservice] = useState(null);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  // ROLES
  const isAdmin = UserService.isAdmin();
  const isInventoryManager = UserService.isInventoryManager();

  useEffect(() => {
    Request_Service.getData(URL.concat('all'), setServices);
    Request_Service.getData('/typeservice/all', setTypeservices);
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  const openNew = () => {
    setService(emptyService);
    setTitle('Registrar Servicio');
    setSelectedState('');
    setSelectedTypeservice('');
    setOperation(1);
    setSubmitted(false);
    setServiceDialog(true);
  };

  const editService = (service) => {
    setService({ ...service });
    setSelectedState(service.state);
    setSelectedTypeservice(service.typeService);
    setTitle('Editar Servicio');
    setOperation(2);
    setServiceDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setServiceDialog(false);
  };

  const hideConfirmServiceDialog = () => {
    setConfirmDialogVisible(false);
  };

  const hideDeleteServiceDialog = () => {
    setDeleteServiceDialog(false);
  };

  const saveService = async () => {
    setSubmitted(true);
    setConfirmDialogVisible(false);

    // Verificar si los campos requeridos están presentes y válidos
    const isValid = service.typeService && service.state && service.total;

    // Mostrar mensaje de error si algún campo requerido falta
    if (!isValid) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
      return;
    }

    let url, method, parameters;

    if (service.idService && operation === 2) {
      // Asegurarse de que los campos no estén vacíos al editar
      parameters = {
        idService: service.idService,
        state: service.state,
        priceAdditional: service.priceAdditional,
        total: service.total,
        fkIdTypeService: service.typeService.idTypeService,
      };
      url = URL + 'update/' + service.idService;
      method = 'PUT';
    } else {
      // Verificar que los campos requeridos están presentes al crear
      parameters = {
        state: service.state,
        priceAdditional: service.priceAdditional,
        total: service.total,
        fkIdTypeService: service.typeService.idTypeService,
      };
      url = URL + 'create';
      method = 'POST';
    }

    if (isValid) {
      await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Servicio ', URL.concat('all'), setServices);
      setServiceDialog(false);
      setService(emptyService);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteService = (service) => {
    confirmDelete(service, setService, setDeleteServiceDialog);
  };

  const deleteService = () => {
    Request_Service.deleteData(URL, service.idService, setServices, toast, setDeleteServiceDialog, setService, emptyService, 'Servicio ', URL.concat('all'));
  };

  const onInputNumberChange = (e, name) => {
    inputNumberChange(e, name, service, setService);
    calculateTotal();
  };

  // Al editar funciona raro
  const calculateTotal = () => {
    if (selectedTypeservice && service.priceAdditional !== null && service.typeService && service.typeService.price !== null) {
      const totalPrice = parseFloat(service.typeService.price) + parseFloat(service.priceAdditional);
      setService((prevService) => ({ ...prevService, total: totalPrice.toFixed(2) }));
    }
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData);
  };

  const actionBodyTemplateP = (rowData) => {
    return actionBodyTemplate(rowData, editService, confirmDeleteService);
  };

  const serviceDialogFooter = DialogFooter(hideDialog, confirmSave);
  const confirmServiceDialogFooter = confirmDialogFooter(hideConfirmServiceDialog, saveService);
  const deleteServiceDialogFooter = deleteDialogFooter(hideDeleteServiceDialog, deleteService);

  const columns = [
    { field: 'state', header: 'Estado', sortable: true, style: { minWidth: '12rem' } },
    { field: 'dateCreation', header: 'Fecha de Creación', sortable: true, body: (rowData) => formatDate(rowData.dateCreation), style: { minWidth: '16rem' } },
    { field: 'dateModification', header: 'Fecha de Modificación', sortable: true, body: (rowData) => formatDate(rowData.dateModification), style: { minWidth: '10rem' } },
    { field: 'priceAdditional', header: 'Precio Adicional', body: (rowData) => priceBodyTemplate(rowData.priceAdditional), sortable: true, style: { minWidth: '8rem' } },
    { field: 'total', header: 'Total', body: (rowData) => priceBodyTemplate(rowData.total), sortable: true, style: { minWidth: '8rem' } },
    { field: 'typeService.name', header: 'Tipo de Servicio', sortable: true, style: { minWidth: '10rem' } },
    (isInventoryManager || isAdmin) && { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
  ];

  const statesOptions = Object.keys(State).map((key) => ({
    label: State[key],
    value: key,
  }));

  const selectedTypeServiceTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const typeServiceOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  // EXPORT DATA
  const handleExportPdf = () => { exportPdf(columns, services, 'Reporte_Servicios') };
  const handleExportExcel = () => { exportExcel(services, columns, 'Servicios') };
  const handleExportCsv = () => { exportCSV(false, dt) };

  // const contentLeftToolbar = ((isAdmin || isInventoryManager)) ? leftToolbarTemplate(openNew) : '';

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="card" style={{ background: '#9bc1de' }}>
        {
          (isAdmin || isInventoryManager) &&
          <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
        }

        <CustomDataTable
          dt={dt}
          data={services}
          dataKey="id"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Servicios"
          globalFilter={globalFilter}
          header={header('Servicios', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog
        visible={serviceDialog}
        style={{ width: '40rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={title}
        modal
        className="p-fluid"
        footer={serviceDialogFooter}
        onHide={hideDialog}
      >
        <div className="field mt-4">
          <FloatLabel>
            <Dropdown
              id="typeService"
              value={selectedTypeservice}
              onChange={(e) => {
                setSelectedTypeservice(e.value);
                onInputNumberChange(e, 'typeService');
              }}
              options={typeservices}
              optionLabel="name"
              placeholder="Seleccionar el tipo de servicio"
              filter valueTemplate={selectedTypeServiceTemplate}
              itemTemplate={typeServiceOptionTemplate}
              emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados"
              required autoFocus
              className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !service.typeService && !selectedTypeservice })}`}
            />
            <label htmlFor="typeService" className="font-bold">Tipo de Servicio</label>
          </FloatLabel>
          {submitted && !service.typeService && !selectedTypeservice && <small className="p-error">Tipo de servicio es requerido.</small>}
        </div>
        <div className="field mt-5">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">monetization_on</span>
            </span>
            <FloatLabel>
              <label htmlFor="priceAdditional" className="font-bold">Precio Adicional</label>
              <InputNumber
                id="priceAdditional"
                value={service.priceAdditional}
                onValueChange={(e) => onInputNumberChange(e, 'priceAdditional')}
                mode="decimal"
                currency="COP"
                locale="es-CO"
              // Precio adicional no es obligatorio
              // className={classNames({ 'p-invalid': submitted && !service.priceAdditional })}
              />
            </FloatLabel>
            {/* {submitted && !service.priceAdditional && <small className="p-error">Precio Adicional es requerido.</small>} */}
          </div>
        </div>
        <div className="field mt-5">
          <FloatLabel>
            <Dropdown
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.value);
                onInputNumberChange(e, 'state');
              }}
              options={statesOptions}
              placeholder="Seleccionar el estado actual"
              emptyMessage="No hay datos"
              required
              className={`w-full md:w-16rm ${classNames({ 'p-invalid': submitted && !service.state && !selectedState })}`}
            />
            <label htmlFor="state" className="font-bold">Estado</label>
          </FloatLabel>
          {submitted && !service.state && !selectedState && <small className="p-error">Estado requerido.</small>}
        </div>
        <div className="field mt-5">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">monetization_on</span>
            </span>
            <FloatLabel>
              <InputText id="total" value={service.total} readOnly className={`w-full md:w-16rm ${classNames({ 'p-invalid': submitted && !service.total })}`} />
              <label htmlFor="total" className="font-bold">Total</label>
            </FloatLabel>
          </div>
          {submitted && !service.total && <small className="p-error">Total es requerido.</small>}
        </div>
      </Dialog>

      {DialogDelete(deleteServiceDialog, 'Servicio', deleteServiceDialogFooter, hideDeleteServiceDialog, service, service.typeService.name, 'el servicio')}

      {confirmDialog(confirmDialogVisible, 'Servicio', confirmServiceDialogFooter, hideConfirmServiceDialog, service, operation)}
    </div>
  );
};
