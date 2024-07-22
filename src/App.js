import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewRoles from './pages/ViewRoles';
import ViewUsers from './pages/ViewUsers';
import ViewProviders from './pages/ViewProviders';
import ViewProductInventory from './pages/ViewProductInventory';

//gastos e ingresos
import ViewExpenses from './pages/ViewExpenses';
import ViewPurchases from './pages/ViewPurchases';
import ViewSales from './pages/ViewSales';
import ViewPayments from './pages/ViewPayments';
import ViewDetails from './pages/ViewDetails';


import ViewTypeservices from './pages/ViewTypeservices';
import ViewServices from './pages/ViewServices';
import ViewEmployees from './pages/ViewEmployees';
import ViewCharges from './pages/ViewCharges';

import PasswordStrength from './components/PasswordStrength';
import ViewBooks from './pages/ViewBooks';
import ViewReserves from './pages/ViewReserves';
import ViewAuthors from './pages/ViewAuthors';
import ViewGenres from './pages/ViewGenres';
import { InicioSesion } from './components/IniciarSesion';
import ViewBooksInventory from './pages/ViewBooksInventory';
import ViewCarrito from './pages/ViewCarrito';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import ProfilePage from './components/userspage/ProfilePage'
import UpdateUser from './components/userspage/UpdateUser'
import UserManagementPage from './components/userspage/UserManagementPage'
import UserService from './components/service/UserService';
import { useAuth } from './components/context/AuthProvider';

export default function App() {
  const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };
  
  const AdminRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated && UserService.isAdmin() ? element : <Navigate to="/login" replace />;
  };

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<InicioSesion />} />
    //     <Route path='/categorias' element={<ViewCategories />} />
    //     <Route path='/roles' element={<ViewRoles />} />
    //     <Route path='/productos' element={<ViewProducts />} />
    //     <Route path='/usuarios' element={<ViewUsers />} />
    //     <Route path='/proveedores' element={<ViewProviders />} />
    //     <Route path='/inventarioProductos' element={<ViewProductInventory />} />
    //     <Route path='/inventarioLibros' element={<ViewBooksInventory />} />
    //     <Route path='/tiposervicios' element={<ViewTypeservices />} />
    //     <Route path='/servicios' element={<ViewServices />} />
    //     <Route path='/empleados' element={<ViewEmployees />} />
    //     <Route path='/cargos' element={<ViewCharges />} />
    //     <Route path='/gastos' element={<ViewExpenses />} />
    //     <Route path='/compras' element={<ViewPurchases />} />
    //     <Route path='/ventas' element={<ViewSales />} />
    //     <Route path='/pagos' element={<ViewPayments />} />
    //     <Route path='/detalles' element={<ViewDetails />} />
    //     <Route path='/libros' element={<ViewBooks />} />
    //     <Route path='/reservas' element={<ViewReserves />} />
    //     <Route path='/autores' element={<ViewAuthors />} />
    //     <Route path='/generos' element={<ViewGenres />} />
    //     <Route path='/registroUsuario' element={<PasswordStrength />} />
    //     <Route path='/carrito' element={<ViewCarrito />} />

    //   </Routes>
    // </BrowserRouter>
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path='/' element={<LoginPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />} />

            {/* Rutas solo para administradores */}
            <Route path='/register' element={<AdminRoute element={<RegistrationPage />} />} />
            <Route path='/admin/user-management' element={<AdminRoute element={<UserManagementPage />} />} />
            <Route path='/update-user/:userId' element={<AdminRoute element={<UpdateUser />} />} />
            
            {/* Redirigir cualquier ruta no encontrada a /login */}
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}