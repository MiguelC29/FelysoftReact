import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewRoles from './pages/ViewRoles';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Details from './pages/Details';
import ViewUsers from './pages/ViewUsers';
import ViewProviders from './pages/ViewProviders';
import ViewProductInventory from './pages/ViewProductInventory';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categorias' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/usuarios' element={<Users />} />
        <Route path='/proveedores' element={<Providers />} />
        <Route path='/inventarioProductos' element={<ProductInventory />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/tiposervicios' element={<TypeServices />} />
        <Route path='/empleados' element={<Employees />} />
        <Route path='/cargos' element={<Charges />} />
        <Route path='/ventas' element={<Sales />} />
        <Route path='/compras' element={<Purchases />} />
        <Route path='/pagos' element={<Payments />} />
        <Route path='/gastos' element={<Expenses />} />
        <Route path='/detalles' element={<Details />} />


        <Route path='/categorias' element={<ViewCategories />} />
        <Route path='/roles' element={<ViewRoles />} />
        <Route path='/productos' element={<ViewProducts />} />
        <Route path='/usuarios' element={<ViewUsers />} />
        <Route path='/proveedores' element={<ViewProviders />} />
        <Route path='/inventarioProductos' element={<ViewProductInventory />} />
      </Routes>
    </BrowserRouter>
  );
}