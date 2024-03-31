import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import Books from './pages/Books';
import Genres from './pages/Genres';
import Authors from './pages/Authors';
import Reserves from './pages/Reserves';
import Categories from './pages/Categories';
import Providers from './pages/Providers';
import BookInventory from './pages/BookInventory';
import ProductInventory from './pages/ProductInventory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/productos' element={<Products />} />
        <Route path='/libros' element={<Books />} />
        <Route path='/generos' element={<Genres />} />
        <Route path='/autores' element={<Authors />} />
        <Route path='/reservas' element={<Reserves />} />
        <Route path='/categorias' element={<Categories />} />
        <Route path='/proveedores' element={<Providers />} />
        <Route path='/inventarioLibros' element={<BookInventory />} />
        <Route path='/inventarioProductos' element={<ProductInventory />} />
      </Routes>
    </BrowserRouter>
  );
}