import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';

export default function Charges() {
  let emptyCharge = {
    idCharge: null,
    charge: '',
    description: '',
  };

  const URL = '/charge/';
  const [charge, setCharge] = useState(emptyCharge);
  const [charges, setCharges] = useState([]);
  const [chargeDialog, setChargeDialog] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [deleteChargeDialog, setDeleteChargeDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    Request_Service.getData(URL.concat('all'), setCharges);
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

  const hideDeleteChargeDialog = () => {
    setDeleteChargeDialog(false);
  };

  const saveCharge = async () => {
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
      await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Cargo ', URL.concat('all'), setCharges);
      setChargeDialog(false);
      setCharge(emptyCharge);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteCharge = (charge) => {
    confirmDelete(charge, setCharge, setDeleteChargeDialog);
  };

  const deleteCharge = () => {
    Request_Service.deleteData(URL, charge.idCharge, setCharges, toast, setDeleteChargeDialog, setCharge, emptyCharge, 'Cargo ', URL.concat('all'));
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, charge, setCharge);
  };

  const actionBodyTemplateCharge = (rowData) => {
    return actionBodyTemplate(rowData, editCharge, confirmDeleteCharge);
  };

  const chargeDialogFooter = DialogFooter(hideDialog, confirmSave);
  const confirmChargeDialogFooter = confirmDialogFooter(hideConfirmChargeDialog, saveCharge);
  const deleteChargeDialogFooter = (
    deleteDialogFooter(hideDeleteChargeDialog, deleteCharge)
  );

  const columns = [
    { field: 'charge', header: 'Cargo', sortable: true, style: { minWidth: '12rem' } },
    { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
    { body: actionBodyTemplateCharge, exportable: false, style: { minWidth: '12rem' } },
  ];

  // EXPORT DATA
  const handleExportPdf = () => { exportPdf(columns, charges, 'Reporte_Cargos') };
  const handleExportExcel = () => { exportExcel(charges, columns, 'Cargos') };
  const handleExportCsv = () => { exportCSV(false, dt) };

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="card" style={{ background: '#9bc1de' }}>
        <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={charges}
          dataKey="idCharge"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Cargos"
          globalFilter={globalFilter}
          header={header('Cargos', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={chargeDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={chargeDialogFooter} onHide={hideDialog}>
        <div className="field mt-4">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">person_apron</span>
            </span>
            <FloatLabel>
              <InputText id="charge" value={charge.charge} onChange={(e) => onInputChange(e, 'charge')} required autoFocus className={classNames({ 'p-invalid': submitted && !charge.charge })} />
              <label htmlFor="charge" className="font-bold">Cargo</label>
            </FloatLabel>
          </div>
          {submitted && !charge.charge && <small className="p-error">Cargo es requerido.</small>}
        </div>
        <div className="field mt-4">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">description</span>
            </span>
            <FloatLabel>
              <InputText id="description" value={charge.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !charge.description })} />
              <label htmlFor="description" className="font-bold">Descripción</label>
            </FloatLabel>
          </div>
          {submitted && !charge.description && <small className="p-error">Descripción es requerida.</small>}
        </div>
      </Dialog>

      {DialogDelete(deleteChargeDialog, 'Cargo', deleteChargeDialogFooter, hideDeleteChargeDialog, charge, charge.charge, 'el cargo')}

      {confirmDialog(confirmDialogVisible, 'Cargo', confirmChargeDialogFooter, hideConfirmChargeDialog, charge, operation)}
    </div>
  );
};
