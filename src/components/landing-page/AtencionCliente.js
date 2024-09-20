import React from "react";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import "../../css/landing-page/AtencionCliente.css"
import { Splitter, SplitterPanel } from 'primereact/splitter';

const Footer = () => {
  return (
    <div className="page-wrapper-atencion" id="atencion-cliente">
      <h1 className="primary-heading-atencion">Atención al cliente</h1>

      <div className="info-sections-atencion">
        <Splitter style={{ height: '175px', width: '1300px' }}>
          <SplitterPanel className="flex align-items-center justify-content-center">

            <h3 className="horarios">Horarios de atención</h3>
            <div className="footer-section-horario-container">
              <div className="footer-section-columns-horario">
                <span>Lunes - Sábado</span>
              </div>
              <div className="footer-section-horario">
                <span> / 8am - 5pm</span>
              </div>
            </div>
          </SplitterPanel>

          <SplitterPanel className="flex align-items-center justify-content-center">
            <div className="contacto-section">
              <h3 className="contactos">Contacto</h3>
              <div className="footer-section-two">
                <div className="footer-section-labels">
                  <span>Teléfono</span>
                  <span>Email</span>
                  <span>Dirección</span>
                </div>
                <div className="footer-section-values">
                  <span>(+57) 319-697-8413</span>
                  <span>felysoft_atencionCliente@gmail.com</span>
                  <span>Calle 25 D Bis 96-58 (Bogotá - Colombia)</span>
                </div>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
      
      <div className="span-terms">
        <span>Términos y condiciones</span>
        <span>Politicas de privacidad</span>
        <span>&copy; Copyright 2024 - Todos los derechos reservados Felydan Technologies</span>
      </div>


      <div className="footer-icons">
        <BsTwitter />
        <SiLinkedin />
        <BsYoutube />
        <FaFacebookF />
      </div>

    </div>
  );
};

export default Footer;
