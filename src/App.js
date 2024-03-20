import { Route, Routes } from 'react-router-dom';
import './App.css';
import Categories from './pages/Categories';
import Typeservices from './pages/Typeservices';
// import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Sidebar /> */}
      </header>

      <Routes>
        <Route path='/categories' element = {<Categories />}/>
        <Route path='/typeservices' element = {<Typeservices />}/>
      </Routes>
    </div>
  );
}

export default App;
