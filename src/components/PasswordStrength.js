import React, { useState } from "react";
import logo from "../img/logo.svg";
import "../css/registroUsuario.css";

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

export default function PasswordStrength() {
  const [Id, setId] = useState("");
  const [DocumentType, setDocumentType] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Address, setAddress] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  const [Gender, setGender] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [RoleId, setRoleId] = useState("");
  const [Strength, setStrength] = useState("");
  const [ConfirmStrength, setConfirmStrength] = useState("");

  const handleChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setStrength(getStrength(newPassword));
  };

  const handleConfirmPasswordChange = (event) => {
    const newPassword = event.target.value;
    setConfirmPassword(newPassword);
    setConfirmStrength(getStrength(newPassword));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Id:", Id);
    console.log("DocumentType:", DocumentType);
    console.log("FirstName:", FirstName);
    console.log("LastName:", LastName);
    console.log("Address:", Address);
    console.log("Phone:", Phone);
    console.log("Email:", Email);
    console.log("Gender:", Gender);
    console.log("Username:", Username);
    console.log("Password:", Password);
    console.log("ConfirmPassword:", ConfirmPassword);
    console.log("RoleId:", RoleId);
  };

  return (
    <div className="page bg-custom"> {/* Añadí la clase 'bg-primary' para el color de fondo */}
      <div className="login-card text-white">
        <img src={logo} alt="Logo" />
        <h2>Formulario de Registro</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input__wrapper">
            <input
              autoComplete="off"
              spellCheck="false"
              className="control"
              type="text"
              placeholder="Documento de Identificación"
              required
              value={Id}
              onChange={(e) => setId(e.target.value)}

            />
          </div>
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Tipo de documento"
            value={DocumentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Nombres"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Apellidos"
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Dirección"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Teléfono"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Género"
            value={Gender}
            onChange={(e) => setGender(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Nombre de usuario"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="text"
            placeholder="Role ID"
            value={RoleId}
            onChange={(e) => setRoleId(e.target.value)}
          />
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="Contraseña"
            value={Password}
            onChange={handleChange}
          />
          <div className={`bars ${Strength}`}>
            <div></div>
          </div>
          <div className="strength">{Strength && `${Strength} Password`}</div>
          <input
            autoComplete="off"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="Confirmar Contraseña"
            value={ConfirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <div className={`bars ${ConfirmStrength}`}>
            <div></div>
          </div>
          <div className="strength">{ConfirmStrength && `${ConfirmStrength} Confirm Password`}</div>

          <button className="control" type="submit">
            Regístrate
          </button>
        </form>
      </div>
    </div>
  );
};