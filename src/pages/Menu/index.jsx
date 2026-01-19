import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './style.css';
import calender from '../../assets/calendario.png';
import Logo from '../../assets/logo.png';
import Metas from '../../assets/Trofeu.png';
import Edita from '../../assets/edita.png';
import Exit from '../../assets/exit.png';
import React from "react";
import loadingGif2 from '../../assets/loading3.gif';
import loadingGif4 from '../../assets/loading4.gif';
import api from '../../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const nomePessoa = localStorage.getItem("nomePessoa");
  const perfil = localStorage.getItem("perfil");

  const [anoSelecionado, setAnoSelecionado] = useState("");

  useEffect(() => {
    const anoEmCache = localStorage.getItem("ano-selecionado");
    if (anoEmCache) {
      setAnoSelecionado(anoEmCache);
    } else {
      // se não tiver nada salvo, coloca o ano atual como padrão
      const anoAtual = new Date().getFullYear();
      setAnoSelecionado(anoAtual.toString());
      localStorage.setItem("ano-selecionado", anoAtual);
    }
  }, []);


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
    try {
      const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
      console.log(response);

      console.log('Resultado:', response);
      localStorage.setItem('body-response-array', JSON.stringify(response.data))
      console.log(JSON.stringify(response.data))
      localStorage.setItem('mes-selecionado', mes)
      localStorage.setItem('ano-selecionado', anoSelecionado)
      navigate('/dashboard')
      return response.data;

    } catch (error) {
      // Aqui você trata erros, como 403
      if (error.response && error.response.status === 403) {
        alert('⚠ Você precisa fazer login novamente!');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Erro ao buscar lançamentos:', error);
        alert('Ocorreu um erro ao buscar os lançamentos.');
      }
    }


    /*setTimeout(() => {
      setLoadingOpen(false); // esconde o loading
      navigate('/dashboard')
    }, 2000); // 3 segundos */
    return;
  }

  // instâncias únicas (pré-carregadas)
  const audioBlip = new Audio("/mes.mp3");
  const audioClick = new Audio("/click.mp3");
  const audioClickMes = new Audio("/clickMes.mp3");
  const audioGameOver = new Audio("/over.mp3");
  const audioHover = new Audio("/hover.mp3");
  const audioOpen = new Audio("/open.mp3");

  // funções de reprodução
  const tocarSom = (som) => {
    som.currentTime = 0;
    som.play();
  };

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
          <button
            id='botao-plano'
            onClick={(e) => {
              tocarSom(audioClick);
              localStorage.setItem("ano-selecionado", anoSelecionado);
              navigate('/graficos')
            }
            }
            title="Organize seus Planos Anuais"
          >
            <img id="logo-metas" src={Metas} alt="Finito" />
            <p id="metas">METAS</p>
          </button>
        </div>

        <div className='Area2'>
          <h2 id='ANO-TEXT'>ANO</h2>
          <select
            onClick={() => tocarSom(audioClick)}
            id='select-perfil2'
            value={anoSelecionado}
            onChange={(e) => {
              const novoAno = e.target.value;
              setAnoSelecionado(novoAno);
              localStorage.setItem("ano-selecionado", novoAno);
            }}
            className="select-ano"
            title="Selecione o ano"
          >
            <option id='lista-select' value="2025">2025</option>
            <option id='lista-select' value="2026">2026</option>
            <option id='lista-select' value="2027">2027</option>
            <option id='lista-select' value="2028">2028</option>
            <option id='lista-select' value="2029">2029</option>
          </select>
        </div>

        <div className='Area3'>

          <img onClick={() => { tocarSom(audioGameOver); alert('Em processo de desenvolvimento!') }} id="logo-edita" src={Edita} alt="Finito" title="Edite seu Perfil" />
          <h2 id='USUARIO-TEXT'>{nomePessoa}</h2>
          <h2 id='PERFIL-EMOGI'>{perfilEmoji}</h2>
          <img onClick={() => { loadingAnimation(); tocarSom(audioGameOver); }} id="logo-exit" src={Exit} alt="Finito" title="Sair para Login" />
        </div>
      </div>

      <div className="image-container">
        <img id="logo-principal" src={calender} alt="Finito" />
        <div className="mes-overlay">
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('JANEIRO'); tocarSom(audioClickMes); }} className="JANEIRO">JANEIRO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('FEVEREIRO'); tocarSom(audioClickMes); }} className="FEVEREIRO">FEVEREIRO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('MARCO'); tocarSom(audioClickMes); }} className="MARCO">MARÇO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('ABRIL'); tocarSom(audioClickMes); }} className="ABRIL">ABRIL</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('MAIO'); tocarSom(audioClickMes); }} className="MAIO">MAIO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('JUNHO'); tocarSom(audioClickMes); }} className="JUNHO">JUNHO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('JULHO'); tocarSom(audioClickMes); }} className="JULHO">JULHO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('AGOSTO'); tocarSom(audioClickMes); }} className="AGOSTO">AGOSTO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('SETEMBRO'); tocarSom(audioClickMes); }} className="SETEMBRO">SETEMBRO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('OUTUBRO'); tocarSom(audioClickMes); }} className="OUTUBRO">OUTUBRO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('NOVEMBRO'); tocarSom(audioClickMes); }} className="NOVEMBRO">NOVEMBRO</h1>
          <h1 onMouseEnter={() => tocarSom(audioHover)} onClick={() => { get_next('DEZEMBRO'); tocarSom(audioClickMes); }} className="DEZEMBRO">DEZEMBRO</h1>

        </div>
      </div>
    </div>
  );
}

export default Cadastro;
