/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../img/Assets/Logo.svg";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import "../../css/landing-page/Navbar.css"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate(); // Hook para redireccionar
  const menuOptions = [
    {
      text: "AtencionCliente",
      icon: <HomeIcon />,
    },
    {
      text: "Ayuda",
      icon: <InfoIcon />,
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
    },
  ];
  return (
    <nav>
      <div className="nav-logo-container" id="navbar">
      <a  href="#"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("navbar").scrollIntoView({ behavior: "smooth" });
          }}>
            <img src={Logo} alt="Logo" />
        </a>
      </div>
      <div className="felysoft">
      <a  href="#"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("navbar").scrollIntoView({ behavior: "smooth" });
          }}>
            <h1>FELYSOFT</h1>
        </a>
      </div>

      <div className="navbar-links-container">
      <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("desarrolladores").scrollIntoView({ behavior: "smooth" });
          }}
        >
          ¿Quiénes somos?
        </a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("atencion-cliente").scrollIntoView({ behavior: "smooth" });
          }}
        >
          Atención al cliente
        </a>
        
        <button className="primary-button" onClick={() => navigate("/login")}>Iniciar sesión</button>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
