import React from 'react'
import "../../css/landing-page/AppLanding.css";
import Inventario from "./Inventario";
import Ingresos from "./Ingresos";
import Reservas from "./Reservas";
import Servicios from "./Servicios";
import Desarrolladores from "./Desarrolladores";
import Contacto from "./Contacto";
import AtencionCliente from "./AtencionCliente";
import Faqs from './Faqs';

export default function LandingPage() {
  return (
    <div>
      <Inventario />
      <Ingresos />
      <Reservas />
      <Servicios />
      <Desarrolladores />
      <Contacto />
      <Faqs />
      <AtencionCliente />
    </div>
  )
}
