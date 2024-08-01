import React from 'react';
import { Link } from 'react-router-dom';
import './../../css/Error404.css';

const Error404 = () => {
  const handleClick = () => {
    console.log('Button clicked');
  };
  return (
    <div className="container-404 container-star">
      {Array(30).fill().map((_, i) => (
        <div key={i} className="star-1"></div>
      ))}
      {Array(15).fill().map((_, i) => (
        <div key={i + 30} className="star-2"></div>
      ))}
      <div className="container-title">
        <div className="title">
          <div className="number">4</div>
          <div className="moon">
            <div className="face">
              <div className="mouth"></div>
              <div className="eyes">
                <div className="eye-left"></div>
                <div className="eye-right"></div>
              </div>
            </div>
          </div>
          <div className="number">4</div>
        </div>
        <div className="subtitle">Lamentamos informarte que el archivo no ha sido encontrado</div>
        <Link to="/perfil">
          <button className="btn-volver" onClick={handleClick}>Volver</button>
        </Link>
      </div>
    </div>
  );
};

export default Error404;
