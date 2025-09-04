import './style.css';
import calender from '../../assets/calendario.png';
import Logo from '../../assets/logo.png';
import Edita from '../../assets/edita.png';
import { useState } from 'react';
import Exit from '../../assets/exit.png';
import { useNavigate } from 'react-router-dom';
import React from "react";
import loadingGif2 from '../../assets/loading3.gif';
import loadingGif4 from '../../assets/loading4.gif';
import api from '../../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
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
    navigate('/')
    /* setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1700); */
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

  async function get_next(mes) {
    //setLoadingOpen(true)
    const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
    console.log('Resultado:', response);
    localStorage.setItem('body-response-array', JSON.stringify(response.data) )
    localStorage.setItem('mes-selecionado', mes)
    localStorage.setItem('ano-selecionado', anoSelecionado)
    navigate('/dashboard')
    
    /*setTimeout(() => {
      setLoadingOpen(false); // esconde o loading
      navigate('/dashboard')
    }, 2000); // 3 segundos */
    return;
  }

  return (
    <div className="container">
      {/* Overlay de Loading */}
      {loading && (
        <div className="loading-container">
          <img id='saindo' src={loadingGif2} alt="Carregando..." />
          <p class="typng"><span class="dotes"></span></p>
        </div>
      )}
      {loadingOpen && (
        <div className="loading-container-dash">
          <img src={loadingGif4} alt="Carregando..." />
          <p class="typng"><span class="dots"></span></p>
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
          <h1 onClick={() => get_next('JANEIRO')} className="JANEIRO">JANEIRO</h1>
          <h1 onClick={() => get_next('FEVEREIRO')} className="FEVEREIRO">FEVEREIRO</h1>
          <h1 onClick={() => get_next('MARCO')} className="MARCO">MARÇO</h1>
          <h1 onClick={() => get_next('ABRIL')} className="ABRIL">ABRIL</h1>
          <h1 onClick={() => get_next('MAIO')} className="MAIO">MAIO</h1>
          <h1 onClick={() => get_next('JUNHO')} className="JUNHO">JUNHO</h1>
          <h1 onClick={() => get_next('JULHO')} className="JULHO">JULHO</h1>
          <h1 onClick={() => get_next('AGOSTO')} className="AGOSTO">AGOSTO</h1>
          <h1 onClick={() => get_next('SETEMBRO')} className="SETEMBRO">SETEMBRO</h1>
          <h1 onClick={() => get_next('OUTUBRO')} className="OUTUBRO">OUTUBRO</h1>
          <h1 onClick={() => get_next('NOVEMBRO')} className="NOVEMBRO">NOVEMBRO</h1>
          <h1 onClick={() => get_next('DEZEMBRO')} className="DEZEMBRO">DEZEMBRO</h1>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
