import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
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

export default function Employees() {
    let emptyEmployee = {
        idEmployee: null,
        salary: null,
        specialty: '',
        dateBirth: '',
        user: '',
    };

    const URL = '/employee/';
    const [employee, setEmployee] = useState(emptyEmployee);
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchCharges = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setEmployees);
        } catch (error) {
            console.error("Fallo al recuperar cargos:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchCharges();
        Request_Service.getData('/user/all', setUsers);
    }, [onlyDisabled, fetchCharges]);

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

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
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

    const saveEmployee = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid = employee.salary && employee.specialty.trim() && employee.dateBirth && employee.user;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method, parameters;

        if (employee.idEmployee && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            parameters = {
                idEmployee: employee.idEmployee,
                salary: employee.salary,
                specialty: employee.specialty.trim(),
                dateBirth: employee.dateBirth,
                fkIdUser: employee.user.idUser
            };
            url = URL + 'update/' + employee.idEmployee;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            parameters = {
                salary: employee.salary,
                specialty: employee.specialty.trim(),
                dateBirth: employee.dateBirth,
                fkIdUser: employee.user.idUser
            };
            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Empleado ', URL.concat('all'), setEmployees);
            setEmployeeDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteEmployee = (employee) => {
        confirmDelete(employee, setEmployee, setDeleteEmployeeDialog);
    };

    const deleteEmployee = () => {
        Request_Service.deleteData(URL, employee.idEmployee, setEmployees, toast, setDeleteEmployeeDialog, setEmployee, emptyEmployee, 'Empleado ', URL.concat('all'));
    };

    const handleEnable = (employee) => {
        Request_Service.sendRequestEnable(URL, employee.idEmployee, setEmployees, toast, 'Empleado ');
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
        return actionBodyTemplate(rowData, editEmployee, confirmDeleteEmployee, onlyDisabled, handleEnable);
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
    const handleExportPdf = () => { exportPdf(columns, employees, 'Reporte_Empleados') };
    const handleExportExcel = () => { exportExcel(employees, columns, 'Empleados') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={employees}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Empleados"
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
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <InputText
                                id="specialty"
                                value={employee.specialty}
                                onChange={(e) => onInputChange(e, 'specialty')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !employee.specialty })}
                            />
                            <label htmlFor="specialty" className="font-bold">Especialidad</label>
                        </FloatLabel>
                    </div>
                    {submitted && !employee.specialty && <small className="p-error">Especialidad es requerida.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="dateBirth" className="font-bold">Fecha de Nacimiento</label>
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

                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">monetization_on</span>
                        </span>
                        <FloatLabel>
                            <InputNumber id="salary" value={employee.salary} onValueChange={(e) => onInputNumberChange(e, 'salary')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !employee.salary })} />
                            <label htmlFor="salary" className="font-bold">Salario</label>
                        </FloatLabel>
                    </div>
                    {submitted && !employee.salary && <small className="p-error">Salario es requerido.</small>}
                </div>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">person_apron</span>
                        </span>
                        <FloatLabel>
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
                                emptyMessage="No hay datos"
                                emptyFilterMessage="No hay resultados encontrados"
                                required
                                className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !employee.user && !selectedUser })}`}
                            />
                            <label htmlFor="numIdentification" className="font-bold">Número de Identificación</label>
                        </FloatLabel>
                    </div>
                    {submitted && !employee.user && !selectedUser && <small className="p-error">No. Identificación es requerido.</small>}
                </div>
            </Dialog>

            {DialogDelete(deleteEmployeeDialog, 'Empleado', deleteEmployeeDialogFooter, hideDeleteEmployeeDialog, employee, employee.user.numIdentification, 'el empleado con ID')}

            {confirmDialog(confirmDialogVisible, 'Empleado', confirmEmployeeDialogFooter, hideConfirmEmployeeDialog, employee, operation)}
        </div>
    );
};
