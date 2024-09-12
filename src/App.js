import { Navigate, Route, Routes } from 'react-router-dom';
import ViewCategories from './pages/ViewCategories';
import ViewBrands from './pages/ViewBrands';
import ViewProducts from './pages/ViewProducts';
import ViewUsers from './pages/ViewUsers';
import ViewProfile from './pages/ViewProfile';
import ViewProviders from './pages/ViewProviders';
import ViewProductInventory from './pages/ViewProductInventory';

//gastos e ingresos
// import ViewExpenses from './pages/ViewExpenses';
import ViewPurchases from './pages/ViewPurchases';
import ViewSales from './pages/ViewSales';
import ViewPayments from './pages/ViewPayments';

import ViewTypeservices from './pages/ViewTypeservices';
import ViewServices from './pages/ViewServices';
import ViewEmployees from './pages/ViewEmployees';
import ViewCharges from './pages/ViewCharges';

import ViewBooks from './pages/ViewBooks';
import ViewReserves from './pages/ViewReserves';
import ViewAuthors from './pages/ViewAuthors';
import ViewGenres from './pages/ViewGenres';
import ViewEditorials from './pages/ViewEditorials';
import { LoginPage } from './components/auth/LoginPage';
import ViewBooksInventory from './pages/ViewBooksInventory';
import ViewCarrito from './pages/ViewCarrito';
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
import RegistrationPage from './components/auth/RegistrationPage';
import UpdateUser from './components/userspage/UpdateUser'
import RoleProtectedRoute from './components/context/RoleProtectedRoute';
import ProtectedRoute from './components/context/ProtectedRoute';
import Error404 from './components/common/Error404';
import ViewAssociationCateProv from './pages/ViewAssociationCateProv';
import ViewAssociationGenAutor from './pages/ViewAssociationGenAutor';
import VerifyPage from './components/auth/VerifyPage';
import { ResetPassword } from './components/auth/ResetPassword';

import ViewTheirReserves from './pages/ViewTheirReserves';
import ViewReservesCus from './pages/ViewReservesCus';

export default function App() {

  return (
      <div className="App">
        {/* <Navbar /> */}
        <div className="content">
          <Routes>
            <Route exact path='/' element={<ProtectedRoute element={<LoginPage />} redirectTo="/perfil" />} />
            <Route exact path='/login' element={<ProtectedRoute element={<LoginPage />} redirectTo="/perfil" />} />
            <Route exact path='/registro' element={<ProtectedRoute element={<RegistrationPage />} redirectTo="/perfil" />} />
            <Route path="/activarCuenta" element={<ProtectedRoute element={<VerifyPage />} redirectTo="/perfil" />} />
            <Route path="/restablecerContraseña" element={<ProtectedRoute element={<ResetPassword />} redirectTo="/perfil" />} />

            <Route path='/perfil' element={<RoleProtectedRoute element={<ViewProfile />} roles={['ADMINISTRATOR', 'CUSTOMER', 'INVENTORY_MANAGER','SALESPERSON','FINANCIAL_MANAGER']} />} />

            {/* Rutas solo para administradores */}
            <Route path='/register' element={<RoleProtectedRoute element={<RegistrationPage />} roles={['ADMINISTRATOR']} />} />

            <Route path='/usuarios' element={<RoleProtectedRoute element={<ViewUsers />} roles={['ADMINISTRATOR']} />} />
            <Route path='/inventarioProductos' element={<RoleProtectedRoute element={<ViewProductInventory />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER','SALESPERSON']} />} />
            <Route path='/productos' element={<RoleProtectedRoute element={<ViewProducts />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER']} />} />
            <Route path='/categorias' element={<RoleProtectedRoute element={<ViewCategories />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER']} />} />
            <Route path='/marcas' element={<RoleProtectedRoute element={<ViewBrands />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER']} />} />
            <Route path='/categorias_proveedores' element={<RoleProtectedRoute element={<ViewAssociationCateProv />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER']} />} />
            <Route path='/proveedores' element={<RoleProtectedRoute element={<ViewProviders />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/servicios' element={<RoleProtectedRoute element={<ViewServices />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER','SALESPERSON']} />} />
            <Route path='/tiposervicios' element={<RoleProtectedRoute element={<ViewTypeservices />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/generos' element={<RoleProtectedRoute element={<ViewGenres />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/editoriales' element={<RoleProtectedRoute element={<ViewEditorials />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/autores' element={<RoleProtectedRoute element={<ViewAuthors />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/generos_autores' element={<RoleProtectedRoute element={<ViewAssociationGenAutor />} roles={['ADMINISTRATOR', 'INVENTORY_MANAGER']} />} />
            <Route path='/libros' element={<RoleProtectedRoute element={<ViewBooks />} roles={['ADMINISTRATOR','INVENTORY_MANAGER']} />} />
            <Route path='/inventarioLibros' element={<RoleProtectedRoute element={<ViewBooksInventory />} roles={['ADMINISTRATOR','INVENTORY_MANAGER','SALESPERSON','CUSTOMER']} />} />
            <Route path='/cargos' element={<RoleProtectedRoute element={<ViewCharges />} roles={['ADMINISTRATOR']} />} />
            <Route path='/empleados' element={<RoleProtectedRoute element={<ViewEmployees />} roles={['ADMINISTRATOR']} />} />
            <Route path='/pagos' element={<RoleProtectedRoute element={<ViewPayments />} roles={['ADMINISTRATOR','SALESPERSON']} />} />
            {/* <Route path='/gastos' element={<RoleProtectedRoute element={<ViewExpenses />} roles={['ADMINISTRATOR','FINANCIAL_MANAGER']} />} /> */}
            <Route path='/ventas' element={<RoleProtectedRoute element={<ViewSales />} roles={['ADMINISTRATOR','SALESPERSON']} />} />
            <Route path='/reservas' element={<RoleProtectedRoute element={<ViewReserves />} roles={['ADMINISTRATOR','SALESPERSON']} />} />
            <Route path='/carrito' element={<RoleProtectedRoute element={<ViewCarrito/>} roles={['ADMINISTRATOR', 'SALESPERSON','CUSTOMER']} />} />
            <Route path='/compras' element={<RoleProtectedRoute element={<ViewPurchases />} roles={['ADMINISTRATOR','INVENTORY_MANAGER', 'FINANCIAL_MANAGER']} />} />

            <Route path='/reservar' element={<RoleProtectedRoute element={<ViewReservesCus />} roles={['CUSTOMER']} />} />
            <Route path='/sus_reservas' element={<RoleProtectedRoute element={<ViewTheirReserves />} roles={['CUSTOMER']} />} />


            <Route path='/update-user/:userId' element={<RoleProtectedRoute element={<UpdateUser />} roles={['ADMINISTRATOR']} />} />
            
            {/* Redirigir cualquier ruta no encontrada a /login */}
            <Route path='/unauthorized' element={<Error404 />} />
            <Route path='*' element={<Navigate to="/unauthorized" replace />} />

            <Route path='/registro' element={<RegistrationPage />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
  );
}
