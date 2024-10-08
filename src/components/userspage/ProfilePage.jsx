import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import UserService from '../service/UserService'
import "../../css/perfilUsuario.css"
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'
import { Password } from 'primereact/password'
import { classNames } from 'primereact/utils'
import { confirmDialogFooter, confirmDialogPassword, confirmDialog, DialogFooter, inputChange, inputNumberChange } from '../../functionsDataTable'
import { useAuth } from '../context/AuthProvider'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import Request_Service from '../service/Request_Service'
import { Divider } from 'primereact/divider'
import { FileUpload } from 'primereact/fileupload'

function ProfilePage() {
    const emptyUserPassword = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const emptyUser = {
        idUser: '',
        numIdentification: '',
        image: '',
        typeImg: '',
        typeDoc: '',
        names: '',
        lastNames: '',
        address: '',
        phoneNumber: '',
        gender: '',
        email: '',
        user_name: '',
        password: '',
        role: ''
    };

    const Gender = {
        FEMENINO: 'FEMENINO',
        MASCULINO: 'MASCULINO'
    };

    const Role = {
        ADMINISTRATOR: 'ADMINISTRADOR',
        SALESPERSON: 'VENDEDOR',
        FINANCIAL_MANAGER: 'ADMINISTRADOR FINANCIERO',
        INVENTORY_MANAGER: 'GERENTE DE INVENTARIO',
        CUSTOMER: 'CLIENTE',
    }
    // Renderizar el fondo desde localStorage
    const backgroundImage = localStorage.getItem('backgroundImage');

    const URL = '/user/';
    const [user, setUser] = useState(emptyUser);
    const [userPassword, setUserPassword] = useState(emptyUserPassword);
    const [selectedGender, setSelectedGender] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [imageDialog, setImageDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmDialogPasswordVisible, setConfirmDialogPasswordVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [imageSuccess, setImageSuccess] = useState(''); // Mensaje de éxito
    const [uploadKey, setUploadKey] = useState(0); // Para forzar el refresco del componente FileUpload
    const toast = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        fetchProfileInfo()
    }, [])

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token)
            setUser(response.user) //user
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.files[0];

        if (file) {
            // Validar el tipo de archivo
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                setImageError('El archivo seleccionado no es una imagen válida. Solo se permiten imágenes JPEG, JPG, PNG, WEBP.');
                setSelectedImage(null);
                setImageSuccess(''); // Limpiar el mensaje de éxito
                return;
            }

            setImageError(''); // Limpiar el mensaje de error si la imagen es válida
            setImageSuccess('Imagen seleccionada correctamente'); // Mostrar mensaje de éxito

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setFile(file); // Guardar el archivo solo después de obtener la vista previa
            };
            reader.readAsDataURL(file);
        }
    };

    // Forzar reinicio al hacer clic en "Seleccionar Imagen"
    const resetUploadOnClick = () => {
        setFile(null);
        setSelectedImage(null);
        setImageError('');
        setImageSuccess(''); // Limpiar el mensaje de éxito al reiniciar
        setUploadKey(prevKey => prevKey + 1); // Forzar la recreación del FileUpload
    };

    const handleLogout = () => {
        hideDialog();
        const Swal = require('sweetalert2');
        Swal.fire({
            title: "Exitoso!",
            text: "Constraseña cambiada. Inicie Sesión nuevamente.",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Llama a la función de logout para cerrar la sesión
            }
        });
    };

    const openPassword = () => {
        setUserPassword(emptyUserPassword);
        setSubmitted(false);
        setPasswordDialog(true);
    };

    const openImage = () => {
        setFile('');
        setSelectedImage('');
        setImageSuccess('');
        setImageError('');
        setSubmitted(false);
        setImageDialog(true);
    }

    const editUser = (user) => {
        setUser({ ...user });
        setSelectedGender(user.gender);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
        setPasswordDialog(false);
        setImageDialog(false);
    };

    const hideConfirmPasswordDialog = () => {
        setConfirmDialogPasswordVisible(false);
    };

    const hideConfirmUserDialog = () => {
        setConfirmDialogVisible(false);
    };

    const getGenderIcon = (gender) => {
        if (gender === "MASCULINO") {
            return <i className="fas fa-mars"></i>;
        } else if (gender === "FEMENINO") {
            return <i className="fas fa-venus"></i>;
        } else {
            return <i className="fas fa-genderless"></i>;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const description = (role) => {
        return Role[role] || "USUARIO";
    };

    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                localStorage.setItem('backgroundImage', base64String); // Guardar en localStorage
            };
            reader.readAsDataURL(file);
        }
    };
    // Esta función simula el clic en el input de tipo file cuando se hace clic en el botón
    const handleClick = () => {
        document.getElementById('input-banner').click();
    };

    const handleSubmit = async () => {
        try {
            setSubmitted(true);
            setConfirmDialogPasswordVisible(false);

            const isValid =
                userPassword.oldPassword &&
                userPassword.newPassword &&
                userPassword.confirmPassword;

            // Mostrar mensaje de error si algún campo requerido falta
            if (!isValid) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
                return;
            }

            if ((userPassword.newPassword !== userPassword.confirmPassword) || (userPassword.oldPassword === userPassword.newPassword)) {
                return;
            }

            // Verificar que los campos requeridos están presentes al crear
            const parameters = {
                oldPassword: userPassword.oldPassword.trim(),
                newPassword: userPassword.newPassword.trim()
            }

            await UserService.changePassword(parameters, toast, handleLogout);
        } catch (error) {
            console.error('Error cambiando constraseña usuario:', error)
            alert('Un error ocurrió mientras se cambiaba la contraseña usuario')
        }
    };

    const updateProfileImage = async () => {
        setSubmitted(true);

        // Mostrar mensaje de error si algún campo requerido falta
        if (!file) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if (imageError) {
            return;
        }

        const formData = new FormData();

        if (user.idUser) {
            formData.append('idUser', user.idUser);
            formData.append('image', file);
            await Request_Service.updateProfileImage(user.idUser, formData, toast);
            fetchProfileInfo(); // Refrescar la información del perfil después de la actualización
        }
        setImageDialog(false);
    };

    const saveUser = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Mostrar mensaje de error si algún campo requerido falta
        if (!user.phoneNumber) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        let url, method;
        const formData = new FormData();

        if (user.idUser) {
            // Asegurarse de que los campos no estén vacíos al editar
            formData.append('idUser', user.idUser);
            (user.address) && formData.append('address', user.address.trim());
            formData.append('phoneNumber', user.phoneNumber);
            (user.gender) && formData.append('gender', user.gender);
            url = URL + 'updateProfile/' + user.idUser;
            method = 'PUT';
        }

        await Request_Service.sendRequest(method, formData, url, 2, toast, 'Usuario ', URL.concat('all'), null);
        setUserDialog(false);
        // Fetch the updated profile information
        fetchProfileInfo();
    };

    const confirmSave = (e) => {
        e.preventDefault();
        setConfirmDialogVisible(true);
    };

    const confirmChangePassword = (e) => {
        e.preventDefault();
        setConfirmDialogPasswordVisible(true);
    }

    const onInputChangePassword = (e, name) => {
        inputChange(e, name, userPassword, setUserPassword);
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, user, setUser);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, user, setUser);
    };

    const confirmPasswordDialogFooter = (
        confirmDialogFooter(hideConfirmPasswordDialog, handleSubmit)
    );

    const confirmUserDialogFooter = (
        confirmDialogFooter(hideConfirmUserDialog, saveUser)
    );

    const dialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const dialogFooterPassword = (
        DialogFooter(hideDialog, confirmChangePassword)
    );

    const dialogFooterImage = (
        DialogFooter(hideDialog, updateProfileImage)
    );

    const genderOptions = Object.keys(Gender).map(key => ({
        label: Gender[key],
        value: key
    }));

    const footer = (
        <>
            <Divider />
            <p className="mt-2">Sugerencias</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>Al menos una minúscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Mínimo 8 caracteres</li>
            </ul>
        </>
    );

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <div className='profile-page-container'>
                <section className="seccion-perfil-usuario">
                    <div className="perfil-usuario-header">
                        <div className="perfil-usuario-portada" style={{ backgroundImage: `url(${(backgroundImage)? backgroundImage : 'https://i.postimg.cc/sXBLfRwt/Dise-o-sin-t-tulo-2-Tnm-Tl-L1rx-transformed.png'})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '300px' }}>
                            <div className="perfil-usuario-avatar">
                                {user.image ?
                                    <img id='imagen-perfil'
                                        src={`data:${user.imageType};base64,${user.image}`}
                                        alt={`Imagen usuario ${user.names}`} /> :
                                    <img id='imagen-perfil'
                                        src="https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
                                        alt={`No cuenta con img de perfil`} />}
                                <button type="button" className="boton-avatar" onClick={openImage}>
                                    <i className="far fa-image"></i>
                                </button>
                            </div>
                            <button type="button" className="boton-portada" onClick={handleClick}>
                                <i className="far fa-image"></i> Cambiar fondo
                            </button>
                            {/* Input de tipo file oculto */}
                            <input
                                type="file"
                                id="input-banner"
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleBackgroundChange}
                            />
                        </div>
                    </div>
                    <div className="perfil-usuario-body">
                        <div className="perfil-usuario-bio">
                            <h3 className="titulo">{user.names} {user.lastNames} {user.gender && getGenderIcon(user.gender)}</h3>
                            <div className="texto">
                                <h3>{description(user.role.name)}</h3>
                            </div>
                        </div>
                        <div className="perfil-usuario-footer">
                            <ul className="lista-datos">
                                <li><i className="icono fas fa-user"></i> Usuario: {user.user_name}</li>
                                <li><i className="icono fas fa-solid fa-passport"></i> Tipo Documento: {user.typeDoc}</li>
                                <li><i className="icono fas fa-phone"></i> Numero de Contacto: {user.phoneNumber}</li>
                                {(user.address) && <li><i className="icono fas fa-map-marker-alt"></i> Dirección: {user.address}</li>}
                            </ul>
                            <ul className="lista-datos">
                                <li><i className="icono fas fa-envelope"></i> Correo Electrónico: {user.email}</li>
                                <li><i className="icono fas fa-regular fa-address-card"></i> Identificación: {user.numIdentification}</li>
                                <li><i className="icono fas fa-user-check"></i> Registro: {formatDate(user.dateRegister)} </li>
                            </ul>
                        </div>
                    </div>
                    <div className='m-2 text-center profile-btn-container'>
                        <Button label="Actualizar Perfil" icon="pi pi-user-edit" className="rounded me-3" onClick={() => editUser(user)} style={{ background: '#0D9276', border: 'none' }} />
                        <Button label="Cambiar Contraseña" icon="pi pi-lock" className="rounded" onClick={openPassword} style={{ background: '#8f8c7e', border: 'none' }} />
                    </div>
                </section>
            </div>

            <Dialog visible={passwordDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Cambiar Contraseña'} modal className="p-fluid" footer={dialogFooterPassword} onHide={hideDialog}>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">password</span>
                            </span>
                            <FloatLabel>
                                <Password id="oldPassword" name='oldPassword' value={userPassword.oldPassword} onChange={(e) => onInputChangePassword(e, 'oldPassword')} className={classNames({ 'p-invalid': submitted && !userPassword.oldPassword })} promptLabel='Ingrese la contraseña actual' autoComplete="new-password" feedback={false} />
                                <label htmlFor="oldPassword" className="font-bold">Ingrese su contraseña actual</label>
                            </FloatLabel>
                        </div>
                        {submitted && !userPassword.oldPassword && <small className="p-error">Contraseña Actual es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">lock</span>
                            </span>
                            <FloatLabel>
                                <Password id="newPassword" name='newPassword' value={userPassword.newPassword} onChange={(e) => onInputChangePassword(e, 'newPassword')} className={classNames({ 'p-invalid': submitted && !userPassword.newPassword })} promptLabel='Ingrese la nueva contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' autoComplete="new-password" footer={footer} />
                                <label htmlFor="oldPassword" className="font-bold">Nueva Contraseña</label>
                            </FloatLabel>
                        </div>
                        {submitted && !userPassword.newPassword && <small className="p-error">Nueva Contraseña es requerido.</small>}
                        {userPassword.oldPassword && userPassword.newPassword && userPassword.oldPassword === userPassword.newPassword && <small className="p-error">La contraseña nueva no puede ser igual que la actual.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">key</span>
                            </span>
                            <FloatLabel>
                                <Password id="confirmPassword" name='confirmPassword' value={userPassword.confirmPassword} onChange={(e) => onInputChangePassword(e, 'confirmPassword')} className={classNames({ 'p-invalid': submitted && !userPassword.confirmPassword })} placeholder='Confirme la contraseña' autoComplete="new-password" feedback={false} />
                                <label htmlFor="confirmPassword" className="font-bold">Confirmar Contraseña</label>
                            </FloatLabel>
                        </div>
                        {submitted && !userPassword.confirmPassword && <small className="p-error">Confirmar contraseña es requerido.</small>}
                        {userPassword.confirmPassword && userPassword.newPassword !== userPassword.confirmPassword && <small className="p-error">Las contraseñas no coinciden.</small>}
                    </div>
                </div>
            </Dialog >

            <Dialog visible={userDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Editar Datos Usuario" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                {user.image && (
                    <img
                        src={`data:${user.typeImg};base64,${user.image}`}
                        alt={`Imagen usuario ${user.names}`}
                        className="shadow-2 border-round product-image block m-auto pb-3"
                        style={{ width: '120px', height: '120px' }}
                    />
                )}
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">id_card</span>
                                <div>
                                    <label htmlFor="names" className="font-bold">Nombres</label>
                                    <p>{user.names}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">id_card</span>
                                <div>
                                    <label htmlFor="lastNames" className="font-bold d-block">Apellidos</label>
                                    <p>{user.lastNames}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">badge</span>
                                <div>
                                    <label htmlFor="typeDoc" className="font-bold d-block">Tipo de Identificación</label>
                                    <p>{user.typeDoc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">badge</span>
                                <div>
                                    <label htmlFor="numIdentification" className="font-bold d-block">Número de Identificación</label>
                                    <p>{user.numIdentification}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">wc</span>
                                <FloatLabel>
                                    <Dropdown
                                        id="gender"
                                        name='gender'
                                        value={selectedGender}
                                        onChange={(e) => { setSelectedGender(e.value); onInputNumberChange(e, 'gender'); }}
                                        options={genderOptions}
                                        placeholder="Seleccionar el género"
                                        emptyMessage="No hay datos"
                                        className="w-full md:w-14rem rounded"
                                    />
                                    <label htmlFor="gender" className="font-bold">Género</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">call</span>
                                <FloatLabel>
                                    <InputNumber inputId="phoneNumber" name='phoneNumber' value={user.phoneNumber} onValueChange={(e) => onInputNumberChange(e, 'phoneNumber')} useGrouping={false} required maxLength={10} className={classNames({ 'p-invalid': submitted && !user.phoneNumber })} />
                                    <label htmlFor="phoneNumber" className="font-bold block mb-2">Número de celular</label>
                                </FloatLabel>
                            </div>
                            {submitted && !user.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">home</span>
                                <FloatLabel>
                                    <InputText id="address" name='address' value={user.address} onChange={(e) => onInputChange(e, 'address')} maxLength={50} />
                                    <label htmlFor="address" className="font-bold">Dirección</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">mail</span>
                                <div>
                                    <label htmlFor="email" className="font-bold d-block">Correo Electrónico</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">person</span>
                                <div>
                                    <label htmlFor="user_name" className="font-bold d-block">Nombre de Usuario</label>
                                    <p>{user.user_name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-start">
                                <span className="material-symbols-outlined me-2">admin_panel_settings</span>
                                <div>
                                    <label htmlFor="role" className="font-bold d-block">Rol</label>
                                    <p>{Role[user.role.name]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog >

            <Dialog visible={imageDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Cambiar foto de perfil" modal className="p-fluid" footer={dialogFooterImage} onHide={hideDialog}>
                {user.image && <img src={`data:${user.typeImg};base64,${user.image}`} alt={`Imagen usuario ${user.names}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="image" className="font-bold">Imagen Usuario</label>
                        <FileUpload
                            key={uploadKey} // Forzamos recrear el componente cuando se selecciona una nueva imagen
                            id="image"
                            mode="basic"
                            name="image"
                            chooseLabel={(selectedImage) ? "Cambiar Imagen" : "Seleccionar Imagen"}
                            url="https://felysoftspring-production.up.railway.app/api/book/create"
                            accept=".png,.jpg,.jpeg,.webp"
                            maxFileSize={3145728}
                            onSelect={handleFileUpload}
                            onBeforeSelect={resetUploadOnClick}  // Restablece el estado antes de seleccionar un nuevo archivo
                            required
                            className={`${classNames({ 'p-invalid': submitted && !selectedImage })}`}
                        />
                        {submitted && user.image && !selectedImage && <small className="p-error">Imagen es requerida.</small>}
                        {imageError && <small className="p-error">{imageError}</small>}
                        {imageSuccess && <small className="p-success">{imageSuccess}</small>} {/* Mensaje de éxito */}
                    </div>

                    <div className="field col">
                        {selectedImage && (
                            <img src={selectedImage} alt="Selected" width={'100px'} height={'120px'} className='mt-4 shadow-2 border-round' />
                        )}
                    </div>
                </div>
            </Dialog>

            {confirmDialogPassword(confirmDialogPasswordVisible, confirmPasswordDialogFooter, hideConfirmPasswordDialog)}

            {confirmDialog(confirmDialogVisible, 'Usuario', confirmUserDialogFooter, hideConfirmUserDialog, user, 2)}
        </>
    );
}
export default ProfilePage