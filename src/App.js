import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Details from './pages/Details';
import Users from './pages/Users';
import Providers from './pages/Providers';
import ProductInventory from './pages/ProductInventory';
import Services from './pages/Services';
import TypeServices from './pages/Typeservices';
import Employees from './pages/Employees';
import Charges from './pages/Charges';

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


      </Routes>
    </BrowserRouter>
  );
}