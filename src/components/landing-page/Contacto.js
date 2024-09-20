import React from "react";
import "../../css/landing-page/Contacto.css"


const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      <h1 className="primary-heading-contacto">¿Tienes preguntas?</h1>
      <p className="primary-text-contacto">
        Deja tus datos y nos pondremos en contacto contigo, buen día.
      </p>

      <div className="input-email">
        <input type="text" placeholder="juanito@gmail.com" />
      </div>
      <div className="preguntas">
        <input type="text" placeholder="Hola, tengo una pregunta..." />
        <button className="secondary-button-contacto">Enviar</button>
      </div>
      
      
    </div>
  );
};

export default Contact;
