import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { Tooltip } from 'primereact/tooltip';

export default function Employees() {
    let emptyEmployee = {
        idEmployee: null,
        salary: 0,
        specialty: '',
        dateBirth: '',
        user: '',
    };

    const URL = 'http://localhost:8086/api/employee/';
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(emptyEmployee);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setEmployees);
        getData('http://localhost:8086/api/user/', setUsers);
    }, []);

    const openNew = () => {
        setEmployee(emptyEmployee);
        setTitle('Registrar Empleado');
        setSelectedUser('');
        setOperation(1);
        setSubmitted(false);
        setEmployeeDialog(true);
    };

    const editEmployee = (employee) => {
        setEmployee({ ...employee });
        setSelectedUser(employee.user);
        setTitle('Editar Empleado');
        setOperation(2);
        setEmployeeDialog(true);
    };


    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
    };

    const hideConfirmEmployeeDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteEmployeeDialog = () => {
        setDeleteEmployeeDialog(false);
    };

    const saveEmployee = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (employee.salary && employee.specialty.trim() && employee.dateBirth && employee.user) {
            let url, method, parameters;

            if (employee.idEmployee && operation === 2) {
                parameters = {
                    idEmployee: employee.idEmployee,
                    salary: employee.salary, specialty:
                        employee.specialty.trim(),
                    dateBirth: employee.dateBirth,
                    fkIdUser: employee.user.idUser
                };
                url = URL + 'update/' + employee.idEmployee;
                method = 'PUT';
            } else {
                parameters = {
                    salary: employee.salary,
                    specialty: employee.specialty.trim(),
                    dateBirth: employee.dateBirth,
                    fkIdUser: employee.user.idUser
                };
                url = URL + 'create';
                method = 'POST';
            }

            sendRequest(method, parameters, url, setEmployees, URL, operation, toast, 'Empleado ');
            setEmployeeDialog(false);
            setEmployee(emptyEmployee);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteEmployee = (employee) => {
        confirmDelete(employee, setEmployee, setDeleteEmployeeDialog);
    };

    const deleteEmployee = () => {
        deleteData(URL, employee.idEmployee, setEmployees, toast, setDeleteEmployeeDialog, setEmployee, emptyEmployee);
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, employee, setEmployee);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, employee, setEmployee);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.salary);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editEmployee, confirmDeleteEmployee);
    };

    const employeeDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmEmployeeDialogFooter = (
        confirmDialogFooter(hideConfirmEmployeeDialog, saveEmployee)
    );
    const deleteEmployeeDialogFooter = (
        deleteDialogFooter(hideDeleteEmployeeDialog, deleteEmployee)
    );

    const selectedIdentificationTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.numIdentification}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const identificationOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.numIdentification}</div>
            </div>
        );
    };

    const columns = [
        { field: 'specialty', header: 'Especialidad', sortable: true },
        { field: 'dateBirth', header: 'Fecha de Nacimiento', sortable: true },
        { field: 'salary', header: 'Salario', body: priceBodyTemplate, sortable: true },
        { field: 'user.numIdentification', header: 'Número de Identificación', sortable: true },
        { body: actionBodyTemplateP, exportable: false },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, employees, 'Reporte_Categorias') };
    const handleExportExcel = () => { exportExcel(employees, columns, 'Categorias') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={employees}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} empleados"
                    globalFilter={globalFilter}
                    header={header('Empleados', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog
                visible={employeeDialog}
                style={{ width: '40rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={title}
                modal
                className="p-fluid"
                footer={employeeDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="specialty" className="font-bold">
                        Especialidad
                    </label>
                    <InputText
                        id="specialty"
                        value={employee.specialty}
                        onChange={(e) => onInputChange(e, 'specialty')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !employee.specialty })}
                    />
                    {submitted && !employee.specialty && <small className="p-error">Especialidad es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="dateBirth" className="font-bold">
                        Fecha de Nacimiento
                    </label>
                    <InputText
                        id="dateBirth"
                        value={employee.dateBirth}
                        onChange={(e) => onInputChange(e, 'dateBirth')}
                        type="date"
                        required
                        className={classNames({ 'p-invalid': submitted && !employee.dateBirth })}
                    />
                    {submitted && !employee.dateBirth && <small className="p-error">Fecha de Nacimiento es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="salary" className="font-bold">
                        Salario
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                        <InputNumber id="salary" value={employee.salary} onValueChange={(e) => onInputNumberChange(e, 'salary')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !employee.salary })} />
                    </div>
                    {submitted && !employee.salary && <small className="p-error">Salario es requerido.</small>}
                </div>

                <div className="field col">
                    <label htmlFor="numIdentification" className="font-bold">
                        Numero de Identificación
                    </label>
                    <Dropdown
                        id="numIdentification"
                        value={selectedUser}
                        onChange={(e) => {
                            setSelectedUser(e.value);
                            onInputNumberChange(e, 'user');
                        }}
                        options={users}
                        optionLabel="numIdentification"
                        placeholder="Seleccionar No. Identificación"
                        filter
                        valueTemplate={selectedIdentificationTemplate}
                        itemTemplate={identificationOptionTemplate}
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !employee.user && !selectedUser })}`}
                    />
                    {submitted && !employee.user && !selectedUser && <small className="p-error">No. Identificación es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteEmployeeDialog, 'Empleado', deleteEmployeeDialogFooter, hideDeleteEmployeeDialog, employee, employee.user.numIdentification, 'el empleado con ID')}

            {confirmDialog(confirmDialogVisible, 'Empleado', confirmEmployeeDialogFooter, hideConfirmEmployeeDialog, employee, operation)}
        </div>
    );
}
