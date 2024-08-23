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
import { AccountCircleRounded, Logout } from '@mui/icons-material';

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
    border: '2px solid #fff', // Opcional: borde blanco alrededor de la imagen
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

export default function NavBar({ open, handleDrawerOpen, Icon }) {
    const isAdmin = UserService.isAdmin();
    const isSalesPerson = UserService.isSalesPerson();
    const [dateTime, setDateTime] = useState(new Date());
    const { getCartItemCount } = useCart();
    const [cartVisible, setCartVisible] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
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

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                        <span className="material-symbols-outlined mr-5 p-overlay-badge" onClick={() => setCartVisible(true)}>
                            shopping_cart
                            <Badge value={getCartItemCount()} id='badge-shopping-car' severity="info"></Badge>
                        </span>
                    )}
                    <div className="datetime text-white" id="datetime">
                        {dateTime.toLocaleString()}
                    </div>
                </div>
                {isAuthenticated && profile && (
                    <>
                        <ProfileImage
                            src={(profile.user.image ? `data:${profile.user.imageType};base64,${profile.user.image}` : 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg')}
                            alt={`Imagen usuario ${profile.user.names}`}
                            onClick={handleProfileClick}
                        />
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
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </>
                )}
                <CartModal visible={cartVisible} onHide={() => setCartVisible(false)} />
            </Toolbar>
        </AppBar>
    );
}