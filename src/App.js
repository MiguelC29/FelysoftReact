import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Products from './pages/Products';
import TypeServices from './pages/Typeservices';
import Employees from './pages/Employees';
import Charges from './pages/Charges';

// import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/tiposervicios' element={<TypeServices />} />
        <Route path='/empleados' element={<Employees />} />
        <Route path='/cargos' element={<Charges />} />
        
      </Routes>
    </BrowserRouter>
  );
}