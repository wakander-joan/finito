{/* Import's Geral.................*/ }
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';

{/* Import's Cabecalho.............*/ }
import Logo from '../../assets/logo.png';
import Exit from '../../assets/back.png';
import loadingGif4 from '../../assets/loading4.gif';

{/* Import's Input's...............*/ }

{/* Import's Lancamentos...........*/ }
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import icon_filtro from '../../assets/filtro.png';
import icon_lupa from '../../assets/lupa.png';
import edita from '../../assets/edita.png';
import apaga from '../../assets/apaga.png';

{/* Import's Valores...............*/ }
import calendarioicon from '../../assets/calendarioicon.png';
import carteiraicon from '../../assets/carteiraicon.png';


function Dashboard() {

  {/* Body-response-Geral.................................................................*/ }
  {/* Body iniciado antes das constantes para carregamento dos, VALORES & LANCAMENTOS.....*/ }
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
  {/* Body-response-Geral.................*/ }

  {/* Const's Input's.................*/ }
  const [display, setDisplay] = useState("R$ 0,00");
  const [displayEdita, setDisplayEdita] = useState("R$ 0,00");
  const [raw, setRaw] = useState(0); // em centavos
  const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const [data, setData] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState("RECEITA");
  const [statusSelecionado, setStatusSelecionado] = useState("PENDENTE");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [valorSelecionado, setValorSelecionado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricaoSelecionada, setDescricaoSelecionada] = useState("");
  const categoriasDespesa = [
    "MORADIA", "TRANSPORTE", "ALIMENTACAO", "SAUDE", "EDUCACAO",
    "LAZER", "VESTUARIO", "SERVICOS", "PETS", "IMPOSTOS", "OUTRAS_DESPESAS"
  ];
  const categoriasReceita = [
    "SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "INVESTIMENTOS",
    "REEMBOLSOS", "PREMIOS", "VENDAS", "AJUDAS", "OUTRAS_RECEITAS"
  ];
  const formata_data = (e) => {
    setData(e.target.value); // já vem no formato yyyy-mm-dd
  };


  {/* Const's Cabecalho.................*/ }
  const nomePessoa = localStorage.getItem("nomePessoa");
  const [loading, setLoading] = useState(false);
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
  const perfilEmoji = getPerfilEmoji();

  {/* Const's Valores.................*/ }
  const totalReceitas = somarReceitas(body_response);
  const totalDespesas = somarDespesas(body_response);
  const mediaTotal = totalReceitas - totalDespesas;
  const mediaTotalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(mediaTotal);
  const totalFormatadoReceitas = somarReceitasFormatadas(body_response);
  const totalFormatadoDespesas = somarDespesasFormatadas(body_response);
  const saldoFormatado = calcularSaldo(body_response);

  {/* Edita .................*/ }
  const [overlayVisivel, setOverlayVisivel] = useState(false);
  const [dataSelecionadaEdita, setDataSelecionadaEdita] = useState("");
  const [categoriaEdita, setCategoriaEdita] = useState("SALARIO");
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
  const [opcaoTipo, setOpcao] = useState("RECEITA");
  const [descricaoEditada, setDescricaoEditada] = useState("");
  const [valorEditado, setValorEditado] = useState();

  const abrirOverlay = (lancamento) => {
    setDescricaoEditada(lancamento.descricao)
    setCategoriaEdita(lancamento.categoriaLancamento)
    setValorEditado(lancamento.preco)
    setLancamentoSelecionado(lancamento);
    setOverlayVisivel(true);
  };

  const fecharOverlay = () => {
    setOverlayVisivel(false);
    setLancamentoSelecionado(null);
  };

  const categoriasDespesaEdita = [
    "MORADIA", "TRANSPORTE", "ALIMENTACAO", "SAUDE", "EDUCACAO",
    "LAZER", "VESTUARIO", "SERVICOS", "PETS", "IMPOSTOS", "OUTRAS_DESPESAS"
  ];
  const categoriasReceitaEdita = [
    "SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "INVESTIMENTOS",
    "REEMBOLSOS", "PREMIOS", "VENDAS", "AJUDAS", "OUTRAS_RECEITAS"
  ];

  {/* Const's Lancamentos.................*/ }
  const [inputValue, setInputValue] = useState("");

  {/* Const's Geral.................*/ }
  const navigate = useNavigate();
  const anoSelecionado = localStorage.getItem('ano-selecionado');
  const messelecionado = localStorage.getItem('mes-selecionado');


  {/* Inicio das Functions ----------------------------------- */ }


  {/* Cabecalhooooooooooooooooooooooo.................*/ }
  function getPerfilEmoji() {
    const perfil = localStorage.getItem("perfil"); // Ex.: "3"
    const perfilIndex = parseInt(perfil, 10); // Converte para número

    if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
      return EMOJIS[perfilIndex];
    }
    return "❓"; // Caso não exista
  }

  async function voltar_menu_animacao() {
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

  function direcaoSetaClicada(direcao) {
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

  {/* Valoressssssssssssss.................*/ }
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

  function calcularSaldo(bodyArray) {
    if (!Array.isArray(bodyArray)) return "R$ 0,00";

    let totalReceitasPagos = 0;
    let totalDespesasPagos = 0;

    bodyArray.forEach(item => {
      if (item.preco != null) {
        if (item.tipo === 'RECEITA' && item.status === 'PAGO') {
          totalReceitasPagos += Number(item.preco);
        } else if (item.tipo === 'DESPESA' && item.status === 'PAGO') {
          totalDespesasPagos += Number(item.preco);
        }
      }
    });

    const saldo = totalReceitasPagos - totalDespesasPagos;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(saldo);
  }

  {/* Inputtttttttttttttt.................*/ }
  function formata_display_input(e) {
    const digits = e.target.value.replace(/\D/g, "") || "0";
    const cents = parseInt(digits, 10);
    setRaw(cents);
    setDisplay(fmt.format(cents / 100));
  }

  async function recarrega_pagina_apos_cadastrar(mes) {
    const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
    console.log('Resultado:', response);
    localStorage.setItem('body-response-array', JSON.stringify(response.data))
    localStorage.setItem('mes-selecionado', mes)
    localStorage.setItem('ano-selecionado', anoSelecionado)
    navigate('/dashboard')
    window.location.reload();
    return;
  }

  async function cadastraLancamento() {
    try {
      const body = {
        descricao: descricaoSelecionada,
        preco: valorSelecionado,
        dataVencimento: dataSelecionada,
        status: statusSelecionado,
        tipo: tipoSelecionado,
        categoriaLancamento: categoria
      };

      // Validações individuais
      if (!body.descricao || body.descricao.trim() === "") {
        alert("⚠ Preencha a descrição antes de cadastrar!");
        return;
      }
      if (!body.preco || body.preco <= 0) {
        alert("⚠ Informe um valor válido!");
        return;
      }
      if (!body.dataVencimento) {
        alert("⚠ Selecione uma data de vencimento!");
        return;
      }
      if (!body.status) {
        alert("⚠ Selecione um status!");
        return;
      }
      if (!body.tipo) {
        alert("⚠ Selecione um tipo (Receita ou Despesa)!");
        return;
      }
      if (!body.categoriaLancamento) {
        alert("⚠ Selecione uma categoria!");
        return;
      }

      console.log(body);

      const response = await api.post(`/lancamento/cadastraLancamento/${messelecionado}/${anoSelecionado}`, body);

      if (response.status === 201) {
        alert(`Lançamento cadastrado com sucesso ✅: ${response.status}`);
        recarrega_pagina_apos_cadastrar(messelecionado)
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
        console.log('Algo deu errado!', response);
      }
    } catch (error) {
      const mensagemErro = error.response?.data?.message || error.message;
      alert(`❌ Erro ao cadastrar Lancamento: ${mensagemErro}`);
      console.error('Erro ao cadastrar Lancamento:', error);
    }
  }

  {/* Lancamentos.................*/ }
  function verificaSetaLancamento(tipo) {
    if (tipo === "RECEITA") {
      return setareceitas;
    } else if (tipo === "DESPESA") {
      return setadespesas;
    }
    return "";
  }

  {/* Lancamento / Edita .................*/ }
  useEffect(() => {
    if (lancamentoSelecionado?.dataVencimento) {
      // garante o formato YYYY-MM-DD
      const dataFormatada = new Date(lancamentoSelecionado.dataVencimento)
        .toISOString()
        .split("T")[0];
      setDataSelecionadaEdita(dataFormatada);
    }
  }, [lancamentoSelecionado]);

  useEffect(() => {
    if (lancamentoSelecionado) {
      setOpcao(lancamentoSelecionado.tipo || "RECEITA");
      setCategoria(lancamentoSelecionado.categoria || "");
    }
  }, [lancamentoSelecionado]);

  function formatador(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
          <img onClick={voltar_menu_animacao} id="logo-exit-dash" src={Exit} alt="Finito" />
          <img id="logo-finito-cabecalho-dash" src={Logo} alt="Finito" />
          <h2 id='FINITO-TEXT-DASH'>FINITO</h2>
        </div>

        <div className='Areadash2'>
          <h5 id='seta' onClick={() => direcaoSetaClicada("anterior")}>{setlaE}</h5>
          <h5 id='ano-cabecalho'>{messelecionado}</h5>
          <h5 id='de-cabecalho'>de</h5>
          <h5 id='ano-cabecalho'>{anoSelecionado}</h5>
          <h5 id='seta' onClick={() => direcaoSetaClicada("proximo")}>{setlaD}</h5>
        </div>

        <div className='Area3'>
          <h2 id='USUARIO-TEXT2'>{nomePessoa}</h2>
          <h2 id='PERFIL-EMOGI2'>{perfilEmoji}</h2>
        </div>
      </div>

      {/* Dashboard Principal */}
      <div className='Caixa-dados'>
        {/* Valores de amostragem */}
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
            <p className='Valores-nomes'>Média</p>
            <p id='Valor-media' className='Valores-numeros'>{mediaTotalFormatado}</p>
          </div>
          <div id='Resultados' className='Resulato-Despesas'>
            <img id='icons' src={carteiraicon} alt="" />
            <p className='Valores-nomes'>Carteira</p>
            <p id='Valor-atual' className='Valores-numeros'>{saldoFormatado}</p>
          </div>
        </div>
        {/* Imputs-Lancamentos */}
        <div className='Imputs-Lancamentos'>
          {/* Imputs */}
          <div className='Inputs'>
            <p id='Novo-lancamento'>Novo Lancamento</p>
            {/* Tipo-status */}
            <div className='Tipo-status-div'>
              {/* Escolha de Tipos */}
              <div className='Bloquinhos'>
                <p id='Descricao-text-inputs'>Tipo</p>
                <select
                  id='Tipo-status-select'
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e.target.value)}
                  className="TipoSelect"
                >
                  <option id='Tipo-status-options-receita' value="RECEITA">RECEITA</option>
                  <option id='Tipo-status-options-despesa' value="DESPESA">DESPESA</option>
                </select>
              </div>

              {/* Escolha de Status ---------------------------------------*/}
              <div className='Bloquinhos'>
                <p id='Descricao-text-inputs'>Status</p>
                <select
                  id='Tipo-status-select'
                  value={statusSelecionado}
                  onChange={(e) => setStatusSelecionado(e.target.value)}
                  className="StatusSelect"
                >
                  <option id='Tipo-status-options' value="PENDENTE">PENDENTE</option>
                  <option id='Tipo-status-options' value="PAGO">PAGO</option>
                </select>
              </div>
            </div>

            {/* Descrição ------------------------------------------------*/}
            <div className='Tipo-status-div'>
              <div className='Bloquinho-input-descricao'>
                <p id='Descricao-text-inputs'>Descrição</p>
                <input
                  placeholder='Ex: Salário, Conta de luz...'
                  id='Descricao-input'
                  onChange={(e) => setDescricaoSelecionada(e.target.value)}
                  type="text" />
              </div>
            </div>

            {/* Valor e Data de Vencimento ------------------------------------------------*/}
            <div className='Tipo-status-div'>
              {/* Escolha de Tipos */}
              <div className='Bloquinhos'>
                <p id='Descricao-text-inputs'>Valor</p>
                <input
                  id='input-valor'
                  type="text"
                  inputMode="decimal"
                  value={display} // "R$ 12,34"
                  onChange={(e) => {
                    formata_display_input(e); // continua formatando o display
                    const somenteNumeros = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
                    const valorNumerico = parseFloat(somenteNumeros) / 100; // converte para reais
                    setValorSelecionado(valorNumerico); // agora salva 12.34 (número real)
                  }}
                  placeholder="R$ 0,00"
                  autoComplete="off"
                />
                {/* campo oculto envia valor numérico para backend */}
                <input
                  type="hidden"
                  name="valor"
                  value={(raw / 100).toFixed(2)} // "12.34"
                />
              </div>

              {/* Escolha de Data ---------------------------------------*/}
              <div className='Bloquinhos'>
                <p id='Descricao-text-inputs'>Vencimento</p>
                <input
                  type="date"
                  id="data"
                  value={data}
                  onChange={(e) => {
                    formata_data(e);
                    setDataSelecionada(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* Tipo-status */}
            <div className='Tipo-status-div'>
              {/* Escolha de Tipos */}
              <div className='Bloquinhos'>
                <p id='Descricao-text-inputs'>Categoria</p>
                <select
                  id='Tipo-status-select-categoria'
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  disabled={!tipoSelecionado} // desabilita se não escolheu tipo
                >
                  <option id='Tipo-status-options-receita' value="">Selecione a categoria</option>
                  {tipoSelecionado === "DESPESA" &&
                    categoriasDespesa.map((cat) => (
                      <option id='Tipo-status-options-receita' key={cat} value={cat}>{cat}</option>
                    ))
                  }
                  {tipoSelecionado === "RECEITA" &&
                    categoriasReceita.map((cat) => (
                      <option id='Tipo-status-options-receita' key={cat} value={cat}>{cat}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='div-botao-cadastro'>
              <button onClick={cadastraLancamento} id='Botao-cadastra-lancamento'>CADASTRAR</button>
            </div>

          </div>
          {/* Lancamentos-grafico-IA */}
          <div className='Lancamentos-grafico-IA'>
            <div className='cabecalho-lancamentos'>
              <div className='caixa-lancamentos'>
                <p id='Lancamentos'>Lancamentos</p>
              </div>
              <div className='caixa-filtro-busca'>
                <button id='botao-dashboard' onClick={() => alert("Ainda não implementado!")}>🖥️ DASHBOARD</button>
                <img id='filtro-img' onClick={() => alert("Ainda não implementado!")} src={icon_filtro} alt="Carregando..." />
                <div className="search-box">
                  <img
                    src={icon_lupa}
                    className="icon"
                    onClick={() => alert(inputValue)}
                  />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={inputValue} // controlled input
                    onChange={(e) => setInputValue(e.target.value)} // atualiza a constante
                  />
                </div>
              </div>
            </div>
            <div className='Grupo-de-Lancamentos'>

              {/* Lancamentos-AQUI.............................................. */}
              {body_response.map((lancamento) => (
                <div key={lancamento.idLancamento} className='lancamento-block'>
                  <div className='descricao-edit-exclui'>
                    <div className='descricao-lancamento-block'>
                      <label id='descricao-lancamento-label' htmlFor="text">DESCRIÇÃO</label>
                      <p id='descricao-lancamento'>{lancamento.descricao}</p>
                    </div>
                    <div className='edita-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">EDITAR</label>
                      <img id='edita-img' src={edita} className="icon" onClick={() => abrirOverlay(lancamento)} />
                      {/* Overlay do editar ---------------------------------------------------- */}

                      {overlayVisivel && (
                        <div className='overlay'>
                          <div className='modal'>
                            <div>
                              <label id='Edita-label' htmlFor="text">Edita Lancamento</label>
                              <img id='edita-img' src={edita} className="icon" />
                            </div>
                            <label id='Edita-descricao' htmlFor="text">Descrição</label>
                            <input
                              placeholder='Descrição...'
                              type="text" name="nome"
                              defaultValue={descricaoEditada}
                              onChange={(e) => setDescricaoEditada(e.target.value)} />
                            <div id='Tipo-data-edita'>
                              <select value={opcaoTipo} onChange={(e) => setOpcao(e.target.value)}>
                                <option value="RECEITA">RECEITA</option>
                                <option value="DESPESA">DESPESA</option>
                              </select>
                              <input
                                type="date"
                                id="data"
                                value={dataSelecionadaEdita}
                                onChange={(e) => {
                                  formata_data(e);
                                  setDataSelecionadaEdita(e.target.value);
                                }}
                              />
                            </div>
                            <div id='Valor-categoria'>

                              <input
                                id='input-valor'
                                type="number"
                                inputMode="decimal"
                                defaultValue={lancamentoSelecionado?.preco} // "R$ 12,34"
                                onChange={(e) => {
                                  const valor = e.target.value;
                                  setValorEditado(valor === "" ? lancamentoSelecionado?.preco : valor);
                                }}
                                placeholder="R$ 0,00"
                                autoComplete="off"
                              />
                              <select
                                id='Tipo-status-select-categoria'
                                defaultValue={categoriaEdita}
                                onChange={(e) => setCategoriaEdita(e.target.value)}
                                disabled={!opcaoTipo} // desabilita se não escolheu tipo
                              >
                                <option value="">Selecione a categoria</option>

                                {opcaoTipo === "DESPESA" &&
                                  categoriasDespesaEdita.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))
                                }

                                {opcaoTipo === "RECEITA" &&
                                  categoriasReceitaEdita.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <button id='Atualizar-editar'
                              onClick={() => alert('Atualiza id ->: '
                                + lancamentoSelecionado?.idLancamento
                                + ' Descrição: '
                                + descricaoEditada
                                + ' Categoria: '
                                + categoriaEdita
                                + ' Tipo: '
                                + opcaoTipo
                                + ' Data: '
                                + dataSelecionadaEdita
                                + ' Valor: '
                                + valorEditado
                              )}>Atualizar Lançamento</button>
                            <br></br>
                            <button id='Fechar-editar' onClick={fecharOverlay}>Fechar</button>
                          </div>
                        </div>
                      )}

                    </div>
                    <div className='edita-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">EXCLUIR</label>
                      <img id='exclui-img' src={apaga} className="icon" onClick={() => alert("Excluir: " + lancamento.idLancamento)} />
                    </div>
                  </div>
                  <div className='tipo-valor-vencimento-etc'>
                    <div className='Tipo-lancamento-block'>
                      <label id='descricao-lancamento-label' htmlFor="text">TIPO</label>
                      <div style={{
                        backgroundColor: lancamento.tipo === "RECEITA" ? "#5EBB48" : "#dc3545"
                      }} id='Div-tipo-lancamento'>
                        <img
                          id="Iconseta-tipo" src={verificaSetaLancamento(lancamento.tipo)}
                          alt=""
                        />
                        <p id='Tipo-lancamento'>{lancamento.tipo}</p>
                      </div>
                    </div>
                    <div className='edita-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">VALOR</label>
                      <p id='Valor-lancamento'>{formatador(lancamento.preco)}</p>
                    </div>
                    <div className='edita-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">VENCIMENTO</label>
                      <p id='Vencimento-lancamento'>{lancamento.dataVencimento}</p>
                    </div>
                    <div className='edita-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">STATUS</label>
                      <div id='Div-status-lancamento'>
                        <select
                          id="Status-select-lancamento"
                          value={lancamento.status}
                          onChange={(e) => {
                            alert(`Status alterado para: ${e.target.value}`);
                            //Aqui colocar a function de alterar status no Back-End
                          }}
                          className="Status-Select"
                        >
                          <option value="PAGO">PAGO</option>
                          <option value="PENDENTE">PENDENTE</option>
                        </select>
                      </div>
                    </div>
                    <div className='Categoria-lancamento'>
                      <label id='descricao-lancamento-label' htmlFor="text">CATEGORIA</label>
                      <p id='Categoria-lancamento'>{lancamento.categoriaLancamento}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          {/* Final div Lancamentos*/}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;