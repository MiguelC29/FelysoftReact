import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Products from './pages/Products';

// import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/categories' element={<Categories />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/productos' element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}