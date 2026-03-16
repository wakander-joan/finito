import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './style.css';
import calender from '../../assets/calendario.png';
import Logo from '../../assets/logo.png';
import Metas from '../../assets/Trofeu.png';
import Edita from '../../assets/edita.png';
import Exit from '../../assets/exit.png';
import loadingGif2 from '../../assets/loading3.gif';
import loadingGif4 from '../../assets/loading4.gif';
import api from '../../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const nomePessoa = localStorage.getItem("nomePessoa");

  const [anoSelecionado, setAnoSelecionado] = useState("");

  useEffect(() => {
    const anoEmCache = localStorage.getItem("ano-selecionado");
    if (anoEmCache) {
      setAnoSelecionado(anoEmCache);
    } else {
      const anoAtual = new Date().getFullYear();
      setAnoSelecionado(anoAtual.toString());
      localStorage.setItem("ano-selecionado", anoAtual);
    }
  }, []);

  const EMOJIS = [
    "🕎", "💀", "💸", "😬", "😐",
    "🙂", "😎", "🤑", "💰", "🏦", "🌟"
  ];

  const MESES = [
    'JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL',
    'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
    'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  const MESES_LABEL = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL',
    'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
    'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  function loadingAnimation() {
    navigate('/');
  }

  function getPerfilEmoji() {
    const perfilIndex = parseInt(localStorage.getItem("perfil"), 10);
    if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
      return EMOJIS[perfilIndex];
    }
    return "❓";
  }
  const perfilEmoji = getPerfilEmoji();

  async function get_next(mes) {
    try {
      const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
      localStorage.setItem('body-response-array', JSON.stringify(response.data));
      localStorage.setItem('mes-selecionado', mes);
      localStorage.setItem('ano-selecionado', anoSelecionado);
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('⚠ Você precisa fazer login novamente!');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Erro ao buscar lançamentos:', error);
        alert('Ocorreu um erro ao buscar os lançamentos.');
      }
    }
  }

  const audioClick = new Audio("/click.mp3");
  const audioClickMes = new Audio("/clickMes.mp3");
  const audioGameOver = new Audio("/over.mp3");
  const audioHover = new Audio("/hover.mp3");

  const tocarSom = (som) => {
    som.currentTime = 0;
    som.play();
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-container">
          <img id='saindo' src={loadingGif2} alt="Carregando..." />
          <p className="typng"><span className="dotes"></span></p>
        </div>
      )}
      {loadingOpen && (
        <div className="loading-container-dash">
          <img src={loadingGif4} alt="Carregando..." />
          <p className="typng"><span className="dots"></span></p>
        </div>
      )}

      <div className={`Cabecalho ${menuAberto ? 'menu-aberto' : ''}`}>
        <div className='Area1'>
          <img id="logo-finito-cabecalho" src={Logo} alt="Finito" />
          <h2 id='FINITO-TEXT'>FINITO</h2>
          <button
            id='botao-plano'
            onClick={() => {
              tocarSom(audioClick);
              localStorage.setItem("ano-selecionado", anoSelecionado);
              navigate('/graficos');
            }}
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
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
          </select>
        </div>

        {/* Hamburger como filho direto do Cabecalho */}
        <button className="hamburger" onClick={() => setMenuAberto(!menuAberto)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className='Area3'>
          <img
            onClick={() => { tocarSom(audioGameOver); alert('Em processo de desenvolvimento!'); }}
            id="logo-edita" src={Edita} alt="Editar perfil" title="Edite seu Perfil"
          />
          <h2 id='USUARIO-TEXT'>{nomePessoa}</h2>
          <h2 id='PERFIL-EMOGI'>{perfilEmoji}</h2>
          <img
            onClick={() => { loadingAnimation(); tocarSom(audioGameOver); }}
            id="logo-exit" src={Exit} alt="Sair" title="Sair para Login"
          />
        </div>
      </div>

      {/* Desktop: imagem com meses sobrepostos */}
      <div className="image-container desktop-only">
        <img id="logo-principal" src={calender} alt="Finito" />
        <div className="mes-overlay">
          {MESES.map((mes, i) => (
            <h1
              key={mes}
              className={mes}
              onMouseEnter={() => tocarSom(audioHover)}
              onClick={() => { get_next(mes); tocarSom(audioClickMes); }}
            >
              {MESES_LABEL[i]}
            </h1>
          ))}
        </div>
      </div>

      {/* Mobile: grid de botões */}
      <div className="meses-grid mobile-only">
        {MESES.map((mes, i) => (
          <button
            key={mes}
            className={`mes-btn mes-btn-${i}`}
            onClick={() => { get_next(mes); tocarSom(audioClickMes); }}
          >
            {MESES_LABEL[i]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Cadastro;