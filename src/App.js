import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewRoles from './pages/ViewRoles';
import ViewUsers from './pages/ViewUsers';
import ViewProviders from './pages/ViewProviders';
import ViewProductInventory from './pages/ViewProductInventory';
import Typeservices from './pages/ViewTypeservices';
import Services from './pages/ViewServices';
import Employees from './pages/ViewEmployees';
import Charges from './pages/ViewCharges';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categorias' element={<ViewCategories />} />
        <Route path='/roles' element={<ViewRoles />} />
        <Route path='/productos' element={<ViewProducts />} />
        <Route path='/usuarios' element={<ViewUsers />} />
        <Route path='/proveedores' element={<ViewProviders />} />
        <Route path='/inventarioProductos' element={<ViewProductInventory />} />
        <Route path='/tiposervicios' element={<Typeservices />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/empleados' element={<Employees />} />
        <Route path='/cargos' element={<Charges />} />
      </Routes>
    </BrowserRouter>
  );
}