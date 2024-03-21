import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Authors from './pages/Authors';
import Genres from './pages/Genres';

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/genres' element = {<Genres/>}/>
        <Route path='/authors' element = {<Authors />}/>
      </Routes>
      </BrowserRouter>
  );
}

export default App;