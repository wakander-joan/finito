import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Home from './pages/Home';
import Cadastrar from './pages/Cadastrar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Menu />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
