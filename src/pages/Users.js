import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// import { InputMask } from 'primereact/inputmask'
import { Password } from 'primereact/password';
import CustomDataTable from '../components/CustomDataTable';

export default function Users() {

  let emptyUser = {
    idUser: null,
    numIdentification: null,
    image: null,
    typeImg: null,
    typeDoc: '',
    names: '',
    lastNames: '',
    address: '',
    phoneNumber: 0,
    email: '',
    gender: '',
    username: '',
    password: '',
    role: ''
  }

  const TypeDoc = {
    CC: 'Cédula de Ciudadania',
    TI: 'Tarjeta de Identidad',
    CE: 'Cédula de Extranjeria'
  };

  const Gender = {
    FEMENINO: 'FEMENINO',
    MASCULINO: 'MASCULINO'
  };

  const URL = 'http://localhost:8086/api/user/';
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getData(URL, setUsers);
    getData('http://localhost:8086/api/role/', setRoles);
  }, []);

  const openNew = () => {
    setUser(emptyUser);
    setTitle('Registrar Usuario');
    setSelectedGender('');
    setSelectedTypeId('');
    setSelectedRole('');
    setOperation(1);
    setSubmitted(false);
    setUserDialog(true);
  };

  const editUser = (user) => {
    setUser({ ...user });
    setSelectedGender(user.gender);
    setSelectedTypeId(user.typeDoc);
    setSelectedRole(user.role);
    setTitle('Editar Usuario');
    setOperation(2);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideConfirmUserDialog = () => {
    setConfirmDialogVisible(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);
    setConfirmDialogVisible(false);
    if (
      user.numIdentification &&
      user.typeDoc &&
      user.names.trim() &&
      user.lastNames.trim() &&
      user.address.trim() &&
      user.phoneNumber &&
      user.email.trim() &&
      user.gender &&
      user.username.trim() &&
      user.password.trim() &&
      user.role) {
      let url, method, parameters;
      if (user.idUser && operation === 2) {
        parameters = {
          idUser: user.idUser, numIdentification: user.numIdentification, typeDoc: user.typeDoc, names: user.names.trim(), lastNames: user.lastNames.trim(), address: user.address.trim(), phoneNumber: user.phoneNumber, email: user.email.trim(), gender: user.gender,
          username: user.username.trim(), password: user.password.trim(), fkIdRole: user.role.idRole
        };
        url = URL + 'update/' + user.idUser;
        method = 'PUT';
      } else {
        parameters = {
          numIdentification: user.numIdentification, typeDoc: user.typeDoc, names: user.names.trim(), lastNames: user.lastNames.trim(), address: user.address.trim(), phoneNumber: user.phoneNumber, email: user.email.trim(), gender: user.gender,
          username: user.username.trim(), password: user.password.trim(), fkIdRole: user.role.idRole
        };
        url = URL + 'create';
        method = 'POST';
      }

      sendRequest(method, parameters, url, setUsers, URL, operation, toast, 'Usuario ');
      setUserDialog(false);
      setUser(emptyUser);
    }
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteUser = (user) => {
    confirmDelete(user, setUser, setDeleteUserDialog);
  };

  const deleteUser = () => {
    deleteData(URL, user.idUser, setUsers, toast, setDeleteUserDialog, setUser, emptyUser);
  };

  const exportCSV = () => {
    if (dt.current) {
      dt.current.exportCSV();
    } else {
      console.error("La referencia 'dt' no está definida.");
    }
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, user, setUser);
  };

  const onInputNumberChange = (e, name) => {
    inputNumberChange(e, name, user, setUser);
  };

  const actionBodyTemplateP = (rowData) => {
    return actionBodyTemplate(rowData, editUser, confirmDeleteUser);
  };

  const userDialogFooter = (
    DialogFooter(hideDialog, confirmSave)
  );
  const confirmUserDialogFooter = (
    confirmDialogFooter(hideConfirmUserDialog, saveUser)
  );
  const deleteUserDialogFooter = (
    deleteDialogFooter(hideDeleteUserDialog, deleteUser)
  );

  const columns = [
    { field: 'typeDoc', header: 'Tipo Doc', sortable: true, style: { minWidth: '5rem' } },
    { field: 'numIdentification', header: 'Identificación', sortable: true, style: { minWidth: '12rem' } },
    { field: 'gender', header: 'Género', sortable: true, style: { minWidth: '8rem' } },
    { field: 'names', header: 'Nombres', sortable: true, style: { minWidth: '16rem' } },
    { field: 'lastNames', header: 'Apellidos', sortable: true, style: { minWidth: '16rem' } },
    { field: 'address', header: 'Dirección', sortable: true, style: { minWidth: '16rem' } },
    { field: 'phoneNumber', header: 'Número de Télefono', sortable: true, style: { minWidth: '10rem' } },
    { field: 'email', header: 'Correo Eletrónico', sortable: true, style: { minWidth: '10rem' } },
    // { field: 'phoneNumber', header: 'Número de Télefono', sortable: true, style: { minWidth: '10rem' } },
    /* "username": "Admin",
    "password": "admin123",
    "image": null,
    "typeImg": null,
    "dateRegister": "2024-03-27T00:37:28.000+00:00",
    "lastModification": "2024-03-27T00:37:28.000+00:00", */
    { field: 'role.name', header: 'Rol', sortable: true, style: { minWidth: '10rem' } },
    { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
  ];

  const typeDocOptions = Object.keys(TypeDoc).map(key => ({
    label: TypeDoc[key],
    value: key
  }));

  const genderOptions = Object.keys(Gender).map(key => ({
    label: Gender[key],
    value: key
  }));

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate(openNew)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={users}
          dataKey="id"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} usuarios"
          globalFilter={globalFilter}
          header={header('Usuarios', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={userDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        {/* {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="names" className="font-bold">
              Nombres
            </label>
            <InputText id="names" value={user.names} onChange={(e) => onInputChange(e, 'names')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.names })} />
            {submitted && !user.names && <small className="p-error">Nombres son requeridos.</small>}
          </div>
          <div className="field col">
            <label htmlFor="lastNames" className="font-bold">
              Apellidos
            </label>
            <InputText id="lastNames" value={user.lastNames} onChange={(e) => onInputChange(e, 'lastNames')} required className={classNames({ 'p-invalid': submitted && !user.lastNames })} />
            {submitted && !user.lastNames && <small className="p-error">Apellidos son requeridos.</small>}
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            {<label htmlFor="typeDoc" className="font-bold">
              Tipo de Identificación
            </label>}
            <Dropdown
              id="typeDoc"
              value={selectedTypeId}
              onChange={(e) => { setSelectedTypeId(e.value); onInputNumberChange(e, 'typeDoc');} } 
              options={typeDocOptions}
              placeholder="Seleccionar el tipo de identificación"
              required
              className={`w-full md:w-16rem ${classNames({ 'p-invalid': submitted && !user.typeDoc && !selectedTypeId })}`}
            />
            {submitted && !user.typeDoc && !selectedTypeId && <small className="p-error">Tipo de Identificación es requerido.</small>}
          </div>
          <div className="field col">
            <label htmlFor="numIdentification" className="font-bold">
              Número de Identificación
            </label>
            {/* <InputNumber id="numIdentification" value={user.numIdentification} onValueChange={(e) => onInputNumberChange(e, 'numIdentification')} required className={classNames({ 'p-invalid': submitted && !user.numIdentification })} /> */}
            <InputNumber inputId="numIdentification" value={user.numIdentification} onValueChange={(e) => onInputNumberChange(e, 'numIdentification')} useGrouping={false} required className={classNames({ 'p-invalid': submitted && !user.numIdentification })} />
            {submitted && !user.numIdentification && <small className="p-error">Número de identificación es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="gender" className="font-bold">
              Género
            </label>
            <Dropdown
              id="gender"
              value={selectedGender}
              onChange={(e) => {setSelectedGender(e.value); onInputNumberChange(e, 'gender');} }
              options={genderOptions}
              placeholder="Seleccionar el género"
              required
              className={`w-full md:w-16.1rem ${classNames({ 'p-invalid': submitted && !user.gender && !selectedGender })}`}
            />
            {submitted && !user.gender && !selectedGender && <small className="p-error">Tipo de Identificación es requerido.</small>}
          </div>
          <div className="field col">
            <label htmlFor="phoneNumbers" className="font-bold block mb-2">Número de celular</label>
            <InputNumber inputId="phoneNumbers" value={user.phoneNumber} onValueChange={(e) => onInputNumberChange(e, 'phoneNumber')} useGrouping={false} required maxLength={10} className={classNames({ 'p-invalid': submitted && !user.phoneNumber })} />
            {submitted && !user.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="address" className="font-bold">
              Dirección
            </label>
            <InputText id="address" value={user.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !user.address })} />
            {submitted && !user.address && <small className="p-error">Dirección es requerida.</small>}
          </div>
          <div className="field col">
            <label htmlFor="email" className="font-bold">
              Correo Eletrónico
            </label>
            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} placeholder='mi_correo@micorreo.com' />
            {submitted && !user.email && <small className="p-error">Correo Eletrónico es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="username" className="font-bold">
              Nombre de Usuario
            </label>
            <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !user.username })} />
            {submitted && !user.username && <small className="p-error">Nombre de Usuario es requerida.</small>}
          </div>
          <div className="field col">
            <label htmlFor="password" className="font-bold">
              Contraseña
            </label>
            <Password id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} toggleMask required className={classNames({ 'p-invalid': submitted && !user.password })} promptLabel='Ingrese una contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' />
            {submitted && !user.password && <small className="p-error">Contraseña es requerido.</small>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="role" className="font-bold">
            Rol
          </label>
          <Dropdown id="role" value={selectedRole} onChange={(e) => { setSelectedRole(e.value); onInputNumberChange(e, 'role'); }} options={roles} optionLabel="name" placeholder="Seleccionar rol" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !user.role && !selectedRole })}`} />

          {submitted && !user.role && !selectedRole && <small className="p-error">Rol es requerido.</small>}
        </div>
      </Dialog>

      {DialogDelete(deleteUserDialog, 'Usuario', deleteUserDialogFooter, hideDeleteUserDialog, user, user.names, 'el usuario')}

      {confirmDialog(confirmDialogVisible, 'Usuario', confirmUserDialogFooter, hideConfirmUserDialog, user, operation)}
    </div>
  );
}