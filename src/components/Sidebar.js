/*Code by: frontend-joe
https://github.com/frontend-joe/react-components/tree/main/src/components/sidebars */

import { useRef, useState } from "react";
import "../css/sidebar.css";

const menuItems = [
    {
        name: "Inicio",
        icon: "home",
    },
    {
        name: "Almacen",
        icon: "inventory_2",
        items: ["Servicios", "Productos", "Categorías", "Libros", "Autores", "Géneros", "Clientes"],
    },
    {
        name: "Venta",
        icon: "shopping_cart",
        items: ["Carrito de Compras", "Gastos", "Ingresos", "Pagos"],
    },
    {
        name: "Compras",
        icon: "local_shipping",
        items: ["Consultar Compras", "Proveedores"],
    },
    {
        name: "Reservas",
        icon: "event_available",
        items: ["Reservas Libros", "Reserva Servicios"],
    },
    {
        name: "Inventario",
        icon: "deployed_code",
        items: ["Productos", "Libros Digitales"],
    },
    {
        name: "Dashboard",
        icon: "monitoring",
    },
    {
        name: "Usuarios",
        icon: "group",
    },
    {
        name: "Configuración",
        icon: "settings",
        // items: ["Display", "Editor", "Theme", "Interface"],
    },
    {
        name: "Cerrar sesión",
        icon: "logout",
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
        <div class="user">
            <img src="https://i.postimg.cc/HLH1VGmw/user.png" alt="Foto de perfil"></img>
            <div class="name">
                <h5>GAES 3</h5>
                <span>Admin</span>
            </div>
        </div>
    </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav }) => (
    <button
        type="button"
        onClick={() => onClick(name)}
        className={isActive ? "active" : ""}
    >
        {icon && <Icon icon={icon} />}
        <span>{name}</span>
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
                        name={subItem}
                        isActive={activeItem === subItem}
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