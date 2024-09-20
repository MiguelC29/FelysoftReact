import React, { useState } from 'react'
import FaqSection from './FaqSection';

export default function Faqs() {

    const [activeTab, setActiveTab] = useState('Gestión de Cuenta');

    // Datos de preguntas frecuentes por módulo
    const faqsData = {
        'Gestión de Cuenta': [
            {
                title: "¿Cómo registrar un nuevo usuario?",
                description: "En este video, te guiaremos a través del proceso de registro de un nuevo cliente en nuestra plataforma. Aprenderás cada paso necesario para completar tu registro de manera sencilla y efectiva, asegurando que tu información se ingrese correctamente. ¡Comencemos con tu registro!",
                videoUrl: "https://www.youtube.com/embed/Xi7lG4wYEPQ?si=hB5OkyhQp15_F8qs"
            },
            {
                title: "¿Cómo actualizar tu perfil de usuario?",
                description: "En este video, te proporcionaremos toda la información necesaria para actualizar tu perfil de cliente de manera exitosa. Te mostraremos, paso a paso, cómo modificar tus datos para que siempre estén al día. ¡Comencemos!",
                videoUrl: "https://www.youtube.com/embed/0J_oKTplxGo?si=O_auu5mo7Uro6vdX"
            },
            {
                title: "¿Cómo restablecer tu contraseña?",
                description: "En este video, te mostraremos cómo restablecer la contraseña de tu perfil de cliente de forma rápida y segura. A lo largo del tutorial, explicaremos el proceso paso a paso, desde la solicitud de un enlace de restablecimiento hasta la creación de una nueva contraseña que garantice la seguridad de tu cuenta. También abordaremos las mejores prácticas para elegir una contraseña segura y cómo mantener tu información personal protegida.¡Comencemos a asegurar tu cuenta!",
                videoUrl: "https://www.youtube.com/embed/3UTfvkfUg98?si=9TvSw0Kh8_B4ctcO"
            },
            {
                title: "¿Cómo cambiar tu contraseña?",
                description: "En este video, te mostraremos cómo cambiar la contraseña de tu cuenta. Recuerda que debes estar logueado para realizar este proceso. Te guiaremos paso a paso, desde la introducción de tu contraseña actual hasta la creación de una nueva. Además, compartiremos recomendaciones para elegir contraseñas seguras y mantener tu cuenta protegida. ¡Comencemos a actualizar tu contraseña!",
                videoUrl: "https://www.youtube.com/embed/_5D_Wo4ZMYY?si=MpMm7VsJ6XFBWC3e"
            }
        ],
        Inventario: [
            {
                title: "¿Cómo crear una marca, categoría y proveedor?",
                description: "En este video te mostramos paso a paso cómo crear una nueva marca, configurar categorías y registrar proveedores en el sistema. Además, aprenderás cómo asociar categorías con proveedores para una mejor gestión de tus productos.",
                videoUrl: "https://www.youtube.com/embed/yTwTe0dlf44?si=otBUlRFgk7tZyzvL"
            },
            {
                title: "¿Cómo registrar un nuevo producto?",
                description: "En este video te enseñamos cómo registrar un nuevo producto en la tabla de productos, aprovechando las marcas, categorías y proveedores previamente creados. Recuerda que, aunque el producto esté registrado, no se incluirá en el inventario hasta que se realice la compra correspondiente.",
                videoUrl: "https://www.youtube.com/embed/FtbddyCCV8M?si=deAzEi9yE7uHpIP8"
            },
            {
                title: "¿Cómo registrar un producto existente en el inventario?",
                description: "En este video te mostramos cómo registrar un producto que ya existe en el establecimiento. Al desmarcar la opción 'El producto es realmente nuevo', podrás ingresar el producto directamente en el inventario. Aprende a completar los campos necesarios para asegurarte de que el producto esté correctamente registrado y disponible en el sistema.",
                videoUrl: "https://www.youtube.com/embed/8QvMn5bRhBY?si=Zb7kDn0YkE1Aa0K2"
            }
        ],
        Reservas: [
            {
                title: "¿Cómo crear una editorial, un género y un autor, y cómo asociarlos?",
                description: "En este video aprenderás a crear una editorial, un autor y un género. Además, te mostraremos cómo asociar un autor con un género, lo que facilitará una gestión más efectiva de los libros.",
                videoUrl: "https://www.youtube.com/embed/KUiVgS9kmL8?si=08Vt-Z5dcwNfWnEF"
            },
            {
                title: "¿Cómo crear un libro?",
                description: "En este video aprenderás el proceso para crear un libro, asegurándote de que previamente se hayan creado una editorial, un género y un autor, así como las asociaciones necesarias entre ellos. Recuerda que el libro no aparecerá en el inventario hasta que se realice la compra correspondiente.",
                videoUrl: "https://www.youtube.com/embed/nD638tIZiR4?si=vma1G_N4TtrYwtIo" 
            },
            {
                title: "¿Cómo gestionar mis reservas?",
                description: "En este video aprenderás a crear una reserva digital de un libro, a consultar tu historial de reservas y a cancelar aquellas que ya no quieras. Descubre cómo manejar eficientemente tus reservas para una mejor experiencia.",
                videoUrl: "https://www.youtube.com/embed/wYMFfo_y1Ho?si=RQuPRFUKYfsY4UBn"
            }
        ],
        Ingresos: [ 
            {
                title: "¿Cómo registrar la compra de productos nuevos?",
                description: "En este video, te mostraremos cómo crear una compra de productos nuevos de manera sencilla y efectiva. A lo largo del tutorial, verás el proceso completo para completar todos los campos requeridos, asegurándote de que cada detalle sea ingresado correctamente. Aprenderás a seleccionar productos, verificar precios y gestionar cantidades, todo lo necesario para realizar una compra exitosa. ¡Comencemos a aprovechar al máximo esta experiencia!",
                videoUrl: "https://www.youtube.com/embed/e2dK5U2syXA?si=mENJiE-gPgLAYHmv"
            },
            {
                title: "¿Cómo realizar una venta?",
                description: "En este video, abordaremos el proceso de realizar una venta en nuestra plataforma. Es fundamental recordar que, para completar una venta, es necesario contar con productos en el inventario que hayan sido comprados previamente. A lo largo del tutorial, te mostraremos cómo registrar de manera efectiva todos los campos solicitados para garantizar un proceso de venta fluido y exitoso. Verás el paso a paso del ingreso de datos, la verificación de productos disponibles y la confirmación de la transacción.s ventas. ¡Vamos a empezar!",
                videoUrl: "https://www.youtube.com/embed/PbIabkislx0?si=r2lrcwA1PiLdG8BG"
            }
        ],
        Servicios: [
            {
                title: "¿Cómo crear un tipo de servicio y un servicio?",
                description: "En este video, aprenderás a crear un tipo de servicio y, a partir de ello, a registrar un servicio específico en nuestra plataforma. Te guiaremos paso a paso en el proceso, desde la configuración inicial del tipo de servicio hasta la creación del servicio en sí. Al finalizar, tendrás un tipo de servicio y un servicio listos para ser utilizados. ¡Comencemos a optimizar tus servicios!",
                videoUrl: "https://www.youtube.com/embed/fJL_f6bwLZQ?si=VXBBLU-wcinpKUnc"
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