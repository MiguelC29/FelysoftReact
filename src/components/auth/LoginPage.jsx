import "../../css/inicioSesion.css"
import logo from "../../img/logo.svg";
import { useState } from 'react';
import { inputChange } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import UserService from "../service/UserService";

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
  const { login } = useAuth(); // Usar el contexto de autenticación

  const handleSubmit = async () => {
    setSubmitted(true);
    if (user.email && user.password) {
      try {
        const userData = await UserService.login(user.email, user.password);
        if (userData.token) {
          localStorage.setItem('token', userData.token);
          localStorage.setItem('role', userData.role);
          login(); // Actualizar el estado de autenticación
          navigate('/perfil', { replace: true }); // Aqui se coloca la pagina a la que queremos que navegue despues de loguearse
          setErrorVisible(false);
        } else {
          console.log(userData)
          setErrorVisible(true);
          setError(userData.error)
          setSubmitted(false);
        }
      } catch (error) {
        console.log(error);
        setError(error);
        setErrorVisible(true);
        setSubmitted(false);
        setTimeout(() => {
          setError('')
        }, 5000) // 5 seg
      }
    }
  };

  const errorMessage = (error) => {
    if (error === 'User not found') {
      error = 'El usuario ingresado no existe';
    } else if ('Bad credentials') {
      error = "Credenciales incorrectas. \nEmail y/o Contraseña incorrectos.";
    } else {
      error = 'Error al iniciar sesión';
    }
    return error;
  }

  const onInputChange = (e, name) => {
    inputChange(e, name, user, setUser);
    setErrorVisible(false);
  };

  return (
    <div className="page">
      <div className="container-logo bg-white p-3" style={{ borderRadius: '60px 0 0 60px' }}>
        <img className="logo" src={logo} alt="Logo" />
      </div>
      <div className="login-card" style={{ borderRadius: '20px 80px 80px 20px' }}>
        <div className="content">
          <h2>Iniciar Sesión</h2>
          <div className="login-form" style={{ background: '#19191a' }} method='post'>
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
            <Button label='INICIAR SESIÓN' className='btn-login p-button text-decoration-none' onClick={handleSubmit} />
            {errorVisible && <small className="p-error">{errorMessage(error)}</small>}
          </div>
        </div>
      </div>
    </div>
  );
};