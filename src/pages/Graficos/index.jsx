import React, { useEffect, useState } from "react";
import apiPlanos from "../../services/apiPlanos";
import "./PlanosPage.css";
import Exit from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';

export default function PlanosPage() {
  const [progressValue, setProgressValue] = useState(0);

  // exemplo de dado vindo da API: "13/30"
  useEffect(() => {
    const backendValue = "20/30";
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
  const [value, setValue] = useState("");
  const [completed, setCompleted] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataAlvo, setDataAlvo] = useState("");
  const [dataFormatadaInicio, setDataFormatadaInicio] = useState("");
  const [dataFormatadaAlvo, setDataFormatadaAlvo] = useState("");

  useEffect(() => {
    if (dataInicio) {
      const [ano, mes, dia] = dataInicio.split("-");
      setDataFormatadaInicio(`${dia}-${mes}-${ano}`);
    } else {
      setDataFormatadaInicio("");
    }
  }, [dataInicio]);

  useEffect(() => {
    if (dataAlvo) {
      const [ano, mes, dia] = dataAlvo.split("-");
      setDataFormatadaAlvo(`${dia}-${mes}-${ano}`);
    } else {
      setDataFormatadaAlvo("");
    }
  }, [dataAlvo]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const plano = {
      description,
      value: parseFloat(value),
      completed,
      month: Number(month),
      year: Number(year),
      dataVencimento: dataFormatada,
    };

    console.log("✅ Dados do plano:", plano);

    try {
      const response = await apiPlanos.post(`/planning/createPlanning`, plano);
      if (response.status === 201) {
        setPlanos(response.data);
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert("⚠ Erro ao buscar planos!");
    }
    window.location.reload();
    setShowForm(false);
  };

  async function buscaPlanos() {
    try {
      const response = await apiPlanos.get(`/planning/getAllPlanning/${anoSelecionado}`
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
      const response = await apiPlanos.delete(`/planning/deletePlanningId/${id}`
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

  return (
    <div className="page-container">
      <div className="cabecalho-planing">
        <img onClick={voltar_menu} id="logo-exit-planing" src={Exit} alt="Finito" title="Voltar ao Menu!" />
        <p className="page-title">PLANOS DE {anoSelecionado}</p>
        <button className="criar" id="criar" onClick={() => setShowForm(true)} title="Criar novo Plano!">🆕​PLANO</button>
      </div>
      {/* Overlay Cria Planning*/}
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
                  value={dataFormatadaInicio}
                  onChange={(e) => setDataFormatadaInicio(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>

              <div className="caixinhas">
                <label htmlFor="text">Data Alvo 🎯</label>
                <input
                  type="date"
                  placeholder="Data de Vencimento (dd-mm-aaaa)"
                  value={dataFormatadaAlvo}
                  onChange={(e) => setDataFormatadaAlvo(e.target.value)}
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
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
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
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
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
      {planos.length === 0 ? (
        <p className="text-center">Nenhum plano encontrado.</p>
      ) : (
        <div className="planos-grid">
          {planos.map((plano, index) => (
            <div key={index} className="plano-card">
              <h2 className="plano-title">{plano.description}</h2>
              <p className="plano-info">
                <strong>Valor:</strong> R$ {plano.value.toFixed(2)}
              </p>
              <p className="plano-info">
                <strong>Status:</strong>{" "}
                {plano.completed ? "Concluído ✅" : "Pendente ⏳"}
              </p>
              <p className="plano-info">
                <strong>Mês/Ano:</strong> {plano.month}/{plano.year}
              </p>
              <p className="plano-info">
                <strong>Vencimento:</strong>{" "}
                {plano.dataVencimento
                  ? plano.dataVencimento.split("-").join("/")
                  : "-"}
              </p>
              {/* Barra de porcentagem */}
              <div className="progress-container">
                <label>Progresso... </label>
                <progress value={progressValue} max="100"></progress>
                <span>{progressValue}%</span>
              </div>
              <div className="div-botoes">
                <button className="botoes" id="status" onClick={() => mudarStatus(plano.id)}>🔁Status</button>
                <button className="botoes" id="editar" onClick={() => alert('Editar ' + index)}>✏️​Editar</button>
                <button className="botoes" id="excluir" onClick={() => deletaPlano(plano.id)}>❌​Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
