import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Details from './pages/Details';



export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/ventas' element={<Sales />} />
        <Route path='/compras' element={<Purchases />} />
        <Route path='/pagos' element={<Payments />} />
        <Route path='/gastos' element={<Expenses />} />
        <Route path='/detalles' element={<Details />} />


      </Routes>
    </BrowserRouter>
  );
}