import { useState } from "react";
import "../css/inicioSesion.css";
import logo from "../img/logo.svg";

const etiquetasFuerza = ["Debil", "Media", "Media", "Fuerte"];

export const PasswordStrength = ({ placeholder, onChange }) => {
  const [strength, setStrength] = useState("");

  const getStrength = (password) => {
    let strengthIndicator = -1;

    if (/[a-z]/.test(password)) strengthIndicator++;
    if (/[A-Z]/.test(password)) strengthIndicator++;
    if (/\d/.test(password)) strengthIndicator++;
    if (/[^a-zA-Z0-9]/.test(password)) strengthIndicator++;

    if (password.length >= 8) strengthIndicator++;

    return etiquetasFuerza[strengthIndicator];
  };

  const handleChange = (event) => {
    setStrength(getStrength(event.target.value));
    onChange(event.target.value);
  };

  
  return (
    <>
    <div className="input__wrapper">
      <input
        id="password"
        type="password"
        name="password"
        placeholder={placeholder}
        onChange={handleChange}
        required
        className="input__field"
      />
      <label htmlFor="password" className="input__label">
        Password
      </label>
      </div>

      <div className={`bars ${strength}`}>
        <div className="strength-bar-inner"></div>
      </div>
      <div className="strength">{strength && `Contraseña ${strength}`}</div>
      </>
  );
};

export const PasswordStrengthExample = () => {
  const handleChange = (value) => console.log(value);

  return (
    <div className="page">
      <div className="login-card"> 
      <img src={logo} alt="Logo"/>
        <div className="content">
      <h2>Iniciar Sesión</h2>
          <form className="login-form">
            <div className="input__wrapper">
              <input
                autoComplete="off"
                spellCheck="false"
                type="email"
                placeholder="Email"
                required
                className="input__field"
              />
              <label htmlFor="email" className="input__label">
                Email
              </label>
              <div id="spinner" className="spinner"></div>
            </div>

            <PasswordStrength placeholder="Password" onChange={handleChange} />
            <button className="control" type="button">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
