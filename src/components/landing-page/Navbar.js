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
import "../../css/landing-page/Navbar.css"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate(); // Hook para redireccionar
  const menuOptions = [
    {
      text: "¿Quiénes somos?",
      icon: <HomeIcon />,
      onclick: (e) => {
        e.preventDefault();
        document.getElementById("desarrolladores").scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      text: "Preguntas Frecuentes",
      icon: <InfoIcon />,
      onclick: (e) => {
        e.preventDefault();
        document.getElementById("faqs-section").scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      text: "Atención al cliente",
      icon: <CommentRoundedIcon />,
      onclick: (e) => {
        e.preventDefault();
        document.getElementById("atencion-cliente").scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      text: "Contacto",
      icon: <PhoneRoundedIcon />,
      onclick: (e) => {
        e.preventDefault();
        document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
      }
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container" id="navbar">
        <div className="nav-logo-container">
          <img src={Logo} alt="Logo" className="navbar-logo-image" />
          <h1 className="navbar-title">FELYSOFT</h1>
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
              document.getElementById("faqs-section").scrollIntoView({ behavior: "smooth" });
            }}
          >
            Atención al cliente
          </a>
        </div>

        <button className="primary-button navbar-login-button" onClick={() => navigate("/login")}>Iniciar sesión</button>

        <div className="navbar-menu-container">
          <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
        </div>
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
              <ListItem key={item.text} disablePadding onClick={item.onclick}>
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
