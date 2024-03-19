import React, { useState } from "react";
import logo from "./logo.svg";
import "./styles.css";

export const RegistrationForm = () => { 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleConfirmarPasswordChange = (value) => {
    setPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("ConfirmarPassword:", password);

   
  };

  return (
    <div className="page">
      <div className="login-card">
        <img src={logo} alt="Logo" />
        <h2>Registro de Usuario</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="username">
            <input
              autoComplete="off"
              spellCheck="false"
              className="control"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <div id="spinner" className="spinner"></div>
          </div>
          <div className="username">
            <input
              autoComplete="off"
              spellCheck="false"
              className="control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <div id="spinner" className="spinner"></div>
          </div>
          <input
            name="password"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="Password"
            onChange={(event) => handlePasswordChange(event.target.value)}
          />

          <input
            name="ConfirmarPassword"
            spellCheck="false"
            className="control"
            type="password"
            placeholder="Confirm Password"
            onChange={(event) => handlePasswordChange(event.target.value)}
          />
          <button className="control" type="submit">
            Regístrate
          </button>
        </form>
      </div>
    </div>
  );
};

