import React, { useState } from "react";
import logo from "./logo.svg";
import "./styles.css";

const strengthLabels = ["weak", "medium", "medium", "strong"];

const getStrength = (password) => {
  let strengthIndicator = -1;

  if (/[a-z]/.test(password)) strengthIndicator++;
  if (/[A-Z]/.test(password)) strengthIndicator++;
  if (/\d/.test(password)) strengthIndicator++;
  if (/[^a-zA-Z0-9]/.test(password)) strengthIndicator++;

  if (password.length >= 16) strengthIndicator++;

  return strengthLabels[strengthIndicator];
};

export const RegistrationForm = () => {
  const [pkIdIdentificacion, setPkIdIdentificacion] = useState("");
  const [tipoDocu, setTipoDocu] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [genero, setGenero] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [fkIdRol, setFkIdRol] = useState("");
  const [strength, setStrength] = useState("");
  const [confirmStrength, setConfirmStrength] = useState("");

  const handleChange = (event) => {
    const newPassword = event.target.value;
    setContrasena(newPassword);
    setStrength(getStrength(newPassword));
  };

  const handleConfirmPasswordChange = (event) => {
    const newPassword = event.target.value;
    setConfirmarContrasena(newPassword);
    setConfirmStrength(getStrength(newPassword));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("pkIdIdentificacion:", pkIdIdentificacion);
    console.log("tipoDocu:", tipoDocu);
    console.log("nombres:", nombres);
    console.log("apellidos:", apellidos);
    console.log("direccion:", direccion);
    console.log("telefono:", telefono);
    console.log("email:", email);
    console.log("genero:", genero);
    console.log("usuario:", usuario);
    console.log("contrasena:", contrasena);
    console.log("confirmarContrasena:", confirmarContrasena);
    console.log("fkIdRol:", fkIdRol);
  };

  return (
    <div className="page">
      <div className="login-card">
        <img src={logo} alt="Logo" />
        <h2>Registro de Usuario</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="pkIdIdentificacion"
            value={pkIdIdentificacion}
            onChange={(e) => setPkIdIdentificacion(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="tipoDocu"
            value={tipoDocu}
            onChange={(e) => setTipoDocu(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="fkIdRol"
            value={fkIdRol}
            onChange={(e) => setFkIdRol(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="contrasena"
            value={contrasena}
            onChange={handleChange}
          />
          <div className={`bars ${strength}`}>
            <div></div>
          </div>
          <div className="strength">{strength && `${strength} Password`}</div>
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="confirmarContrasena"
            value={confirmarContrasena}
            onChange={handleConfirmPasswordChange}
          />
          <div className={`bars ${confirmStrength}`}>
            <div></div>
          </div>
          <div className="strength">{confirmStrength && `${confirmStrength} Confirmar Password`}</div>
          
          <button className="control" type="submit">
            Regístrate
          </button>
        </form>
      </div>
    </div>
  );
};
