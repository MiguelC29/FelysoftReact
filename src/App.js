import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Products from './pages/Products';
import Users from './pages/Users';
import Providers from './pages/Providers';
import ProductInventory from './pages/ProductInventory';
import TypeServices from './pages/Typeservices';
import Employees from './pages/Employees';
import Charges from './pages/Charges';

// import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}