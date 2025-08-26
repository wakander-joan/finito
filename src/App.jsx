import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Cadastrar from './pages/Cadastrar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
