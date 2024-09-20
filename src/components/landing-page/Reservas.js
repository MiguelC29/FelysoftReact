import React from "react";
//import BannerBackground from "../Assets/Fondos/Fondo1.png";
import BannerImage from "../../img/Assets/Imagenes_Sistema/Reserva_Libros.png";
//import Navbar from "./Navbar";
//import { FiArrowRight } from "react-icons/fi";
import "../../css/landing-page/Reservas.css"

const Home = () => {
  return (
    <div className="reserva-banner-container">
      {/* <div className="reserva-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>  */}
      <div className="reserva-text-section">
        <h1 className="primary-heading-reservas">
          Simplifica la reserva de libros digitales con acceso inmediato
        </h1>
        {/* <p className="primary-text-reservas">
          Gestiona reservas de libros digitales de forma ágil, ofreciendo a tus clientes un acceso sencillo y directo a la lectura en los computadores del establecimiento
        </p>
        <button className="secondary-button">
          Empezar <FiArrowRight />{" "}
        </button> */}
      </div>
      <div className="reserva-image-section">
          <img src={BannerImage} alt="" />
        </div>
    </div>

  );
};

export default Home;
