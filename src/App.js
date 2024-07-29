import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
// import ViewRoles from './pages/ViewRoles';
import ViewUsers from './pages/ViewUsers';
import ViewProfile from './pages/ViewProfile';
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

// import PasswordStrength from './components/PasswordStrength';
import ViewBooks from './pages/ViewBooks';
import ViewReserves from './pages/ViewReserves';
import ViewAuthors from './pages/ViewAuthors';
import ViewGenres from './pages/ViewGenres';
import { LoginPage } from './components/auth/LoginPage';
import ViewBooksInventory from './pages/ViewBooksInventory';
import ViewCarrito from './pages/ViewCarrito';
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
import RegistrationPage from './components/auth/RegistrationPage';
import UpdateUser from './components/userspage/UpdateUser'
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
    //     <Route path='/roles' element={<ViewRoles />} />
    //     <Route path='/registroUsuario' element={<PasswordStrength />} />
    <BrowserRouter>
      <div className="App">
        {/* <Navbar /> */}
        <div className="content">
          <Routes>
            <Route exact path='/' element={<LoginPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route path='/perfil' element={<ProtectedRoute element={<ViewProfile />} />} />

            {/* Rutas solo para administradores */}
            <Route path='/register' element={<AdminRoute element={<RegistrationPage />} />} />
            <Route path='/usuarios' element={<AdminRoute element={<ViewUsers />} />} />
            <Route path='/inventarioProductos' element={<AdminRoute element={<ViewProductInventory />} />} />
            <Route path='/productos' element={<AdminRoute element={<ViewProducts />} />} />
            <Route path='/categorias' element={<AdminRoute element={<ViewCategories />} />} />
            <Route path='/proveedores' element={<AdminRoute element={<ViewProviders />} />} />
            <Route path='/servicios' element={<AdminRoute element={<ViewServices />} />} />
            <Route path='/tiposervicios' element={<AdminRoute element={<ViewTypeservices />} />} />
            <Route path='/generos' element={<AdminRoute element={<ViewGenres />} />} />
            <Route path='/autores' element={<AdminRoute element={<ViewAuthors />} />} />
            <Route path='/libros' element={<AdminRoute element={<ViewBooks />} />} />
            <Route path='/inventarioLibros' element={<AdminRoute element={<ViewBooksInventory />} />} />
            <Route path='/cargos' element={<AdminRoute element={<ViewCharges />} />} />
            <Route path='/empleados' element={<AdminRoute element={<ViewEmployees />} />} />
            <Route path='/detalles' element={<AdminRoute element={<ViewDetails />} />} />
            <Route path='/pagos' element={<AdminRoute element={<ViewPayments />} />} />
            <Route path='/gastos' element={<AdminRoute element={<ViewExpenses />} />} />
            <Route path='/ventas' element={<AdminRoute element={<ViewSales />} />} />
            <Route path='/reservas' element={<AdminRoute element={<ViewReserves />} />} />
            <Route path='/carrito' element={<AdminRoute element={<ViewCarrito />} />} />
            <Route path='/compras' element={<AdminRoute element={<ViewPurchases />} />} />


            <Route path='/update-user/:userId' element={<AdminRoute element={<UpdateUser />} />} />
            
            {/* Redirigir cualquier ruta no encontrada a /login */}
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}
