import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
//import Payments from './pages/Payments';
//import Details from './pages/Details';



export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/purchases' element={<Purchases />} />

      </Routes>
    </BrowserRouter>
  );
}