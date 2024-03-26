/*Code by: frontend-joe
https://github.com/frontend-joe/react-components/tree/main/src/components/sidebars */

import { useRef, useState } from "react";
import "../css/sidebar.css";
import { Link } from "react-router-dom";

const menuItems = [
    {
        name: "Inicio",
        icon: "home",
        link: "/"
    },
    {
        name: "Almacen",
        icon: "inventory_2",
        items: [
            {name: "Servicios", link: "/services"},
            {name: "Productos", link: "/products"},
            {name: "Categorías", link: "/categories"},
            {name: "Libros", link: "/books"},
            {name: "Autores", link: "/authors"},
            {name: "Géneros", link: "/genres"},
            {name: "Clientes", link: "/clients"},
        ]
    },
    {
        name: "Venta",
        icon: "shopping_cart",
        items: [
            {name: "Carrito de Compras", link: "/sales"},
            {name: "Gastos", link: "/expenses"},
            {name: "Ingresos", link: "/categories"},
            {name: "Pagos", link: "/payments"},
        ]
    },
    {
        name: "Compras",
        icon: "local_shipping",
        items: [
            {name: "Consultar Compras", link: "/purchases"},
            {name: "Proveedores", link: "/providers"},
        ]
    },
    {
        name: "Reservas",
        icon: "event_available",
        items: [
            {name: "Reservas Libros", link: ""},
            {name: "Reserva Servicios", link: ""},
        ]
    },
    {
        name: "Inventario",
        icon: "deployed_code",
        items: [
            {name: "Productos", link: ""},
            {name: "Libros Digitales", link: ""},
        ]
    },
    {
        name: "Dashboard",
        icon: "monitoring",
        link: "",
    },
    {
        name: "Usuarios",
        icon: "group",
        link: "/users",
    },
    {
        name: "Configuración",
        icon: "settings",
        link: "",
        // items: ["Display", "Editor", "Theme", "Interface"],
    },
    {
        name: "Cerrar sesión",
        icon: "logout",
        link: "",
    },
];

const Icon = ({ icon }) => (
    <span className="material-symbols-outlined">{icon}</span>
);

const NavHeader = () => (
    <header className="sidebar-header">
        <button type="button">
            <Icon icon="menu" />
        </button>
    </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, link }) => (
    <button
        type="button"
        onClick={() => onClick(name)}
        className={isActive ? "active" : ""}
    >
        {/* ----- */}
        {icon && <Icon icon={icon} />}
        <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>{name}</span>
        </Link>
        {hasSubNav && <Icon icon="expand_more" />}
    </button>
);

const SubMenu = ({ item, activeItem, handleClick }) => {
    const navRef = useRef(null);

    const isSubNavOpen = (item, items) =>
        items.some((i) => i === activeItem) || item === activeItem;

    return (
        <div
            className={`sub-nav ${isSubNavOpen(item.name, item.items) ? "open" : ""}`}
            style={{
                height: !isSubNavOpen(item.name, item.items)
                    ? 0
                    : navRef.current?.clientHeight,
            }}
        >
            <div ref={navRef} className="sub-nav-inner">
                {item?.items.map((subItem) => (
                    <NavButton
                        onClick={handleClick}
                        name={subItem.name}
                        isActive={activeItem === subItem.name}
                        link={subItem.link}
                    />
                ))}
            </div>
        </div>
    );
};

export const Sidebar = () => {
    const [activeItem, setActiveItem] = useState("");

    const handleClick = (item) => {
        console.log("activeItem", activeItem);
        setActiveItem(item !== activeItem ? item : "");
    };

    return (
        <aside className="sidebar">
            <NavHeader />
            {menuItems.map((item) => (
                <div>
                    {!item.items && (
                        <NavButton
                            onClick={handleClick}
                            name={item.name}
                            icon={item.icon}
                            isActive={activeItem === item.name}
                            hasSubNav={!!item.items}
                            link={item.link}
                        />
                    )}
                    {item.items && (
                        <>
                            <NavButton
                                onClick={handleClick}
                                name={item.name}
                                icon={item.icon}
                                isActive={activeItem === item.name}
                                hasSubNav={!!item.items}
                                link={item.link}
                            />
                            <SubMenu
                                activeItem={activeItem}
                                handleClick={handleClick}
                                item={item}
                            />
                        </>
                    )}
                </div>
            ))}
        </aside>
    );
};