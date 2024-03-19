import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { RegistrationForm } from './components/PasswordStrength'; 

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RegistrationForm />
  </React.StrictMode>
);

reportWebVitals();
