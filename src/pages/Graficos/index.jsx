import React, { useEffect, useState } from "react";
import apiPlanos from "../../services/apiPlanos";
import "./PlanosPage.css";
import Exit from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';

export default function PlanosPage() {
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
  const [dataVencimento, setDataVencimento] = useState("");

  const [ano, mes, dia] = dataVencimento.split("-");
  const dataFormatada = `${dia}-${mes}-${ano}`;

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
      {/* Overlay */}
      {showForm && (
        <div className="overlay">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">Novo Plano</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                step="0.01"
                placeholder="Digite o Valor R$"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <div className="Ceck-div">
                <label id="concluido">CONCLUIDO?</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="check-box"
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                  />
                </div>
              </div>

              <input
                type="number"
                placeholder="Digite o numero do mês..."
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Digite o Ano"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="date"
                placeholder="Data de Vencimento (dd-mm-aaaa)"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                id="data-plano"
                required
              />
              <div className="">

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
              <div className="div-botoes">
                <button className="botoes" id="status" onClick={() => alert('Mudar status ' + plano.id)}>🔁Status</button>
                <button className="botoes" id="editar" onClick={() => alert('Editar ' + index)}>✏️​Editar</button>
                <button className="botoes" id="excluir" onClick={() => alert('Excluir ' + index)}>❌​Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
