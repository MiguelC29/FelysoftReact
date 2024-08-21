import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import { Badge } from 'primereact/badge';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthProvider';
import UserService from '../service/UserService';
import CartModal from '../data_tables/CartModal';
import Swal from 'sweetalert2';


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: '#19191a',
    // zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        zIndex: 100,
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const SubItemsWrapper = styled(Collapse)({
    paddingLeft: 40,
});

const ContentWrapper = styled('div')(({ theme, open }) => ({
    flexGrow: 1,
    marginLeft: open ? 0 : 0,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
}));

const LogoImage = styled('img')({
    marginRight: '10px',
    height: '40px',
    width: '40px',
    zIndex: 2000,
});

export default function MiniDrawer({ children }) {
    const { isAuthenticated, logout } = useAuth();
    const isAdmin = UserService.isAdmin();
    const isCustomer = UserService.isCustomer();
    const isSalesPerson = UserService.isSalesPerson();
    const isFinancialManager = UserService.isFinancialManager();
    const isInventoryManager = UserService.isInventoryManager();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [expandedItem, setExpandedItem] = React.useState('');
    const [dateTime, setDateTime] = useState(new Date());
    const { cartItems } = useCart();
    const { getCartItemCount } = useCart();
    const [cartVisible, setCartVisible] = React.useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del enlace
        const Swal = require('sweetalert2');
        Swal.fire({
            title: '¿Estás seguro que quieres salir?',
            icon: 'warning',
            showCancelButton: true, // Muestra el botón de cancelar
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#3085d6",
            ñcancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Llama a la función de logout para cerrar la sesión
                window.location.href = '/login'; // Redirige al usuario a la página de login o cualquier otra página
            }
        });
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setExpandedItem('');
    };

    const handleExpand = (itemName) => {
        if (open) {
            if (expandedItem === itemName) {
                setExpandedItem('');
            } else {
                setExpandedItem(itemName);
            }
        }
    };

    const Icon = ({ icon, textColor }) => (
        <span className={`material-symbols-outlined ${textColor}`} style={{ color: '#19191a' }}>{icon}</span>
    );

    const IconSubItems = () => (
        <span className="material-symbols-outlined text-black text-opacity-75">arrow_right_alt</span>
    );

    const menuItems = [
        {
            name: "Inicio",
            icon: <Icon icon='home' />,
            link: "/carrito",
            roles: ['ADMINISTRATOR', 'SALESPERSON'] // Roles permitidos
        },
        {
            name: "Almacen",
            icon: <Icon icon='inventory_2' />,
            items: [
                { name: "Productos", icon: <IconSubItems />, link: "/productos", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Categorías", icon: <IconSubItems />, link: "/categorias", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Categorías-Proveedores", icon: <IconSubItems />, link: "/categorias_proveedores", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Libros", icon: <IconSubItems />, link: "/libros", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Autores", icon: <IconSubItems />, link: "/autores", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Géneros", icon: <IconSubItems />, link: "/generos", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Tipo de Servicio", icon: <IconSubItems />, link: "/tiposervicios", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Servicios", icon: <IconSubItems />, link: "/servicios", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'SALESPERSON'] },
            ],
            roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'SALESPERSON']
        },
        {
            name: "Venta",
            icon: <Icon icon='shopping_cart' />,
            items: [
                { name: "Carrito", icon: <IconSubItems />, link: "/carrito", roles: ['ADMINISTRATOR', 'SALESPERSON'] },
                { name: "Gastos", icon: <IconSubItems />, link: "/gastos", roles: ['ADMINISTRATOR', 'FINANCIAL_MANAGER'] },
                { name: "Ventas", icon: <IconSubItems />, link: "/ventas", roles: ['ADMINISTRATOR', 'SALESPERSON'] },
                { name: "Pagos", icon: <IconSubItems />, link: "/pagos", roles: ['ADMINISTRATOR', 'SALESPERSON'] },
            ],
            roles: ['ADMINISTRATOR', 'SALESPERSON', 'FINANCIAL_MANAGER']
        },
        {
            name: "Compras",
            icon: <Icon icon='local_shipping' />,
            items: [
                { name: "Compras", icon: <IconSubItems />, link: "/compras", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'FINANCIAL_MANAGER'] },
                { name: "Proveedores", icon: <IconSubItems />, link: "/proveedores", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER'] },
                { name: "Detalles", icon: <IconSubItems />, link: "/detalles", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'FINANCIAL_MANAGER', 'SALESPERSON'] },
            ],
            roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'FINANCIAL_MANAGER', 'SALESPERSON']
        },
        {
            name: "Reservas",
            icon: <Icon icon='event_available' />,
            items: [
                { name: "Reservas Libros", icon: <IconSubItems />, link: "/reservas", roles: ['ADMINISTRATOR', 'SALESPERSON'] },
                { name: "Reserva Servicios", icon: <IconSubItems />, link: "", roles: ['ADMINISTRATOR', 'SALESPERSON'] },
            ],
            roles: ['ADMINISTRATOR', 'SALESPERSON']
        },
        {
            name: "Inventario",
            icon: <Icon icon='deployed_code' />,
            items: [
                { name: "Productos", icon: <IconSubItems />, link: "/inventarioProductos", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'SALESPERSON'] },
                { name: "Libros Digitales", icon: <IconSubItems />, link: "/inventarioLibros", roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'SALESPERSON'] },
            ],
            roles: ['ADMINISTRATOR', 'INVENTORY_MANAGER', 'SALESPERSON']
        },
        {
            name: "Tablero",
            icon: <Icon icon='monitoring' />,
            link: "",
            roles: ['ADMINISTRATOR', 'FINANCIAL_MANAGER']
        },
        {
            name: "Personas",
            icon: <Icon icon='group' />,
            items: [
                { name: "Usuarios", icon: <IconSubItems />, link: "/usuarios", roles: ['ADMINISTRATOR'] },
                // { name: "Roles", icon: <IconSubItems />, link: "/roles", roles: ['ADMINISTRATOR'] },
                { name: "Cargos", icon: <IconSubItems />, link: "/cargos", roles: ['ADMINISTRATOR'] },
                { name: "Empleados", icon: <IconSubItems />, link: "/empleados", roles: ['ADMINISTRATOR'] },
            ],
            roles: ['ADMINISTRATOR']
        },
        {
            name: "Configuración",
            icon: <Icon icon='settings' />,
            link: "",
            roles: ['ADMINISTRATOR']
        },
        {
            name: "Perfil",
            icon: <Icon icon='person' />,
            link: "/perfil",
            roles: ['ADMINISTRATOR', 'CUSTOMER', 'FINANCIAL_MANAGER', 'INVENTORY_MANAGER', 'SALESPERSON']
        },
        {
            name: "Cerrar sesión",
            icon: <Icon icon='logout' />,
            link: "/",
            onClick: handleLogout,
            roles: ['ADMINISTRATOR', 'CUSTOMER', 'FINANCIAL_MANAGER', 'INVENTORY_MANAGER', 'SALESPERSON']
        },
    ];

    // SI NO ESTA AUTENTICADO NO SE MUESTRA EL SIDEBAR
    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex' }}>
                <ContentWrapper open={false}>
                    {children}
                </ContentWrapper>
            </Box>
        );
    }

    const userRole = isAdmin ? 'ADMINISTRATOR'
        : isCustomer ? 'CUSTOMER'
            : isSalesPerson ? 'SALESPERSON'
                : isFinancialManager ? 'FINANCIAL_MANAGER'
                    : isInventoryManager ? 'INVENTORY_MANAGER'
                        : '';

    // Filtrar elementos del menú según el rol
    const filteredMenuItems = menuItems.filter(item =>
        item.roles ? item.roles.includes(userRole) : true
    ).map(item => ({
        ...item,
        items: item.items ? item.items.filter(subItem => subItem.roles ? subItem.roles.includes(userRole) : true) : []
    }));

    const CustomLink = styled(Link)({
        textDecoration: 'none',
        color: 'inherit',
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <Icon icon={'menu'} textColor={'text-white'} />
                    </IconButton>
                    <LogoImage src={logo} alt="Logo FELYSOFT" />
                    {!open && <Typography variant="h6" noWrap component="div">
                        <Link to={'/inventarioProductos'} className='text-white text-decoration-none'>FELYSOFT</Link>
                    </Typography>}
                    <div className='d-flex align-items-end ms-auto'>
                        {(isAdmin || isSalesPerson) && (
                            <span className="material-symbols-outlined mr-5 p-overlay-badge" onClick={() => setCartVisible(true)}>
                                shopping_cart
                                <Badge value={getCartItemCount()} id='badge-shopping-car' severity="info"></Badge>
                            </span>
                        )}
                        <div className="datetime text-white" id="datetime">{dateTime.toLocaleString()}</div>
                    </div>
                    <CartModal visible={cartVisible} onHide={() => setCartVisible(false)} />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader className='text-white' style={{ background: '#323232' }}>
                    <Typography variant="h6" noWrap component="div" className='mr-6'>
                        FELYSOFT
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <Icon icon={'chevron_right'} textColor={'text-white'} /> : <Icon icon={'chevron_left'} textColor={'text-white'} />}
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
                <List className='mt-4'>
                    {filteredMenuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem disablePadding component={CustomLink} to={item.link}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2,
                                        py: 2.5,
                                        marginLeft: 3.5,
                                    }}
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            item.onClick(e); // Manejar el clic para cerrar sesión
                                        } else {
                                            if (item.items) {
                                                handleExpand(item.name);
                                            } else if (item.link) {
                                                window.location.href = item.link; // Navegar a la URL del enlace
                                            }
                                        }
                                    }}
                                // href={item.link}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {item.items && item.items.length > 0 && open && (
                                        <IconButton
                                            sx={{
                                                ml: 'auto',
                                            }}
                                        >
                                            {<Icon icon='expand_more' />}
                                        </IconButton>
                                    )}
                                </ListItemButton>
                            </ListItem>
                            {item.items && item.items.length > 0 && (
                                <SubItemsWrapper in={expandedItem === item.name} timeout="auto" unmountOnExit>
                                    {item.items.map((subItem, subIndex) => (
                                        <ListItem key={subIndex} disablePadding component={CustomLink} to={subItem.link}>
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                    marginLeft: 0.1,
                                                }}
                                                component="a"
                                                href={subItem.link}
                                            >
                                                <ListItemIcon>
                                                    {subItem.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={subItem.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </SubItemsWrapper>
                            )}
                        </React.Fragment>
                    ))}
                </List>
                <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
            </Drawer>
            <ContentWrapper open={open}>
                {children}
            </ContentWrapper>
        </Box>
    );
}
