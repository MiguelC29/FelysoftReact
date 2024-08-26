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
import { confirmDialog, confirmDialogFooter, DialogFooter, inputChange } from '../../functionsDataTable'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

function ProfilePage() {
    const navigate = useNavigate();

    const emptyUser = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileInfo, setProfileInfo] = useState({});
    const [user, setUser] = useState(emptyUser);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const { logout } = useAuth();

    const hideConfirmUserDialog = () => {
        setConfirmDialogVisible(false);
    };

    useEffect(() => {
        fetchProfileInfo()
    }, [])

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token)
            setProfileInfo(response.user) //user
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
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
        setUser(emptyUser);
        setSubmitted(false);
        setPasswordDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPasswordDialog(false);
    };

    const hideConfirmPasswordDialog = () => {
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
        const roleDescriptions = {
            "ADMINISTRATOR": "Administrador",
            "INVENTORY_MANAGER": "Gerente de Inventario",
            "FINANCIAL_MANAGER": "Gerente de Finanzas",
            "SALESPERSON": "Vendedor",
            "CUSTOMER": "Bienvenido a su Perfil"
        };
        return roleDescriptions[role] || "USER";
    };

    const handleSubmit = async () => {
        try {
            setSubmitted(true);
            setConfirmDialogVisible(false);

            const isValid =
                user.oldPassword &&
                user.newPassword &&
                user.confirmPassword;

            // Mostrar mensaje de error si algún campo requerido falta
            if (!isValid) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
                return;
            }

            if ((user.newPassword !== user.confirmPassword) || (user.oldPassword === user.newPassword)) {
                return;
            }

            // Verificar que los campos requeridos están presentes al crear
            const parameters = {
                oldPassword: user.oldPassword.trim(),
                newPassword: user.newPassword.trim()
            }

            await UserService.changePassword(parameters, toast, handleLogout);
        } catch (error) {
            console.error('Error cambiando constraseña usuario:', error)
            alert('Un error ocurrió mientras se cambiaba la contraseña usuario')
        }
    };

    const validateOldPassword = (oldPassword) => {
        // METHOD TO VALIDATE IF THE USER ENTER THE ACTUAL PASSWORD CORRECTLY
        console.log(profileInfo.password);

        return oldPassword === profileInfo.password;
    }

    const confirmSave = (e) => {
        e.preventDefault();
        setConfirmDialogVisible(true);
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, user, setUser);
    };

    const confirmPasswordDialogFooter = (
        confirmDialogFooter(hideConfirmUserDialog, handleSubmit)
    );

    const passwordDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <div className='profile-page-container'>
                <section className="seccion-perfil-usuario">
                    <div className="perfil-usuario-header">
                        <div className="perfil-usuario-portada">
                            <div className="perfil-usuario-avatar">
                                {profileInfo.image ?
                                    <img id='imagen-perfil'
                                        src={`data:${profileInfo.imageType};base64,${profileInfo.image}`}
                                        alt={`Imagen usuario ${profileInfo.names}`} /> :
                                    <img id='imagen-perfil'
                                        src="https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
                                        alt={`No cuenta con img de perfil`} />}
                                <button type="button" className="boton-avatar">
                                    <i className="far fa-image"></i>
                                </button>
                            </div>
                            <button type="button" className="boton-portada">
                                <i className="far fa-image"></i> Cambiar fondo
                            </button>
                        </div>
                    </div>
                    <div className="perfil-usuario-body">
                        <div className="perfil-usuario-bio">
                            <h3 className="titulo">{profileInfo.names} {profileInfo.lastNames} {profileInfo.gender && getGenderIcon(profileInfo.gender)}</h3>
                            <p className="texto">
                                <h3>{description(profileInfo.role)}</h3>
                            </p>
                        </div>
                        <div className="perfil-usuario-footer">
                            <ul className="lista-datos">
                                <li><i className="icono fas fa-user"></i> Usuario: {profileInfo.user_name}</li>
                                <li><i className="icono fas fa-solid fa-passport"></i> Tipo Documento: {profileInfo.typeDoc}</li>
                                <li><i className="icono fas fa-phone"></i> Numero de Contacto: {profileInfo.phoneNumber}</li>
                                {(profileInfo.address) && <li><i className="icono fas fa-map-marker-alt"></i> Dirección: {profileInfo.address}</li>}
                            </ul>
                            <ul className="lista-datos">
                                <li><i className="icono fas fa-envelope"></i> Correo Electrónico: {profileInfo.email}</li>
                                <li><i className="icono fas fa-regular fa-address-card"></i> Identificación: {profileInfo.numIdentification}</li>
                                <li><i className="icono fas fa-user-check"></i> Registro: {formatDate(profileInfo.dateRegister)} </li>
                            </ul>
                        </div>
                    </div>
                    <div className='m-2'>
                        <Button label="Actualizar Perfil" icon="pi pi-user-edit" className="rounded me-2" onClick="" style={{ background: '#0D9276', border: 'none' }} />
                        <Button label="Cambiar Contraseña" icon="pi pi-lock" className="rounded" onClick={openPassword} style={{ background: '#8f8c7e', border: 'none' }} />
                    </div>
                </section>
            </div>
            <Dialog visible={passwordDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Cambiar Contraseña'} modal className="p-fluid" footer={passwordDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">key</span>
                            </span>
                            <FloatLabel>
                                <Password id="oldPassword" name='oldPassword' value={user.oldPassword} onChange={(e) => onInputChange(e, 'oldPassword')} toggleMask className={classNames({ 'p-invalid': submitted && !user.oldPassword })} promptLabel='Ingrese la contraseña actual' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' autoComplete="new-password" />
                                <label htmlFor="oldPassword" className="font-bold">Ingrese su contraseña actual</label>
                            </FloatLabel>
                        </div>
                        {submitted && !user.oldPassword && <small className="p-error">Contraseña Actual es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">key</span>
                            </span>
                            <FloatLabel>
                                <Password id="newPassword" name='newPassword' value={user.newPassword} onChange={(e) => onInputChange(e, 'newPassword')} toggleMask className={classNames({ 'p-invalid': submitted && !user.newPassword })} promptLabel='Ingrese la nueva contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' autoComplete="new-password" />
                                <label htmlFor="oldPassword" className="font-bold">Nueva Contraseña</label>
                            </FloatLabel>
                        </div>
                        {submitted && !user.newPassword && <small className="p-error">Nueva Contraseña es requerido.</small>}
                        {user.oldPassword && user.newPassword && user.oldPassword === user.newPassword && <small className="p-error">La contraseña nueva no puede ser igual que la actual.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">key</span>
                            </span>
                            <FloatLabel>
                                <Password id="confirmPassword" name='confirmPassword' value={user.confirmPassword} onChange={(e) => onInputChange(e, 'confirmPassword')} toggleMask className={classNames({ 'p-invalid': submitted && !user.confirmPassword })} placeholder='Confirme la contraseña' autoComplete="new-password" feedback={false} />
                                <label htmlFor="confirmPassword" className="font-bold">Confirmar Contraseña</label>
                            </FloatLabel>
                        </div>
                        {submitted && !user.confirmPassword && <small className="p-error">Confirmar contraseña es requerido.</small>}
                        {user.confirmPassword && user.newPassword !== user.confirmPassword && <small className="p-error">Las contraseñas no coinciden.</small>}
                    </div>
                </div>
            </Dialog >

            {confirmDialog(confirmDialogVisible, 'Cambiar Contraseña', confirmPasswordDialogFooter, hideConfirmPasswordDialog, user, '')}
        </>
    );
    /*
    <button><Link to={`/update-user/${profileInfo.idUser}`}>Update This Profile</Link></button>
    */
}
export default ProfilePage