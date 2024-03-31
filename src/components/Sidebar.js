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
            {name: "Servicios", link: "/servicios"},
            {name: "Productos", link: "/productos"},
            {name: "Categorías", link: "/categorias"},
            {name: "Libros", link: "/libros"},
            {name: "Autores", link: "/autores"},
            {name: "Géneros", link: "/generos"},
            // {name: "Clientes", link: "/clients"},
        ]
    },
    {
        name: "Venta",
        icon: "shopping_cart",
        items: [
            {name: "Carrito de Compras", link: "/ventas"},
            {name: "Gastos", link: "/gastos"},
            {name: "Ingresos", link: "/ingresos"},
            {name: "Pagos", link: "/pagos"},
        ]
    },
    {
        name: "Compras",
        icon: "local_shipping",
        items: [
            {name: "Consultar Compras", link: "/compras"},
            {name: "Proveedores", link: "/proveedores"},
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
            {name: "Productos", link: "/inventarioProductos"},
            {name: "Libros Digitales", link: "inventarioLibros"},
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
        items: [
            {name: "Usuarios", link: "/usuarios"},
            {name: "Roles", link: "/roles"},
            {name: "Cargos", link: "/cargos"},
            {name: "Empleados", link: "/empleados"},
        ]
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

const NavHeader = ({ toggleSidebar }) => (
    <header className="sidebar-header">
        <button type="button" id="buttonsSide" onClick={toggleSidebar}>
            <Icon icon="menu" />
        </button>
        <div class="user">
            <img src="https://i.postimg.cc/HLH1VGmw/user.png" alt="Foto de perfil"></img>
            <div class="name">
                <h5>GAES 3</h5>
                <span>Admin</span>
            </div>
        </div>
    </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, link }) => (
    <button
        id="buttonsSide"
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

export const Sidebar = ({ expanded, toggleSidebar }) => {
    const [activeItem, setActiveItem] = useState("");

    const handleClick = (item) => {
        console.log("activeItem", activeItem);
        setActiveItem(item !== activeItem ? item : "");
    };

    return (
        <aside className={`sidebar ${expanded ? 'expanded' : 'reduced'}`}>
            <NavHeader toggleSidebar={toggleSidebar}/>
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