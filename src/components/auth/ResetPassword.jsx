import "../../css/inicioSesion.css"
import logo from "../../img/logo.svg";
import { useRef, useState } from 'react';
import { confirmDialog, confirmDialogFooter, inputChange } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Link, useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import { Toast } from "primereact/toast";
import LoadingOverlay from "../common/LoadingOverlay";

export const ResetPassword = () => {

    const emptyUser = {
        password: '',
        confirmPassword: ''
    }

    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Estado de carga
    const toast = useRef(null);

    const hideConfirmResetPassDialog = () => {
        setConfirmDialogVisible(false);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        const isValid =
            user.password &&
            user.confirmPassword;

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if (user.password !== user.confirmPassword) {
            return;
        }

        setLoading(true); // Muestra el overlay de carga
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get('token');

            if (token) {
                setLoading(true); // Muestra el overlay de carga
                await UserService.resetPassword(token, { newPassword: user.password })
                    .then(response => {
                        setLoading(false); // Termina el cargando

                        const Swal = require('sweetalert2');
                        Swal.fire({
                            title: "Restablecimiento Exitoso!",
                            html: "Su contraseña fue restablecida exitosamente.",
                            icon: "success"
                        })
                            .then((result) => {
                                if (result.isConfirmed) {
                                    setUser(emptyUser);
                                    setSubmitted(false);
                                    navigate('/login');
                                }
                            });
                    })
                    .catch(error => {
                        setLoading(false); // Termina el cargando
                        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: "Error al restablecer la contraseña. Intenta nuevamente.", life: 3000 });
                        console.log(error);
                        setSubmitted(false);
                    });
            } else {
                setLoading(false);
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: "Token de verificación no proporcionado.", life: 3000 });
                setSubmitted(false);
            }
        } catch (error) {
            setLoading(false); // Oculta el overlay de carga en caso de error
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: error.message || 'Error al restablecer la contraseña', life: 3000 });
            setSubmitted(false);
        }
    };
    
    const confirmUserDialogFooter = (
        confirmDialogFooter(hideConfirmResetPassDialog, handleSubmit)
    );

    const onInputChange = (e, name) => {
        inputChange(e, name, user, setUser);
    };

    return (
        <>
            <LoadingOverlay visible={loading} /> {/* Overlay de carga */}
            <Toast ref={toast} position="bottom-right" />
            <div className="page">
                <div className="container-logo bg-white p-3" style={{ borderRadius: '60px 0 0 60px' }}>
                    <img className="logo" src={logo} alt="Logo" />
                </div>
                <div className="login-card" style={{ borderRadius: '20px 80px 80px 20px' }}>
                    <div className="content">
                        <h2>Restablecer Contraseña</h2>
                        <div className="login-form" style={{ background: '#19191a' }} method='post'>
                            <div className="input__wrapper">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    autoComplete="off"
                                    spellCheck="false"
                                    type="password"
                                    placeholder="Ingrese su nueva contraseña"
                                    required
                                    className={`input__field ${classNames({ 'p-invalid': submitted && !user.password })}`}
                                    onChange={(e) => onInputChange(e, 'password')}
                                />
                                <label htmlFor="newPassword" className="input__label">
                                    Nueva Contraseña
                                </label>
                                {submitted && !user.password && <small className="p-error">Contraseña es requerida.</small>}
                                <div className="input__wrapper">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirme la contraseña"
                                        required
                                        className={`input__field ${classNames({ 'p-invalid': submitted && !user.confirmPassword })}`}
                                        onChange={(e) => onInputChange(e, 'confirmPassword')}
                                    />
                                    <label htmlFor="confirmPassword" className="input__label">
                                        Confirmar Contraseña
                                    </label>
                                    {submitted && !user.confirmPassword && <small className="p-error">Confirmar contraseña es requerido.</small>}
                                    {user.confirmPassword && user.password !== user.confirmPassword && <small className="p-error">Las contraseñas no coinciden.</small>}
                                </div>
                                <div id="spinner" className="spinner"></div>
                            </div>

                            {confirmDialog(confirmDialogVisible, 'Contraseña', confirmUserDialogFooter, hideConfirmResetPassDialog, user, 1)}

                            <div className="text-center">
                                <Button label='Restablecer' className='btn-login p-button text-decoration-none mb-1' onClick={() => setConfirmDialogVisible(true)} />

                                <Link to="/login">Inciar Sesión</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};