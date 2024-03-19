import { Route, Routes } from 'react-router-dom';
import './App.css';
import Categories from './pages/Categories';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>

      <Routes>
        <Route path='/categories' element = {<Categories />}/>
      </Routes>
    </div>
  );
}

export default App;
