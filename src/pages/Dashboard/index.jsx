import './styledash.css';
import Logo from '../../assets/logo.png';
import Exit from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import loadingGif4 from '../../assets/loading4.gif';
import api from '../../services/api';

function Dashboard() {
  const nomePessoa = localStorage.getItem("nomePessoa");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const anoSelecionado = localStorage.getItem('ano-selecionado');
  const messelecionado = localStorage.getItem('mes-selecionado');
  const setlaD = "--->"
  const setlaE = "<---"
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
  const meses = [
    "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL",
    "MAIO", "JUNHO", "JULHO", "AGOSTO",
    "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
  ];

  function getPerfilEmoji() {
    const perfil = localStorage.getItem("perfil"); // Ex.: "3"
    const perfilIndex = parseInt(perfil, 10); // Converte para número

    if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
      return EMOJIS[perfilIndex];
    }
    return "❓"; // Caso não exista
  }
  const perfilEmoji = getPerfilEmoji();

  async function loadingAnimation() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/cadastro')
    }, 1700);
  }

  async function get_next(mes) {
    const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
    console.log('Resultado:', response);
    localStorage.setItem('body-response-array', response.data)
    localStorage.setItem('mes-selecionado', mes)
    localStorage.setItem('ano-selecionado', anoSelecionado)
      navigate('/dashboard')
    return;
  }

  function handleSetaClick(direcao) {
    // Pega o índice do mês atualmente selecionado
    const indiceAtual = meses.indexOf(messelecionado); // mesSelecionado deve estar no estado

    let novoIndice;
    if (direcao === "proximo") {
      // próximo mês (loop no final)
      novoIndice = (indiceAtual + 1) % meses.length;
    } else if (direcao === "anterior") {
      // mês anterior (loop no começo)
      novoIndice = (indiceAtual - 1 + meses.length) % meses.length;
    }

    const novoMes = meses[novoIndice];
    get_next(novoMes); // chama sua função
  }

  return (
    <div className="container-dash">
      {/* Overlay de Loading */}
      {loading && (
        <div className="loading-container-dash">
          <img id='saindo' src={loadingGif4} alt="Carregando..." />
          <p class="typng"><span class="dotes"></span></p>
        </div>
      )}
      <div className='Cabecalho'>
        <div className='Areadash1'>
          <img onClick={loadingAnimation} id="logo-exit-dash" src={Exit} alt="Finito" />
          <img id="logo-finito-cabecalho-dash" src={Logo} alt="Finito" />
          <h2 id='FINITO-TEXT-DASH'>FINITO</h2>
        </div>

        <div className='Area2'>
          <h5 id='seta' onClick={() => handleSetaClick("anterior")}>{setlaE}</h5>
          <h5 id='ano-cabecalho'>{messelecionado}</h5>
          <h5 id='de-cabecalho'>de</h5>
          <h5 id='ano-cabecalho'>{anoSelecionado}</h5>
          <h5 id='seta' onClick={() => handleSetaClick("proximo")}>{setlaD}</h5>
        </div>

        <div className='Area3'>
          <h2 id='USUARIO-TEXT'>{nomePessoa}</h2>
          <h2 id='PERFIL-EMOGI'>{perfilEmoji}</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
