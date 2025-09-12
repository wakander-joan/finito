import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./PlanosPage.css";
import Exit from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';

export default function PlanosPage() {
  const [resposta, setRespostaDeep] = useState('');
  const API_KEY = 'sk-74cf215326ba4a9c901dd9966d7a3572';
  const [progressValue, setProgressValue] = useState(0);
  const [textoFinal, setTextoFinal] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [opcoesOverlay, setOpcoesOverlay] = useState([]);

  // exemplo de dado vindo da API: "13/30"
  useEffect(() => {
    const backendValue = "0/30";
    const [num, total] = backendValue.split("/").map(Number);
    const percentage = Math.round((num / total) * 100);
    setProgressValue(percentage);
  }, []);
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


    const responseTxt = await fetch("/prompt.txt");
    const txtConteudo = await responseTxt.text();

    const planoJson = JSON.stringify(plano);

    try {
      console.log("✅ Dados do plano:", plano);

      console.log(`${txtConteudo} ${planoJson}`);
      const respostaDeepSeek = await chamarAPI(`${txtConteudo} ${planoJson}`);
      console.log(respostaDeepSeek);
      alert('pause')
      const arrayDeJson = JSON.parse(respostaDeepSeek);
      abrirOverlayComOpcoes(arrayDeJson)

      /*const response = await api.post(`/meta/createMeta`, plano);
      if (response.status === 201) {
        setPlanos(response.data);
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      } */
     
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
    setShowOverlay(true);            // abre o modal
  };

  return (
    <div className="page-container">
      <div className="cabecalho-planing">
        <img onClick={voltar_menu} id="logo-exit-planing" src={Exit} alt="Finito" title="Voltar ao Menu!" />
        <p className="page-title">  METAS  </p>
        <button className="criar" id="criar" onClick={() => setShowForm(true)} title="Criar novo Plano!">CRIAR NOVA META</button>
      </div>
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
                  <button id="selecionar" onClick={() => alert(`Você selecionou a opção ${opcao.numeroDaOpcao}`)}>Selecionar</button>
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
                <progress value={progressValue} max="100"></progress>
                <span>{progressValue}%</span>
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
