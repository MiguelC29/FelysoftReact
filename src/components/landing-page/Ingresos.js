import React from "react";
import AboutBackground from "../../img/Assets/Fondos/Fondo2.png";
import AboutBackgroundImage from "../../img/Assets/Imagenes_Sistema/Ingresos_estadisticas.png";
import "../../css/landing-page/Ingresos.css"
import { FiArrowLeft } from "react-icons/fi";


const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading-ingresos">
          Visión clara de tus finanzas, informes detallados para decisiones estratégicas
        </h1>
        <p className="primary-text-ingresos">
          Gestiona tus ingresos con datos financieros claros y accesibles: análisis profundos y reportes que facilitan la toma de decisiones
        </p>
        <div className="secondary-button-ingresos">
          <button className="secondary-button-ingreso">
          <FiArrowLeft />{" "} Empezar 
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
