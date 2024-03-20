import React from 'react';
import ReactDOM from 'react-dom';
import './css/inicioSesion.css'; 
import reportWebVitals from './reportWebVitals';
import { InicioSesion } from './componets/IniciarSesion';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <InicioSesion/>
  </React.StrictMode>
);
reportWebVitals();
