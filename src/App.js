import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import Books from './pages/Books';
import Genres from './pages/Genres';
import Authors from './pages/Authors';
import Reserves from './pages/Reserves';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/productos' element={<Products />} />
        <Route path='/libros' element={<Books />} />
        <Route path='/generos' element={<Genres />} />
        <Route path='/autores' element={<Authors />} />
        <Route path='/reservas' element={<Reserves />} />
      </Routes>
    </BrowserRouter>
  );
}