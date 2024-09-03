import "../../css/inicioSesion.css"
import logo from "../../img/logo.svg";
import { useRef, useState } from 'react';
import { DialogFooter, inputChange } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import UserService from "../service/UserService";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import LoadingOverlay from "../common/LoadingOverlay";

export const LoginPage = () => {

  const emptyUser = {
    email: '',
    password: ''
  }

  const [user, setUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, authError, setAuthError } = useAuth(); // Usar el contexto de autenticación
  const [shouldResetError, setShouldResetError] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [email, setEmail] = useState('');
  const [resetPassDialog, setResetPassDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const toast = useRef(null);

  const handleSubmit = async () => {
    setSubmitted(true);
    setAuthError('');
    if (user.email && user.password) {
      setLoading(true); // Muestra el overlay de carga
      try {
        const userData = await UserService.login(user.email, user.password);
        setLoading(false); // Oculta el overlay de carga
        if (userData.token) {
          localStorage.setItem('token', userData.token);
          localStorage.setItem('role', userData.role);
          localStorage.setItem('tokenExpiration', userData.expirationTime); // Guardar la expiración aquí
          login(); // Actualizar el estado de autenticación
          navigate('/perfil', { replace: true }); // Aqui se coloca la pagina a la que queremos que navegue despues de loguearse
          setErrorVisible(false);
        } else {
          setErrorVisible(true);
          setError(userData.error || 'Error al iniciar sesión');
          setSubmitted(false);
        }
      } catch (error) {
        setLoading(false); // Oculta el overlay de carga en caso de error
        setError(error.message || 'Error al iniciar sesión');
        setErrorVisible(true);
        setSubmitted(false);
        setShouldResetError(true);
        setTimeout(() => {
          if (shouldResetError) {
            setError('');
            setShouldResetError(false);
          }
        }, 5000);
      }
    }
  };

  const errorMessage = (error) => {
    switch (error) {
      case 'Usuario no encontrado':
        return 'El usuario ingresado no existe';
      case 'Cuenta no verificada':
        return "Por favor verifique su email para activar su cuenta.";
      case 'Credenciales incorrectas':
        return "Contraseña incorrecta.";
      default:
        return error || 'Error al iniciar sesión'; // Mostrar directamente si no hay coincidencia
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const openResetPass = () => {
    setEmail('');
    setSubmitted(false);
    setResetPassDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setResetPassDialog(false);
  };

  const handleResetPass = async () => {
    setSubmitted(true);

    // Mostrar mensaje de error si algún campo requerido falta
    if (!email.trim() || !validateEmail(email)) {
      return;
    }

    setLoading(true); // Inicia el cargando

    await UserService.verifyUser(email)
      .then((response) => {
        setLoading(false); // Termina el cargando
        hideDialog();

        if (response.message === "Usuario no encontrado") {
          toast.current.show({ severity: 'error', summary: response.message, detail: "Usuario no encontrado con el email ingresado", life: 3000 });
        }
        else if (response.message === "La cuenta del usuario esta deshabilitada") {
          toast.current.show({ severity: 'error', summary: response.message, detail: "El usuario se encuentra deshabilitado. Contacte al administrador.", life: 3000 });
        } else {
          const Swal = require('sweetalert2');
          Swal.fire({
            title: "Verifique su correo!",
            text: "Al correo ingresado, se le envio un mensaje para restablecer su contraseña.\nPor favor verifica tu correo electrónico.",
            icon: "success"
          })
            .then((result) => {
              if (result.isConfirmed) {
                navigate('/login');
              }
            });
        }

        return response.data;
      })
      .catch((error) => {
        setLoading(false); // Termina el cargando
        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: error.message, life: 3000 });
        console.log(error);
      });
  }

  const resetPassDialogFooter = (
    DialogFooter(hideDialog, handleResetPass)
  );

  const onInputChange = (e, name) => {
    inputChange(e, name, user, setUser);
    setErrorVisible(false);
    setShouldResetError(false); // Evita que el error se resetee si el usuario cambia un campo
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
            <h2>Iniciar Sesión</h2>
            <div className="login-form" style={{ background: '#19191a' }} method='post'>
              {authError && <small className="p-error">{authError}</small>}
              <div className="input__wrapper">
                <input
                  id="email"
                  autoComplete="off"
                  spellCheck="false"
                  type="email"
                  placeholder="Email"
                  required
                  className={`input__field ${classNames({ 'p-invalid': submitted && !user.email })}`}
                  onChange={(e) => onInputChange(e, 'email')}
                />
                <label htmlFor="email" className="input__label">
                  Email
                </label>
                {submitted && !user.email && <small className="p-error">Correo Eletrónico es requerido.</small>}
                <div className="input__wrapper">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className={`input__field ${classNames({ 'p-invalid': submitted && !user.password })}`}
                    onChange={(e) => onInputChange(e, 'password')}
                  />
                  <label htmlFor="password" className="input__label">
                    Password
                  </label>
                  {submitted && !user.password && <small className="p-error">Contraseña es requerido.</small>}
                </div>
                <div id="spinner" className="spinner"></div>
              </div>
              <div className="text-center">
                <Button label='INICIAR SESIÓN' className='btn-login p-button text-decoration-none mb-1' onClick={handleSubmit} />
                {errorVisible && <small className="p-error">{errorMessage(error)}</small>}
                <br />
                <div className="mt-3">
                  <span>¿Aún no tiene una cuenta?  </span><Link to="/registro" replace>Registrarse</Link>
                </div>
                <div className="mt-3">
                  <Link onClick={openResetPass}>¿Olvidaste la contraseña?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog visible={resetPassDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Restablecer Contraseña" modal className="p-fluid" footer={resetPassDialogFooter} onHide={hideDialog}>
          <div className="formgrid grid mt-4">
            <div className="field col">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <span className="material-symbols-outlined">mail</span>
                </span>
                <FloatLabel>
                  <InputText id="email" name='email' value={email} onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailValid(validateEmail(e.target.value));
                  }} className={classNames({ 'p-invalid': submitted && !email })} placeholder='mi_correo@micorreo.com' maxLength={50} autoComplete="new-email" />
                  <label htmlFor="email" className="font-bold">Correo Eletrónico</label>
                </FloatLabel>
              </div>
              {submitted && !email && <small className="p-error">Correo Eletrónico es requerido.</small>}
              {submitted && email && !emailValid && <small className="p-error">El Correo Eletrónico ingresado no es válido.</small>}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};