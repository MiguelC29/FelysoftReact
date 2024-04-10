import "../css/inicioSesion.css";
import logo from "../img/logo.svg";
import { useState } from 'react';
import { inputChange } from '../functionsDataTable';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

export const InicioSesion = () => {

  const emptyUser = {
    email: '',
    password: ''
  }

  const URL = 'http://localhost:8086/api/user/validate';
  const [user, setUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const validateUser = () => {
    setSubmitted(true);
    if (user.email && user.password) {
      let parameters = {
        email: user.email,
        password: user.password,
      };

      axios({ method: 'POST', url: URL, data: parameters })
        .then((response) => {
          let type = response.data['status'];
          if (type === 'success') {
            // redirigir
            setErrorVisible(false);
            window.location.href = '/carrito';
          }
        })
        .catch((error) => {
          // mostrar mensaje de email o password incorrecta
          setErrorVisible(true);
          setSubmitted(false);
          console.log(error);
        });
    }
  };

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
            <Button label='INICIAR SESIÓN' className='btn-login p-button text-decoration-none' onClick={validateUser} />
            {errorVisible && <small className="p-error">Email y/o Contraseña incorrectos.</small>}
          </div>
        </div>
      </div>
    </div>
  );
};