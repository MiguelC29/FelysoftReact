import React from "react";
import ProfileMiguel from "../../img/Assets/Desarrolladores/Miguel.png";
import ProfileYully from "../../img/Assets/Desarrolladores/Yully.png";
import ProfileJhon from "../../img/Assets/Desarrolladores/Jhon.png";
import ProfileSantiago from "../../img/Assets/Desarrolladores/Santiago.png";
import { AiFillStar } from "react-icons/ai";
import { Carousel } from 'primereact/carousel';
import "../../css/landing-page/Desarrolladores.css"

const developers = [
  {
    imgSrc: ProfileMiguel,
    text: "Miguel creó el módulo de Inventario, optimizando el seguimiento de existencias y la toma de decisiones con una herramienta robusta y en tiempo real.",
    name: "Miguel Casallas"
  },
  {
    imgSrc: ProfileJhon,
    text: `Jhon desarrolló el módulo de Ingresos, ofreciendo una solución dinámica para la gestión financiera que facilita el registro y análisis de cada transacción con gran precisión.`,
    name: "Jhon Abril"
  },
  {
    imgSrc: ProfileYully,
    text: "Yully diseñó el módulo de Reserva de Libros Digitales, ofreciendo una solución intuitiva para la gestión de préstamos digitales y mejorando la experiencia de lectura.",
    name: "Yully Soto"
  }, {
    imgSrc: ProfileSantiago,
    text: "Santiago desarrolló el módulo de Servicios, proporcionando una plataforma eficaz para la administración de servicios con una estructura clara y accesible.",
    name: "Santiago Mahecha"
  }
];

const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
];

const itemTemplate = (item) => {
  return (
    <div className="testimonial-section-bottom">
      <img src={item.imgSrc} alt="Profile" className="testimonial-image" />
      <p className="testimonial-text">
        {item.text}
      </p>
      <div className="testimonials-stars-container">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
      </div>
      <h2 className="testimonial-name">{item.name}</h2>
    </div>
  );
};

const Testimonial = () => {
  return (
    <div className="work-section-wrapper" id="desarrolladores">
      <div className="work-section-top">
        <h1 className="primary-heading-desarrolladores">Desarrolladores</h1>
      </div>
      <Carousel
        value={developers}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        className="custom-carousel"
        circular
        autoplayInterval={3500}
        itemTemplate={itemTemplate}
      />
      <hr className="separator-line" />
    </div>
    
  );
};

export default Testimonial;