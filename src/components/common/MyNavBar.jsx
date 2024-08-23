import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../img/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from 'primereact/badge';
import { useCart } from '../CartContext';
import UserService from '../service/UserService';
import CartModal from '../data_tables/CartModal';
import { useAuth } from '../context/AuthProvider';
import { Divider, ListItemIcon } from '@mui/material';
import { AccountCircleRounded, Logout, NotificationsRounded, ShoppingCart } from '@mui/icons-material';

const drawerWidth = 240;

// Styled components
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

const LogoImage = styled('img')({
    marginRight: '10px',
    height: '40px',
    width: '40px',
    zIndex: 2000,
});

const ProfileImage = styled('img')({
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    border: '2px solid #18415c',
    cursor: 'pointer',
    marginLeft: '16px', // Espacio entre la imagen de perfil y el resto de los elementos
});

const Role = {
    ADMINISTRATOR: 'ADMINISTRADOR',
    SALESPERSON: 'VENDEDOR',
    FINANCIAL_MANAGER: 'ADMINISTRADOR FINANCIERO',
    INVENTORY_MANAGER: 'GERENTE DE INVENTARIO',
    CUSTOMER: 'CLIENTE',
}

// Estilo para el contenedor del menú de notificaciones
const NotificationMenuItem = styled(MenuItem)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

// Estilo para los íconos y el tiempo en el menú de notificaciones
const NotificationContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    justifyContent: 'space-between',
    width: '100%',
    marginRight: '8px',
});

const NotificationText = styled('span')({
    fontSize: '14px',
    marginRight: '8px',
});

const NotificationIcon = styled('span')({
    marginRight: '8px',
});

const NotificationTime = styled('span')({
    marginLeft: 'auto',
    color: 'grey',
    fontSize: '12px',
});

const BadgeStyled = styled(Badge)(({ theme }) => ({
    fontSize: '11px',
}));

export default function NavBar({ open, handleDrawerOpen, Icon }) {
    const isAdmin = UserService.isAdmin();
    const isSalesPerson = UserService.isSalesPerson();
    const [dateTime, setDateTime] = useState(new Date());
    const { getCartItemCount } = useCart();
    const [cartVisible, setCartVisible] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // Estado para notificaciones
    const openNotificationMenu = Boolean(notificationAnchorEl);
    const navigate = useNavigate();
    const { isAuthenticated, profile, logout } = useAuth(); // Usa el contexto de autenticación

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleLogout = (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del enlace
        setAnchorEl(null);
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
                navigate('/login');
            }
        });
    };

    return (
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
                        <span className="material-symbols-outlined mr-4 p-overlay-badge" onClick={() => setCartVisible(true)}>
                            <ShoppingCart fontSize='24px' />
                            <BadgeStyled value={getCartItemCount()} id='badge-shopping-car' severity="info" />
                        </span>
                    )}
                    <div className="datetime text-white" id="datetime">
                        {dateTime.toLocaleString()}
                    </div>
                </div>
                <IconButton
                    color="inherit"
                    onClick={handleNotificationClick}
                >
                    <span className="d-flex ms-auto material-symbols-outlined p-overlay-badge">
                        <NotificationsRounded fontSize='28px' />
                        <BadgeStyled value={4} severity="info" /> {/* Número de notificaciones */}
                    </span>
                </IconButton>
                {isAuthenticated && profile && (
                    <>
                        <ProfileImage
                            src={(profile.user.image ? `data:${profile.user.imageType};base64,${profile.user.image}` : 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg')}
                            alt={`Imagen usuario ${profile.user.names}`}
                            onClick={handleProfileClick}
                        />
                        {/* TODO: REVISAR QUE SI ACTUALIZO LA INFO DEL USUARIO NO SE REFLEJA EN EL PERFIL DEL NAVBAR */}
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                        >
                            <div className='text-center'>
                                <strong>{profile.user.user_name}</strong>
                                <p>{Role[profile.user.role]}</p>
                            </div>
                            <Divider />
                            <MenuItem onClick={handleMenuClose}>
                                <ListItemIcon>
                                    <AccountCircleRounded fontSize="medium" />
                                </ListItemIcon>
                                <Link to="/perfil" className="text-decoration-none">Perfil</Link>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="medium" />
                                </ListItemIcon>
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </>
                )}
                <CartModal visible={cartVisible} onHide={() => setCartVisible(false)} />
                {/* Aquí puedes agregar el menú de notificaciones si lo necesitas */}
                <Menu
                    anchorEl={notificationAnchorEl}
                    open={openNotificationMenu}
                    onClose={handleNotificationMenuClose}
                >
                    <NotificationMenuItem onClick={handleNotificationMenuClose}>
                        <NotificationContent>
                            <NotificationIcon className="material-symbols-outlined">
                                trending_down
                            </NotificationIcon>
                            <NotificationText>Stock bajo del Producto <strong>Oreo</strong></NotificationText>
                            <NotificationTime>3 mins</NotificationTime>
                        </NotificationContent>
                    </NotificationMenuItem>
                    <Divider />
                    <NotificationMenuItem onClick={handleNotificationMenuClose}>
                        <NotificationContent>
                            <NotificationIcon className="material-symbols-outlined">
                                event_busy
                            </NotificationIcon>
                            <NotificationText>El producto <strong>Oreo</strong> esta próximo a vencerse</NotificationText>
                            <NotificationTime>12 hrs</NotificationTime>
                        </NotificationContent>
                    </NotificationMenuItem>
                    <Divider />
                    <NotificationMenuItem onClick={handleNotificationMenuClose}>
                        <NotificationContent>
                            <NotificationIcon className="material-symbols-outlined">
                                trending_down
                            </NotificationIcon>
                            <NotificationText>Stock bajo del Producto <strong>Gansito</strong></NotificationText>
                            <NotificationTime>2 días</NotificationTime>
                        </NotificationContent>
                    </NotificationMenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}