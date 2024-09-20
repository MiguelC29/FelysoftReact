import React, { useState } from 'react'
import FaqSection from './FaqSection';

export default function Faqs() {

    const [activeTab, setActiveTab] = useState('Registro');

    // Datos de preguntas frecuentes por módulo
    const faqsData = {
        Registro: [
            {
                title: "¿Cómo registrarme?",
                description: "Para registrarte, haz clic en el botón de registro y completa el formulario.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            },
            {
                title: "¿Cómo iniciar sesión?",
                description: "Ingresa tu correo electrónico y contraseña para iniciar sesión.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            }
        ],
        Inventario: [
            {
                title: "¿Cómo agregar un nuevo producto al inventario?",
                description: "Sigue estos pasos para agregar productos...",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            },
            {
                title: "¿Cómo gestionar el stock de productos?",
                description: "Puedes gestionar el stock desde la sección de inventario.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            }
        ],
        Reservas: [
            {
                title: "¿Cómo reservar un libro digital?",
                description: "Para reservar un libro digital, sigue los pasos...",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            },
            {
                title: "¿Cómo cancelar una reserva?",
                description: "Puedes cancelar tu reserva desde la sección de 'Mis Reservas'.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            }
        ],
        Ingresos: [
            {
                title: "¿Cómo registrar una compra?",
                description: "Aquí te mostramos cómo registrar compras.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            },
            {
                title: "¿Cómo registrar una venta?",
                description: "Este video te guía a través del proceso de ventas.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            }
        ],
        Servicios: [
            {
                title: "¿Cómo registrar un servicio?",
                description: "Sigue estos pasos para registrar un nuevo servicio.",
                videoUrl: "https://www.youtube.com/embed/97xDc4DKwUE?si=yoY_NHnXz-MT0hJk"
            }
        ]
    };

    return (
        <div id="faqs">
            <h1 className='preguntas-container'>Preguntas Frecuentes</h1>
            <div className="faq-tabs">
                <div className="tabs">
                    {Object.keys(faqsData).map((tab) => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    <FaqSection faqs={faqsData[activeTab]} activeTab={activeTab} />
                </div>
            </div>
        </div>
    )
}