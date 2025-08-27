import './style.css';
import calender from '../../assets/calendario.png';
import Logo from '../../assets/logo.png';
import Edita from '../../assets/edita.png';
import { useState } from 'react';
import Exit from '../../assets/exit.png';
import { useNavigate } from 'react-router-dom';
import React from "react";
import loadingGif2 from '../../assets/loading3.gif'; 

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [anoSelecionado, setAnoSelecionado] = useState('2025');
  const nomePessoa = localStorage.getItem("nomePessoa");
  const perfil = localStorage.getItem("perfil");
  const EMOJIS = [
    "🕎", // 0
    "💀", // 1
    "💸", // 2
    "😬", // 3
    "😐", // 4
    "🙂", // 5
    "😎", // 6
    "🤑", // 7
    "💰", // 8
    "🏦", // 9
    "🌟"  // 10
  ];

  async function loadingAnimation() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/')
    }, 1700);
  }

  function getPerfilEmoji() {
    const perfil = localStorage.getItem("perfil"); // Ex.: "3"
    const perfilIndex = parseInt(perfil, 10); // Converte para número

    if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
      return EMOJIS[perfilIndex];
    }
    return "❓"; // Caso não exista
  }

  const perfilEmoji = getPerfilEmoji();


  return (
    <div className="container">
      {/* Overlay de Loading */}
            {loading && (
              <div className="loading-container">
                <img id='saindo' src={loadingGif2} alt="Carregando..." />
                <p class="typng"><span class="dotes"></span></p>
              </div>
            )}
      <div className='Cabecalho'>
        <div className='Area1'>
          <img id="logo-finito-cabecalho" src={Logo} alt="Finito" />
          <h2 id='FINITO-TEXT'>FINITO</h2>
        </div>

        <div className='Area2'>
          <h2 id='ANO-TEXT'>ANO</h2>
          <select
            id='select-perfil2'
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
            className="select-ano"
          >
            <option id='lista-select' value="2023">2023</option>
            <option id='lista-select' value="2024">2024</option>
            <option id='lista-select' value="2025">2025</option>
            <option id='lista-select' value="2026">2026</option>
            <option id='lista-select' value="2027">2027</option>
          </select>
        </div>

        <div className='Area3'>
          <img onClick={() => alert("Funcionalidade em implementação...")} id="logo-edita" src={Edita} alt="Finito" />
          <h2 id='USUARIO-TEXT'>{nomePessoa}</h2>
          <h2 id='PERFIL-EMOGI'>{perfilEmoji}</h2>
          <img onClick={loadingAnimation} id="logo-exit" src={Exit} alt="Finito" />
        </div>
      </div>

      <div className="image-container">
        <img id="logo-principal" src={calender} alt="Finito" />
        <div className="mes-overlay">
          <h1 onClick={() => alert('Janeiro de ' + anoSelecionado)} className="JANEIRO">JANEIRO</h1>
          <h1 onClick={() => alert('Fevereiro de ' + anoSelecionado)} className="FEVEREIRO">FEVEREIRO</h1>
          <h1 onClick={() => alert('Março de ' + anoSelecionado)} className="MARCO">MARÇO</h1>
          <h1 onClick={() => alert('Abril de ' + anoSelecionado)} className="ABRIL">ABRIL</h1>
          <h1 onClick={() => alert('Maio de ' + anoSelecionado)} className="MAIO">MAIO</h1>
          <h1 onClick={() => alert('Junho de ' + anoSelecionado)} className="JUNHO">JUNHO</h1>
          <h1 onClick={() => alert('Julho de ' + anoSelecionado)} className="JULHO">JULHO</h1>
          <h1 onClick={() => alert('Agosto de ' + anoSelecionado)} className="AGOSTO">AGOSTO</h1>
          <h1 onClick={() => alert('Setembro de ' + anoSelecionado)} className="SETEMBRO">SETEMBRO</h1>
          <h1 onClick={() => alert('Outubro de ' + anoSelecionado)} className="OUTUBRO">OUTUBRO</h1>
          <h1 onClick={() => alert('Novembro de ' + anoSelecionado)} className="NOVEMBRO">NOVEMBRO</h1>
          <h1 onClick={() => alert('Dezembro de ' + anoSelecionado)} className="DEZEMBRO">DEZEMBRO</h1>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
