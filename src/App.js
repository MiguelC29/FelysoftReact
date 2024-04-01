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
        <Route path='/tiposervicios' element={<ViewTypeservices />} />
        <Route path='/servicios' element={<ViewServices />} />
        <Route path='/empleados' element={<ViewEmployees />} />
        <Route path='/cargos' element={<ViewCharges />} />
        <Route path='/gastos' element={<ViewExpenses />} />
        <Route path='/compras' element={<ViewPurchases />} />
        <Route path='/ventas' element={<ViewSales />} />
        <Route path='/pagos' element={<ViewPayments />} />
        <Route path='/detalles' element={<ViewDetails />} />


      </Routes>
    </BrowserRouter>
  );
}