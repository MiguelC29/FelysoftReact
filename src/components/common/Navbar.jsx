import React from 'react'
import UserService from '../service/UserService'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    // const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();

    const handleLogout = (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del enlace
        const confirmDelete = window.confirm('Are you sure you want to logout this user?')
        if (confirmDelete) {
            // UserService.logout()
            logout();
        }
    }
  return (
    <nav>
        <ul>
            {!isAuthenticated && <li><Link to="/">Phegon Dev</Link></li>}
            {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}

            {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
            {isAdmin && <li><Link to="/inventory-product">Inventario</Link></li>}
            {isAdmin && <li><Link to="/products">Productos</Link></li>}
            {isAdmin && <li><Link to="/categories">Categorias</Link></li>}
            {isAdmin && <li><Link to="/providers">Proveedores</Link></li>}
            {isAdmin && <li><Link to="/services">Servicios</Link></li>}
            {isAdmin && <li><Link to="/typeServices">Tipo Servicio</Link></li>}
            {isAdmin && <li><Link to="/genres">Géneros</Link></li>}
            {isAdmin && <li><Link to="/authors">Autores</Link></li>}
            {isAdmin && <li><Link to="/books">Libros</Link></li>}
            {isAdmin && <li><Link to="/books-inventory">Inventario - Libros</Link></li>}
            {isAdmin && <li><Link to="/charges">Cargos</Link></li>}
            {isAdmin && <li><Link to="/employees">Empleados</Link></li>}
            {isAdmin && <li><Link to="/details">Detalles</Link></li>}
            {isAdmin && <li><Link to="/payments">Pagos</Link></li>}
            {isAdmin && <li><Link to="/expenses">Gastos</Link></li>}
            {isAdmin && <li><Link to="/sales">Ventas</Link></li>}
            {isAdmin && <li><Link to="/reserves">Reservas</Link></li>}
            {isAdmin && <li><Link to="/carrito">Carrito</Link></li>}
            {isAdmin && <li><Link to="/purchases">Compras</Link></li>}
            {isAdmin && <li><Link to="/carrito-prueba">Prueba</Link></li>}

            {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
        </ul>
    </nav>
  )
}
export default Navbar
