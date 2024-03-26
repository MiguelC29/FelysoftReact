import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Prod from './pages/Prod';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/products' element={<Prod />} />
      </Routes>
    </BrowserRouter>
  );
}