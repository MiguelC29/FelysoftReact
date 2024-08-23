import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import { Badge } from 'primereact/badge';
import { useCart } from '../CartContext';
import UserService from '../service/UserService';
import CartModal from '../data_tables/CartModal';

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

export default function NavBar({ open, handleDrawerOpen, Icon }) {
    const isAdmin = UserService.isAdmin();
    const isSalesPerson = UserService.isSalesPerson();
    const [dateTime, setDateTime] = useState(new Date());
    const { getCartItemCount } = useCart();
    const [cartVisible, setCartVisible] = React.useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

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
                    <div className="datetime text-white" id="datetime">{dateTime.toLocaleString()}</div>
                </div>
                <CartModal visible={cartVisible} onHide={() => setCartVisible(false)} />
            </Toolbar>
        </AppBar>
    );
}