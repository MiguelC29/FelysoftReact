import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../components/CustomDataTable';

export default function Charges() {
  let emptyCharge = {
    idCharge: null,
    charge: '',
    description: '',
  };

  const URL = 'http://localhost:8086/api/charge/';
  const [charges, setCharges] = useState([]);
  const [chargeDialog, setChargeDialog] = useState(false);
  const [charge, setCharge] = useState(emptyCharge);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getData(URL, setCharges);
  }, []);

  const openNew = () => {
    setCharge(emptyCharge);
    setTitle('Registrar Cargo');
    setOperation(1);
    setSubmitted(false);
    setChargeDialog(true);
  };

  const editCharge = (charge) => {
    setCharge({ ...charge });
    setTitle('Editar Cargo');
    setOperation(2);
    setChargeDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setChargeDialog(false);
  };

  const hideConfirmChargeDialog = () => {
    setConfirmDialogVisible(false);
  };

  const saveCharge = () => {
    setSubmitted(true);
    setConfirmDialogVisible(false);

    if (charge.charge && charge.description) {
      let url, method, parameters;

      if (charge.idCharge && operation === 2) {
        parameters = {
          idCharge: charge.idCharge,
          charge: charge.charge,
          description: charge.description,
        };
        url = URL + 'update/' + charge.idCharge;
        method = 'PUT';
      } else {
        parameters = {
          charge: charge.charge,
          description: charge.description,
        };
        url = URL + 'create';
        method = 'POST';
      }

      sendRequest(method, parameters, url, setCharges, URL, operation, toast, 'Cargo');
      setChargeDialog(false);
      setCharge(emptyCharge);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteCharge = (charge) => {
    confirmDelete(charge, setCharge, setConfirmDialogVisible);
  };

  const deleteCharge = () => {
    deleteData(URL, charge.idCharge, setCharges, toast, setConfirmDialogVisible, setCharge, emptyCharge);
  };

  const exportCSV = () => {
    if (dt.current) {
      dt.current.exportCSV();
    } else {
      console.error("La referencia 'dt' no está definida.");
    }
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, charge, setCharge);
  };

  const actionBodyTemplateCharge = (rowData) => {
    return actionBodyTemplate(rowData, editCharge, confirmDeleteCharge);
  };

  const chargeDialogFooter = DialogFooter(hideDialog, saveCharge);
  const confirmChargeDialogFooter = confirmDialogFooter(hideConfirmChargeDialog, deleteCharge);

  const columns = [
    { field: 'charge', header: 'Cargo', sortable: true, style: { minWidth: '12rem' } },
    { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
    { body: actionBodyTemplateCharge, exportable: false, style: { minWidth: '12rem' } },
  ];

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={charges}
          dataKey="idCharge"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} cargos"
          globalFilter={globalFilter}
          header={header('Cargos', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={chargeDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={chargeDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="charge" className="font-bold">
            Cargo
          </label>
          <InputText id="charge" value={charge.charge} onChange={(e) => onInputChange(e, 'charge')} required autoFocus className={classNames({ 'p-invalid': submitted && !charge.charge })} />
          {submitted && !charge.charge && <small className="p-error">Cargo es requerido.</small>}
        </div>

        <div className="field">
          <label htmlFor="description" className="font-bold">
            Descripción
          </label>
          <InputText id="description" value={charge.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !charge.description })} />
          {submitted && !charge.description && <small className="p-error">Descripción es requerida.</small>}
        </div>
      </Dialog>

      {DialogDelete(confirmDialogVisible, 'Cargo', confirmChargeDialogFooter, hideConfirmChargeDialog, charge, '', 'el cargo')}
    </div>
  );
}
