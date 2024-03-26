import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Categories from './pages/Categories';
// import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Sidebar /> */}
      </header>

      <Routes>
        <Route path='/categories' element = {<Categories />}/>
      </Routes>
    </BrowserRouter>
  );
}