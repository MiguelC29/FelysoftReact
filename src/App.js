import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';

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