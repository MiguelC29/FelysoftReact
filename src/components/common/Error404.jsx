import React from 'react';
import './Error404.css';

const Error404 = () => {
  return (
    <div className="container container-star">
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
        <a href="/principal/index.html">
          <button>Volver</button>
        </a>
      </div>
    </div>
  );
};

export default Error404;
