import React from "react";
import AboutBackground from "../../img/Assets/Fondos/Fondo4.png";
import AboutBackground3 from "../../img/Assets/Fondos/Fondo5.png";
import AboutBackgroundImage from "../../img/Assets/Imagenes_Sistema/Servicios.png";
import "../../css/landing-page/Servicios.css"



const About = () => {
  return (
    <div className="section-container-servicios">
      <div className="background-image-container-servicios">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="section-image-container-servicios">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      {/* <div className="background-image-container-servicios2">
        <img src={AboutBackground} alt="" />
      </div> */}
      <div className="background-image-container-servicios3">
        <img src={AboutBackground3} alt="" />
      </div>
      <div className="section-text-container-servicios">
        <h1 className="primary-heading-servicios">
          Optimiza la administración de tus servicios para una experiencia superior
        </h1>
        <p className="primary-text-servicios">
          Gestiona los servicios ofrecidos con eficiencia, mejorando la calidad y control de las operaciones para una experiencia excelente
        </p>
        <div className="secondary-button-servicios">
          <button className="secondary-button-servicio">
            Empezar
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;