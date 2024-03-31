import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Users from './pages/Users';
import Providers from './pages/Providers';
import ProductInventory from './pages/ProductInventory';
import VistaCategorias from './pages/VistaCategorias';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categorias' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/usuarios' element={<Users />} />
        <Route path='/proveedores' element={<Providers />} />
        <Route path='/inventarioProductos' element={<ProductInventory />} />
        <Route path='/vistaCategorias' element={<VistaCategorias />} />
      </Routes>
    </BrowserRouter>
  );
}