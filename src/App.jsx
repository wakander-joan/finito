import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Home from "./pages/Home";
import Cadastrar from "./pages/Cadastrar";
import Dashboard from "./pages/Dashboard";
import Graficos from "./pages/Graficos";
import Resultados from "./pages/Resultados/GraficosMes";

function App() {
  useEffect(() => {
    // Cria o áudio do som de digitar
    const audio = new Audio("/key.mp3"); // coloque seu som na pasta public/sons
    audio.volume = 0.2; // ajusta o volume se quiser

    const handleKeyDown = (e) => {
      // Ignora teclas de controle (Shift, Ctrl, Alt, Tab, CapsLock)
      const ignoreKeys = ["Shift", "Control", "Alt", "Tab", "CapsLock"];
      if (!ignoreKeys.includes(e.key)) {
        audio.currentTime = 0; // reinicia o som
        audio.play();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup para remover o listener quando o componente for desmontado
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Menu />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/graficos" element={<Graficos />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

