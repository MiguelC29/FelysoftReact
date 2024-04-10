import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatDate, getData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import CustomDataTable from '../CustomDataTable';
import { FileUpload } from 'primereact/fileupload';
import { FloatLabel } from 'primereact/floatlabel';
import { Image } from 'primereact/image';

export default function Users() {
  let emptyUser = {
    idUser: null,
    numIdentification: null,
    image: '',
    typeImg: '',
    typeDoc: '',
    names: '',
    lastNames: '',
    address: '',
    phoneNumber: null,
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
  const [user, setUser] = useState(emptyUser);
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [operation, setOperation] = useState();
  const [title, setTitle] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getData(URL, setUsers);
    getData('http://localhost:8086/api/role/', setRoles);
  }, []);

  // PUEDE QUE SE PUEDA DECLARAR GENERAL PARA RECIBLAR
  const handleFileUpload = (event) => {
    const file = event.files[0];
    setFile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const openNew = () => {
    setUser(emptyUser);
    setTitle('Registrar Usuario');
    setSelectedGender('');
    setSelectedTypeId('');
    setSelectedRole('');
    setFile('');
    setSelectedImage('');
    setOperation(1);
    setSubmitted(false);
    setUserDialog(true);
  };

  const editUser = (user) => {
    setUser({ ...user });
    setSelectedGender(user.gender);
    setSelectedTypeId(user.typeDoc);
    setSelectedRole(user.role);
    setFile('');
    setSelectedImage('');
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
      let url, method;
      const formData = new FormData();
      if (user.idUser && operation === 2) {
        formData.append('idUser', user.idUser);
        formData.append('numIdentification', user.numIdentification);
        formData.append('typeDoc', user.typeDoc);
        formData.append('names', user.names.trim());
        formData.append('lastNames', user.lastNames.trim());
        formData.append('address', user.address.trim());
        formData.append('phoneNumber', user.phoneNumber);
        formData.append('email', user.email.trim());
        formData.append('gender', user.gender);
        formData.append('username', user.username.trim());
        formData.append('password', user.password.trim());
        formData.append('fkIdRole', user.role.idRole);
        formData.append('image', file);
        url = URL + 'update/' + user.idUser;
        method = 'PUT';
      } else {
        formData.append('numIdentification', user.numIdentification);
        formData.append('typeDoc', user.typeDoc);
        formData.append('names', user.names.trim());
        formData.append('lastNames', user.lastNames.trim());
        formData.append('address', user.address.trim());
        formData.append('phoneNumber', user.phoneNumber);
        formData.append('email', user.email.trim());
        formData.append('gender', user.gender);
        formData.append('username', user.username.trim());
        formData.append('password', user.password.trim());
        formData.append('fkIdRole', user.role.idRole);
        formData.append('image', file);
        url = URL + 'create';
        method = 'POST';
      }
      sendRequest(method, formData, url, setUsers, URL, operation, toast, 'Usuario ');
      setUserDialog(false);
      setUser(emptyUser);
    };
  };

  const confirmSave = () => {
    setConfirmDialogVisible(true);
  };

  const confirmDeleteUser = (user) => {
    confirmDelete(user, setUser, setDeleteUserDialog);
  };

  const deleteUser = () => {
    deleteData(URL, user.idUser, setUsers, toast, setDeleteUserDialog, setUser, emptyUser, 'Usuario');
  };

  const onInputChange = (e, name) => {
    inputChange(e, name, user, setUser);
  };

  const onInputNumberChange = (e, name) => {
    inputNumberChange(e, name, user, setUser);
  };

  const imageBodyTemplate = (rowData) => {
    const imageData = rowData.image;
    const imageType = rowData.imageType;
    if (imageData) {
      return <Image src={`data:${imageType};base64,${imageData}`} alt={`Imagen usuario ${rowData.name}`} className="shadow-2 border-round" width="80" height="80" preview />;
    } else {
      return <p>No hay imagen</p>;
    }
  };

  const genderTemplate = (rowData) => {
    if (rowData.gender === 'MASCULINO') {
      return 'M';
    } else {
      return 'F';
    }
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
    { field: 'gender', header: 'Género', body: genderTemplate, sortable: true, style: { minWidth: '5rem' } },
    { field: 'names', header: 'Nombres', sortable: true, style: { minWidth: '16rem' } },
    { field: 'lastNames', header: 'Apellidos', sortable: true, style: { minWidth: '16rem' } },
    { field: 'address', header: 'Dirección', sortable: true, style: { minWidth: '16rem' } },
    { field: 'phoneNumber', header: 'Télefono', sortable: true, style: { minWidth: '10rem' } },
    { field: 'email', header: 'Correo Eletrónico', sortable: true, style: { minWidth: '10rem' } },
    /*username, password, image */
    { field: 'role.name', header: 'Rol', sortable: true, style: { minWidth: '10rem' } },
    { field: 'dateRegister', header: 'Fecha de Creación', body: (rowData) => formatDate(rowData.dateRegister), sortable: true, style: { minWidth: '10rem' } },
    { field: 'lastModification', header: 'Última Modificación', body: (rowData) => formatDate(rowData.lastModification), sortable: true, style: { minWidth: '10rem' } },
    { field: 'image', header: 'Imagen', body: imageBodyTemplate, exportable: false, style: { minWidth: '8rem' } },
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

  // EXPORT DATA
  const handleExportPdf = () => { exportPdf(columns.slice(0, -2), users, 'Reporte_Usuarios') };
  const handleExportExcel = () => { exportExcel(users, columns.slice(0, -2), 'Usuarios') };
  const handleExportCsv = () => { exportCSV(false, dt) };

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="card" style={{ background: '#9bc1de', maxWidth: '89em' }}>
        <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

        <CustomDataTable
          dt={dt}
          data={users}
          dataKey="id"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Usuarios"
          globalFilter={globalFilter}
          header={header('Usuarios', setGlobalFilter)}
          columns={columns}
        />
      </div>

      <Dialog visible={userDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        {user.image && <img src={`data:${user.typeImg};base64,${user.image}`} alt={`Imagen usuario ${user.name}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
        <div className="formgrid grid mt-5">
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">id_card</span>
              </span>
              <FloatLabel>
                <InputText id="names" value={user.names} onChange={(e) => onInputChange(e, 'names')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.names })} maxLength={50} />
                <label htmlFor="names" className="font-bold">Nombres</label>
              </FloatLabel>
            </div>
            {submitted && !user.names && <small className="p-error">Nombres son requeridos.</small>}
          </div>
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">id_card</span>
              </span>
              <FloatLabel>
                <InputText id="lastNames" value={user.lastNames} onChange={(e) => onInputChange(e, 'lastNames')} required className={classNames({ 'p-invalid': submitted && !user.lastNames })} maxLength={60} />
                <label htmlFor="lastNames" className="font-bold">Apellidos</label>
              </FloatLabel>
            </div>
            {submitted && !user.lastNames && <small className="p-error">Apellidos son requeridos.</small>}
          </div>
        </div>
        <div className="formgrid grid mt-4">
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">badge</span>
              </span>
              {/* TODO: FALTA VALIDAR QUE SE INGRESEN AÑOS VÁLIDOS, ES DECIR NO MAYORES AL ACTUAL */}
              <FloatLabel>
                <Dropdown
                  id="typeDoc"
                  value={selectedTypeId}
                  onChange={(e) => { setSelectedTypeId(e.value); onInputNumberChange(e, 'typeDoc'); }}
                  options={typeDocOptions}
                  placeholder="Seleccionar el tipo de identificación"
                  emptyMessage="No hay datos"
                  required
                  className={`w-full md:w-14rem rounded ${classNames({ 'p-invalid': submitted && !user.typeDoc && !selectedTypeId })}`}
                />
                <label htmlFor="typeDoc" className="font-bold">Tipo de Identificación</label>
              </FloatLabel>
            </div>
            {submitted && !user.typeDoc && !selectedTypeId && <small className="p-error">Tipo de Identificación es requerido.</small>}
          </div>
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">badge</span>
              </span>
              <FloatLabel>
                <InputNumber inputId="numIdentification" value={user.numIdentification} onValueChange={(e) => onInputNumberChange(e, 'numIdentification')} useGrouping={false} required className={classNames({ 'p-invalid': submitted && !user.numIdentification })} maxLength={10} />
                <label htmlFor="numIdentification" className="font-bold">Número de Identificación</label>
              </FloatLabel>
            </div>
            {submitted && !user.numIdentification && <small className="p-error">Número de identificación es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid mt-4">
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">wc</span>
              </span>
              <FloatLabel>
                <Dropdown
                  id="gender"
                  value={selectedGender}
                  onChange={(e) => { setSelectedGender(e.value); onInputNumberChange(e, 'gender'); }}
                  options={genderOptions}
                  placeholder="Seleccionar el género"
                  emptyMessage="No hay datos"
                  required
                  className={`w-full md:w-14rem rounded ${classNames({ 'p-invalid': submitted && !user.gender && !selectedGender })}`}
                />
                <label htmlFor="gender" className="font-bold">Género</label>
              </FloatLabel>
            </div>
            {submitted && !user.gender && !selectedGender && <small className="p-error">Tipo de Identificación es requerido.</small>}
          </div>
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">call</span>
              </span>
              <FloatLabel>
                <InputNumber inputId="phoneNumbers" value={user.phoneNumber} onValueChange={(e) => onInputNumberChange(e, 'phoneNumber')} useGrouping={false} required maxLength={10} className={classNames({ 'p-invalid': submitted && !user.phoneNumber })} />
                <label htmlFor="phoneNumbers" className="font-bold block mb-2">Número de celular</label>
              </FloatLabel>
            </div>
            {submitted && !user.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid mt-4">
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">home</span>
              </span>
              <FloatLabel>
                <InputText id="address" value={user.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !user.address })} maxLength={50} />
                <label htmlFor="address" className="font-bold">Dirección</label>
              </FloatLabel>
            </div>
            {submitted && !user.address && <small className="p-error">Dirección es requerida.</small>}
          </div>
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">mail</span>
              </span>
              <FloatLabel>
                <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} placeholder='mi_correo@micorreo.com' maxLength={50} />
                <label htmlFor="email" className="font-bold">Correo Eletrónico</label>
              </FloatLabel>
            </div>
            {submitted && !user.email && <small className="p-error">Correo Eletrónico es requerido.</small>}
          </div>
        </div>
        <div className="formgrid grid mt-4">
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">person</span>
              </span>
              <FloatLabel>
                <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !user.username })} />
                <label htmlFor="username" className="font-bold">Nombre de Usuario</label>
              </FloatLabel>
            </div>
            {submitted && !user.username && <small className="p-error">Nombre de Usuario es requerida.</small>}
          </div>
          <div className="field col">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <span class="material-symbols-outlined">key</span>
              </span>
              <FloatLabel>
                <Password id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} toggleMask required className={classNames({ 'p-invalid': submitted && !user.password })} promptLabel='Ingrese una contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' />
                <label htmlFor="password" className="font-bold">Contraseña</label>
              </FloatLabel>
            </div>
            {submitted && !user.password && <small className="p-error">Contraseña es requerido.</small>}
          </div>
        </div>
        <div className="field mt-4">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <span class="material-symbols-outlined">admin_panel_settings</span>
            </span>
            <FloatLabel>
              <Dropdown id="role" value={selectedRole} onChange={(e) => { setSelectedRole(e.value); onInputNumberChange(e, 'role'); }} options={roles} optionLabel="name" placeholder="Seleccionar rol" emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !user.role && !selectedRole })}`} />
              <label htmlFor="role" className="font-bold">Rol</label>
            </FloatLabel>
          </div>
          {submitted && !user.role && !selectedRole && <small className="p-error">Rol es requerido.</small>}
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="image" className="font-bold">Foto del Usuario</label>
            {/* TODO: validar o permitir solo ciertos tipos de img - restringir a solo subir archivos de img */}
            <FileUpload
              id='image'
              mode="basic"
              name="image"
              chooseLabel="Seleccionar Imagen"
              url="http://localhost:8086/api/user/create"
              accept="image/*"
              maxFileSize={2000000}
              onSelect={handleFileUpload}
            />
          </div>
          <div className="field col">
            {selectedImage && (
              <img src={selectedImage} alt="Selected" width={'100px'} height={'120px'} className='mt-4 shadow-2 border-round' />
            )}
          </div>
        </div>
      </Dialog>

      {DialogDelete(deleteUserDialog, 'Usuario', deleteUserDialogFooter, hideDeleteUserDialog, user, user.names, 'el usuario')}

      {confirmDialog(confirmDialogVisible, 'Usuario', confirmUserDialogFooter, hideConfirmUserDialog, user, operation)}
    </div>
  );
};