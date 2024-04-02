import React from 'react';
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
import logo from '../img/logo.png';

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
    backgroundColor: 'black',
    zIndex: theme.zIndex.drawer + 1,
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
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [expandedItem, setExpandedItem] = React.useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setExpandedItem('');
    };

    const handleExpand = (itemName) => {
        if (expandedItem === itemName) {
            setExpandedItem('');
        } else {
            setExpandedItem(itemName);
        }
    };

    const Icon = ({ icon, textColor='text-black' }) => (
        <span className={`material-symbols-outlined ${textColor}`}>{icon}</span>
    );

    const IconSubItems = () => (
        <span className="material-symbols-outlined text-black text-opacity-75">arrow_right_alt</span>
    );

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
                    <LogoImage src={logo} alt="" />
                    {!open && <Typography variant="h6" noWrap component="div">
                        FELYSOFT
                    </Typography>}
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader className='bg-dark text-white'>
                <Typography variant="h6" noWrap component="div" className='mr-6'>
                    FELYSOFT
                </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <Icon icon={'chevron_right'} textColor={'text-white'}/> : <Icon icon={'chevron_left'} textColor={'text-white'}/>}
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
                <List className = 'mt-4'>
                    {[
                        {
                            name: "Inicio",
                            icon: <Icon icon='home' />,
                            link: "/",
                        },
                        {
                            name: "Almacen",
                            icon: <Icon icon='inventory_2' />,
                            items: [

                                { name: "Productos", icon: <IconSubItems />, link: "/productos" },
                                { name: "Categorías", icon: <IconSubItems />, link: "/categorias" },
                                { name: "Libros", icon: <IconSubItems />, link: "/libros" },
                                { name: "Autores", icon: <IconSubItems />, link: "/autores" },
                                { name: "Géneros", icon: <IconSubItems />, link: "/generos" },
                                { name: "Tipo de Servicio", icon: <IconSubItems />, link: "/tiposervicios" },
                                { name: "Servicios", icon: <IconSubItems />, link: "/servicios" },
                            ]
                        },
                        {
                            name: "Venta",
                            icon: <Icon icon='shopping_cart' />,
                            items: [
                                { name: "Carrito", icon: <IconSubItems />, link: "/santi" },
                                { name: "Gastos", icon: <IconSubItems />, link: "/gastos" },
                                { name: "Ventas", icon: <IconSubItems />, link: "/ventas" },
                                { name: "Pagos", icon: <IconSubItems />, link: "/pagos" },
                            ]
                        },
                        {
                            name: "Compras",
                            icon: <Icon icon='local_shipping' />,
                            items: [
                                { name: "Compras", icon: <IconSubItems />, link: "/compras" },
                                { name: "Proveedores", icon: <IconSubItems />, link: "/proveedores" },
                            ]
                        },
                        {
                            name: "Reservas",
                            icon: <Icon icon='event_available' />,
                            items: [
                                { name: "Reservas Libros", icon: <IconSubItems />, link: "/reservas" },
                                { name: "Reserva Servicios", icon: <IconSubItems />, link: "" },
                            ]
                        },
                        {
                            name: "Inventario",
                            icon: <Icon icon='deployed_code' />,
                            items: [
                                { name: "Productos", icon: <IconSubItems />, link: "/inventarioProductos" },
                                { name: "Libros Digitales", icon: <IconSubItems />, link: "/inventarioLibros" },
                            ]
                        },
                        {
                            name: "Dashboard",
                            icon: <Icon icon='monitoring' />,
                            link: "",
                        },
                        {
                            name: "Personas",
                            icon: <Icon icon='group' />,
                            items: [
                                { name: "Usuarios", icon: <IconSubItems />, link: "/usuarios" },
                                { name: "Roles", icon: <IconSubItems />, link: "/roles" },
                                { name: "Cargos", icon: <IconSubItems />, link: "/cargos" },
                                { name: "Empleados", icon: <IconSubItems />, link: "/empleados" },
                            ]
                        },
                        {
                            name: "Configuración",
                            icon: <Icon icon='settings' />,
                            link: "",
                        },
                        {
                            name: "Cerrar sesión",
                            icon: <Icon icon='logout' />,
                            link: "/registroUsuario",
                        },
                    ].map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2,
                                        py: 2.5,
                                        marginLeft: 3.5,
                                    }}
                                    onClick={() => item.items && handleExpand(item.name)}
                                    href={item.link}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {item.items && open && (
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
                            {item.items && (
                                <SubItemsWrapper in={expandedItem === item.name} timeout="auto" unmountOnExit>
                                    {item.items.map((subItem, subIndex) => (
                                        <ListItem key={subIndex} disablePadding>
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
