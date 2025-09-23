import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./PlanosPage.css";
import Exit from '../../assets/back.gif';
import { useNavigate } from 'react-router-dom';
import loadingGif2 from '../../assets/loading5.gif'; // seu gif de loading
import loadingGif3 from '../../assets/load-loading7.gif'; // seu gif de loading

export default function PlanosPage() {

  const [resposta, setRespostaDeep] = useState('');
  const API_KEY = 'sk-74cf215326ba4a9c901dd9966d7a3572';
  const [showOverlay, setShowOverlay] = useState(false);
  const [opcoesOverlay, setOpcoesOverlay] = useState([]);
  const [loadingIA, setLoadingIA] = useState(false); 
  const [loadingIASave, setloadingIASave] = useState(false); 

  // exemplo de dado vindo da API: "13/30"
  function calculaProgressValue(parcelasPagas,parcelastotais){
    console.log(`${parcelasPagas}/${parcelastotais}`)
    const backendValue = `${parcelasPagas}/${parcelastotais}`;
    const [num, total] = backendValue.split("/").map(Number);
    const percentage = Math.round((num / total) * 100);
    return percentage;
  }


  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const anoSelecionado = localStorage.getItem("ano-selecionado");
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Constantes para armazenar os dados do formulário
  const [description, setDescription] = useState("");
  const [valueStart, setValueStart] = useState("");
  const [valueFinish, setValueFinish] = useState("");

  const [dataInicial, setDataInicio] = useState("");
  const [dataAlvo, setDataAlvo] = useState("");
  const idPessoa = localStorage.getItem("idPessoa");
  const [planoJsonText, setPlanoJson] = useState();
  const [idMetaCriada, setIdMetaCriada] = useState("");

  async function criaLancamentosMetas(opcao) {

    const responseTxt2 = await fetch("/prompt2.txt");
    const prompt = await responseTxt2.text();

    const opcaoMandar = {
      opcao: opcao.numeroDaOpcao,
      motivo: opcao.MotivoDaOpcao,
      numeroParcelas: opcao.numeroDeParcelasEValoresDelas
    }

    const opcaoJson = JSON.stringify(opcaoMandar);
    console.log(`${planoJsonText}\n\n${opcaoJson}\n\n${prompt}`);

    //alert('pausa')
    console.clear();
    setloadingIASave(true)
    const respostaDeepSeek = await chamarAPI(`${planoJsonText}\n\n${opcaoJson}\n\n${prompt}`);

    //Aqui Chamar a API para salvar a resposta do Deepseek + idMeta e idPessoa
    const respostaDeepSeekJson = JSON.parse(respostaDeepSeek);
    const idMeta = idMetaCriada;
    

    console.log(`${respostaDeepSeek} \n\n ${idMeta}`)

    alert('Continuar?')
    console.clear();
    try {
      const response = await api.post(`/lancamento/cadastraLancamentoEmLote/${idMeta}`, respostaDeepSeekJson);
      setloadingIASave(false)
      if (response.status === 201) {
        alert('Lancamentos cadastrados com sucesso!');
        window.location.reload();
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }

    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    }
      
  }

  //Adicionar uma animação de overlayer!

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plano = {
      description,
      dataInicial,
      dataAlvo,
      valorInicial: parseFloat(valueStart),
      valorAlvo: parseFloat(valueFinish),
      idUsuario: idPessoa,
    };

    const planoJson = JSON.stringify(plano);
    setPlanoJson(planoJson)
    const responseTxt = await fetch("/prompt.txt");
    const txtConteudo = await responseTxt.text();


    try {
      console.log("✅ Dados do plano:", plano);

      console.log(`${txtConteudo} ${planoJson}`);
      setShowForm(false)
      setLoadingIA(true)
      const respostaDeepSeek = await chamarAPI(`${txtConteudo} ${planoJson}`);
      setLoadingIA(false)
      console.log(respostaDeepSeek);
      const arrayDeJson = JSON.parse(respostaDeepSeek);
      setShowOverlay
      abrirOverlayComOpcoes(arrayDeJson)
      

      const responseDeep = await api.post(`/meta/createMeta`, plano);
      if (responseDeep.status === 201) {
        //setPlanos(responseDeep.data);
        const id = responseDeep.data.id;
        setIdMetaCriada(id)
        console.log(idMetaCriada);
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }

    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    }

    //window.location.reload();
    //setShowForm(false);
  };


  const idUsuario = idPessoa;

  async function buscaPlanos() {
    try {
      const response = await api.get(`/meta/getAllMeta/${idUsuario}`
      );
      if (response.status === 200) {
        setPlanos(response.data);
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    } finally {
      setLoading(false);
    }
  }


  async function mudarStatus(id) {
    try {
      const response = await apiPlanos.patch(`/planning/changeStatusPlanning/${id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    }

  }

  async function deletaPlano(id) {
    try {
      const response = await api.delete(`/meta/deleteMetaId/${id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    }

  }

  useEffect(() => {
    buscaPlanos();
  }, [anoSelecionado]);

  if (loading) {
    return <p>Carregando planos...</p>;
  }

  async function voltar_menu() {
    navigate('/cadastro')
  }


  // definir fora: const [resposta, setRespostaDeep] = useState('');

  const chamarAPI = async (prompt) => {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'Responda sempre em português do Brasil.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        // Log/erro amigável
        const text = await response.text();
        throw new Error(`Deepseek error ${response.status}: ${text}`);
      }
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      setRespostaDeep(content); // atualiza state
      return content; // retorna para uso imediato
    } catch (err) {
      console.error('Erro chamarAPI:', err);
      setRespostaDeep('');
      return ''; // fallback
    }
  };

  // State que controla o modal e recebe os dados

  // Função que recebe o array e abre o modal
  const abrirOverlayComOpcoes = (arrayDeOpcoes) => {
    setOpcoesOverlay(arrayDeOpcoes); // define os dados a serem exibidos
    setShowForm(false)
    setShowOverlay(true);            // abre o modal
  };

  return (
    <div className="page-container">
      <div className="cabecalho-planing">
        <img onClick={voltar_menu} id="logo-exit-planing" src={Exit} alt="Finito" title="Voltar ao Menu!" />
        <p className="page-title">  METAS  </p>
        <button className="criar" id="criar" onClick={() => setShowForm(true)} title="Criar novo Plano!">CRIAR NOVA META</button>
      </div>
      {/* Overlay de Loading */}
      {loadingIA && (
        <div className="loading-container">
          <img id="img_loading" src={loadingGif2} alt="Carregando..." />
          <p class="typing">Criando opções de Parcelamento...</p>
        </div>
      )}
      
      {loadingIASave && (
        <div className="loading-container">
          <img id="img_loading" src={loadingGif3} alt="Carregando..." />
          <p class="typing">Salvando Lançamentos...</p>
        </div>
      )}

      {showOverlay && (
        <div className="overlay">
          <div className="modal2">
            <div className="P-fechar">
              <h2>Opções</h2>
              <button id="Botao-fechar" onClick={() => setShowOverlay(false)}>Fechar</button>
            </div>
            <div className="opcoes-card">
              {opcoesOverlay.map((opcao) => (
                <div key={opcao.numeroDaOpcao} className="opcao-card">
                  <h2>Opção {opcao.numeroDaOpcao}</h2>
                  <p><strong>Motivo:</strong> {opcao.MotivoDaOpcao}</p>
                  <p><strong>Parcelas:</strong> {opcao.numeroDeParcelasEValoresDelas}</p>
                  <button id="selecionar" onClick={() => criaLancamentosMetas(opcao)}>Selecionar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay Cria Meta*/}
      {showForm && (
        <div className="overlay">
          <div className="modal">
            <h2 className="Titulo-New">Novo Plano</h2>

            <form id="div-input" onSubmit={handleSubmit} className="div-123">
              <label id="descricao" htmlFor="text">Descrição</label>
              <input
                type="text"
                placeholder="Escreva a descrição..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-descricao"
                required
              />

              <div className="caixinhas">
                <label htmlFor="text">Data Inicio 🚀</label>
                <input
                  type="date"
                  placeholder="Data de Vencimento (dd-mm-aaaa)"
                  value={dataInicial}
                  onChange={(e) => setDataInicio(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>

              <div className="caixinhas">
                <label htmlFor="text">Data Alvo 🎯</label>
                <input
                  type="date"
                  placeholder="Data de Vencimento (dd-mm-aaaa)"
                  value={dataAlvo}
                  onChange={(e) => setDataAlvo(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>
              <div className="caixinhas">
                <label htmlFor="text">Valor Inicial 🚀</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="R$ 00,00"
                  value={valueStart}
                  onChange={(e) => setValueStart(e.target.value)}
                  className="inputs-new-meta"
                  required
                />
              </div>
              <div className="caixinhas">
                <label htmlFor="text">Valor Alvo 🎯</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="R$ 00,00"
                  value={valueFinish}
                  onChange={(e) => setValueFinish(e.target.value)}
                  className="inputs-new-meta"
                  required
                />
              </div>

              <div className="div-botoes">
                <button
                  className="botoes"
                  type="submit"
                  id="editar"
                >
                  Salvar
                </button>

                <button
                  className="botoes"
                  type="button"
                  onClick={() => setShowForm(false)}
                  id="excluir"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* fin da Overlayer */}

      {/*Começa overlayer de Planos.............................*/}
      {/*Começa overlayer de Metas.............................*/}
      {planos.length === 0 ? (
        <p className="text-center">Nenhuma meta encontrada.</p>
      ) : (
        <div className="planos-grid">
          {planos.map((plano, index) => (
            <div key={index} className="plano-card">
              <h2 className="plano-title">{plano.description}</h2>

              <p className="plano-info">
                <strong>Valor Inicial:</strong> R$ {plano.valorInicial.toFixed(2)}
              </p>
              <p className="plano-info">
                <strong>Valor Alvo:</strong> R$ {plano.valorAlvo.toFixed(2)}
              </p>
              <p className="plano-info">
                <strong>Data Inicial:</strong>{" "}
                {plano.dataInicial ? plano.dataInicial.split("-").reverse().join("/") : "-"}
              </p>
              <p className="plano-info">
                <strong>Data Alvo:</strong>{" "}
                {plano.dataAlvo ? plano.dataAlvo.split("-").reverse().join("/") : "-"}
              </p>

              {/* Barra de porcentagem (mantida) */}
              <div className="progress-container">
                <label>Progresso... </label>
                <progress value={calculaProgressValue(plano.parcelasPagas, plano.parcelasTotais)} max="100"></progress>
                <span>{calculaProgressValue(plano.parcelasPagas, plano.parcelasTotais)}%</span>
              </div>

              <div className="div-botoes">
                <button
                  className="botoes"
                  id="status"
                  onClick={() => mudarStatus(plano.id)}
                >
                  🔁Status
                </button>
                <button
                  className="botoes"
                  id="editar"
                  onClick={() => alert("Editar " + index)}
                >
                  ✏️Editar
                </button>
                <button
                  className="botoes"
                  id="excluir"
                  onClick={() => deletaPlano(plano.id)}
                >
                  ❌Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
