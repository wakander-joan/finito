import './styledash.css';
import Logo from '../../assets/logo.png';
import Exit from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import loadingGif4 from '../../assets/loading4.gif';
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import calendarioicon from '../../assets/calendarioicon.png';
import carteiraicon from '../../assets/carteiraicon.png';
import api from '../../services/api';

function Dashboard() {
  const nomePessoa = localStorage.getItem("nomePessoa");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const anoSelecionado = localStorage.getItem('ano-selecionado');
  const messelecionado = localStorage.getItem('mes-selecionado');
  let body_response = [];

  try {
    const stored = localStorage.getItem('body-response-array');
    if (stored) {
      body_response = JSON.parse(stored); // só tenta parsear se houver algo
      if (!Array.isArray(body_response)) {
        body_response = []; // garante que seja array
      }
    }
  } catch (err) {
    console.error("Erro ao ler body-response-array:", err);
    body_response = [];
  }

  function somarReceitasFormatadas(bodyArray) {
    if (!Array.isArray(bodyArray)) return "R$ 0,00";

    const totalPreco = bodyArray.reduce((acc, item) => {
      if (item.tipo === 'RECEITA' && item.preco != null) {
        return acc + Number(item.preco);
      }
      return acc;
    }, 0);

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(totalPreco);
  }

  function somarDespesasFormatadas(bodyArray) {
    if (!Array.isArray(bodyArray)) return "R$ 0,00";

    const totalPreco = bodyArray.reduce((acc, item) => {
      if (item.tipo === 'DESPESA' && item.preco != null) {
        return acc + Number(item.preco);
      }
      return acc;
    }, 0);

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(totalPreco);
  }

  

  function somarReceitas(bodyArray) {
    if (!Array.isArray(bodyArray)) return 0;
    return bodyArray.reduce((acc, item) => {
      if (item.tipo === 'RECEITA' && item.preco != null) {
        return acc + Number(item.preco);
      }
      return acc;
    }, 0);
  }

  function somarDespesas(bodyArray) {
    if (!Array.isArray(bodyArray)) return 0;
    return bodyArray.reduce((acc, item) => {
      if (item.tipo === 'DESPESA' && item.preco != null) {
        return acc + Number(item.preco);
      }
      return acc;
    }, 0);
  }

  const totalReceitas = somarReceitas(body_response);
  const totalDespesas = somarDespesas(body_response);

  // Agora você pode subtrair
  const mediaTotal = totalReceitas - totalDespesas;

  // Para exibir formatado
  const mediaTotalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(mediaTotal);

  function calcularSaldo(bodyArray) {
    if (!Array.isArray(bodyArray)) return "R$ 0,00";

    let totalReceitas = 0;
    let totalDespesas = 0;

    bodyArray.forEach(item => {
      if (item.preco != null) {
        if (item.tipo === 'RECEITA' && item.status === 'PAGO') {
          totalReceitas += Number(item.preco);
        } else if (item.tipo === 'DESPESA' && item.status === 'PAGO') {
          totalDespesas += Number(item.preco);
        }
      }
    });

    const saldo = totalReceitas - totalDespesas;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(saldo);
  }
  
  const totalFormatadoReceitas = somarReceitasFormatadas(body_response);
  const totalFormatadoDespesas = somarDespesasFormatadas(body_response);
  const saldoFormatado = calcularSaldo(body_response);

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
    localStorage.setItem('body-response-array', JSON.stringify(response.data))
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

        <div className='Areadash2'>
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

      {/* Dashboard Principal */}
      <div className='Caixa-dados'>
        <div className='Valores'>
          <div id='Resultados' className='Resulato-Receitas'>
            <img id='iconseta' src={setareceitas} alt="" />
            <p className='Valores-nomes'>Receitas</p>
            <p id='Valor-receitas' className='Valores-numeros'>{totalFormatadoReceitas}</p>
          </div>
          <div id='Resultados' className='Resulato-Despesas'>
            <img id='iconseta' src={setadespesas} alt="" />
            <p className='Valores-nomes'>Despesas</p>
            <p id='Valor-depesas' className='Valores-numeros'>{totalFormatadoDespesas}</p>
          </div>
          <div id='Resultados' className='Resulato-Despesas'>
            <img id='icons' src={calendarioicon} alt="" />
            <p className='Valores-nomes'>Média do mês</p>
            <p id='Valor-media' className='Valores-numeros'>{mediaTotalFormatado}</p>
          </div>
          <div id='Resultados' className='Resulato-Despesas'>
            <img id='icons' src={carteiraicon} alt="" />
            <p className='Valores-nomes'>Carteira</p>
            <p id='Valor-atual' className='Valores-numeros'>{saldoFormatado}</p>
          </div>
        </div>

        <div className='Imputs-Lancamentos'>
          <div className='Inputs'>
            <h4>Inputs</h4>
          </div>
          <div className='Lancamentos-grafico-IA'>
            <h4>Lancamentos-grafico-IA</h4>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
