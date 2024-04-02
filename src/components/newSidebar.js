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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
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
                        <MenuIcon />
                    </IconButton>
                    <LogoImage src={logo} alt="" />
                    <Typography variant="h6" noWrap component="div">
                        FELYSOFT
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {[
                        {
                            name: "Inicio",
                            icon: <HomeIcon />,
                            link: "/",
                        },
                        {
                            name: "Almacen",
                            icon: <StoreIcon />,
                            items: [
                                { name: "Productos", icon: <LibraryBooksIcon />, link: "/productos" },
                                { name: "Categorías", icon: <CategoryIcon />, link: "/categorias" },
                                { name: "Libros", icon: <LibraryBooksIcon />, link: "/libros" },
                                { name: "Autores", icon: <EmojiObjectsIcon />, link: "/autores" },
                                { name: "Géneros", icon: <CategoryIcon />, link: "/generos" },
                                { name: "Tipo de Servicio", icon: <AssessmentIcon />, link: "/tiposervicios" },
                                { name: "Servicios", icon: <AssessmentIcon />, link: "/servicios" },
                            ]
                        },
                        {
                            name: "Venta",
                            icon: <ShoppingCartIcon />,
                            items: [
                                { name: "Carrito", icon: <ShoppingCartIcon />, link: "/santi" },
                                { name: "Gastos", icon: <AssessmentIcon />, link: "/gastos" },
                                { name: "Ventas", icon: <AssessmentIcon />, link: "/ventas" },
                                { name: "Pagos", icon: <AssessmentIcon />, link: "/pagos" },
                            ]
                        },
                        {
                            name: "Compras",
                            icon: <LocalShippingIcon />,
                            items: [
                                { name: "Compras", icon: <AssessmentIcon />, link: "/compras" },
                                { name: "Proveedores", icon: <AssessmentIcon />, link: "/proveedores" },
                            ]
                        },
                        {
                            name: "Reservas",
                            icon: <EventAvailableIcon />,
                            items: [
                                { name: "Reservas Libros", icon: <LibraryBooksIcon />, link: "/reservas" },
                                { name: "Reserva Servicios", icon: <AssessmentIcon />, link: "" },
                            ]
                        },
                        {
                            name: "Inventario",
                            icon: <AssessmentIcon />,
                            items: [
                                { name: "Productos", icon: <LibraryBooksIcon />, link: "/inventarioProductos" },
                                { name: "Libros Digitales", icon: <LibraryBooksIcon />, link: "inventarioLibros" },
                            ]
                        },
                        {
                            name: "Dashboard",
                            icon: <AssessmentIcon />,
                            link: "",
                        },
                        {
                            name: "Personas",
                            icon: <GroupIcon />,
                            items: [
                                { name: "Usuarios", icon: <AssessmentIcon />, link: "/usuarios" },
                                { name: "Roles", icon: <AssessmentIcon />, link: "/roles" },
                                { name: "Cargos", icon: <AssessmentIcon />, link: "/cargos" },
                                { name: "Empleados", icon: <AssessmentIcon />, link: "/empleados" },
                            ]
                        },
                        {
                            name: "Configuración",
                            icon: <SettingsIcon />,
                            link: "",
                        },
                        {
                            name: "Cerrar sesión",
                            icon: <LogoutIcon />,
                            link: "/registroUsuario",
                        },
                    ].map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        marginLeft: 3.5,
                                    }}
                                    onClick={() => item.items && handleExpand(item.name)}
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
                                            <ExpandMoreIcon />
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
                <Divider />
            </Drawer>
            <ContentWrapper open={open}>
                {children}
            </ContentWrapper>
        </Box>
    );
}
