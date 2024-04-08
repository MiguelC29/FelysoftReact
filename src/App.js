import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<InicioSesion />} />
        <Route path='/categorias' element={<ViewCategories />} />
        <Route path='/roles' element={<ViewRoles />} />
        <Route path='/productos' element={<ViewProducts />} />
        <Route path='/usuarios' element={<ViewUsers />} />
        <Route path='/proveedores' element={<ViewProviders />} />
        <Route path='/inventarioProductos' element={<ViewProductInventory />} />
        <Route path='/inventarioLibros' element={<ViewBooksInventory />} />
        <Route path='/tiposervicios' element={<ViewTypeservices />} />
        <Route path='/servicios' element={<ViewServices />} />
        <Route path='/empleados' element={<ViewEmployees />} />
        <Route path='/cargos' element={<ViewCharges />} />
        <Route path='/gastos' element={<ViewExpenses />} />
        <Route path='/compras' element={<ViewPurchases />} />
        <Route path='/ventas' element={<ViewSales />} />
        <Route path='/pagos' element={<ViewPayments />} />
        <Route path='/detalles' element={<ViewDetails />} />
        <Route path='/libros' element={<ViewBooks />} />
        <Route path='/reservas' element={<ViewReserves />} />
        <Route path='/autores' element={<ViewAuthors />} />
        <Route path='/generos' element={<ViewGenres />} />
        <Route path='/registroUsuario' element={<PasswordStrength />} />
        <Route path='/carrito' element={<ViewCarrito />} />

      </Routes>
    </BrowserRouter>
  );
}