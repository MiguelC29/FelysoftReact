import React from "react";
import BannerBackground from "../../img/Assets/Fondos/Fondo1.png";
import BannerImage from "../../img/Assets/Imagenes_Sistema/InvetarioProductos.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import "../../css/landing-page/Inventario.css"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Hook para redireccionar

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading-inventario">
            Digitaliza y optimiza la gestión de tu inventario sin complicaciones
          </h1>
          <p className="primary-text-inventario">
            Administra tu inventario con precisión y sin esfuerzo: controla existencias, evita faltantes y optimiza tu flujo de productos
          </p>
          <div className="secondary-button-inventario">
            <button className="secondary-button" onClick={() => navigate("/login")}>
              Empezar <FiArrowRight />{" "}
            </button>
          </div>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
