import { Route, Routes } from 'react-router-dom';
import './App.css';
import Categories from './pages/Categories';
import Roles from './pages/Roles';
import Products from './pages/Products';
import Employee from './pages/Employee';
// import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Sidebar /> */}
      </header>

      <Routes>
        <Route path='/categories' element = {<Categories />}/>
        <Route path='/roles' element = {<Roles />}/>
        <Route path='/products' element = {<Products />}/>
        <Route path='/employees' element = {<Employee />}/>
      </Routes>
    </div>
  );
}

export default App;
