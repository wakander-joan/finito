import { useEffect, useState } from "react";
import api from "../../services/api";
import "./PlanosPage.css";
import loadingGif2 from '../../assets/loading5.gif';
import goku from '../../assets/loading3 - Copia.gif';
import { useNavigate } from 'react-router-dom';
import add from '../../assets/add.png';
import apaga from '../../assets/apaga.png';

export default function PlanosPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [dataInicial, setDataInicio] = useState("");
  const [dataAlvo, setDataAlvo] = useState("");
  const [anotacaoMeta, setAnotacaoMeta] = useState("");
  const [totalEtapas, setTotalEtapas] = useState(0);
  const [listaEtapas, setListaEtapas] = useState([]);
  const [descEtapaForm, setDescEtapaForm] = useState(false);
  const [anotacaoEtapa, setAnotacaoEtapa] = useState("");
  const [descricaoEtapa, setDescricaoEtapa] = useState("");
  const [metas, setMetas] = useState([]);

  const statusColors = {
    PENDENTE: "#949494e7",
    EMANDAMENTO: "#7700ff",
    IMPEDIDA: "#ff0000",
    CONCLUIDA: "#00ad2e"
  };

  const audioClick = new Audio("/click.mp3");
  const audioclickGTA = new Audio("/clickGTA.mp3");
  const audioPassedGTA5 = new Audio("/passedGTA5.mp3");
  const audioAtualiza = new Audio("/atualiza.mp3");
  const clickGTA = new Audio("/clickGTA.mp3");

  const tocarSom = (som) => {
    som.currentTime = 0;
    som.play();
  };

  async function voltar_menu() {
    navigate('/cadastro');
  }

  async function CadastraMeta(bodyJson) {
    alert("Entrou no cadastra Meta!");
    const response = await api.post(`/meta/cadastraMeta`, bodyJson);
    if (response.status === 403) {
      alert('⚠ Você precisa fazer login novamente!');
      localStorage.removeItem('token');
      navigate('/');
    }
    if (response.status === 201) {
      alert("Meta cadastrada com sucesso!");
      window.location.reload();
      setShowForm(false);
    } else {
      alert(`⚠ Algo deu errado! Código: ${response.status}`);
    }
  }

  const carregarMetas = async () => {
    const response = await api.get(`/meta/buscaMetas`);
    if (response.status === 403) {
      alert('⚠ Você precisa fazer login novamente!');
      localStorage.removeItem('token');
      navigate('/');
    }
    if (response.status === 200) {
      localStorage.setItem('body-metas-array', JSON.stringify(response.data));
    } else {
      alert(`⚠ Algo deu errado! Código: ${response.status}`);
    }
  };

  useEffect(() => {
    const metasString = localStorage.getItem('body-metas-array');
    if (metasString) {
      setMetas(JSON.parse(metasString));
    }
  }, []);

  useEffect(() => {
    carregarMetas();
  }, []);

  async function alteraStatusEtapa(status, idEtapa) {
    setLoading(true);
    const response = await api.patch(`/meta/alteraStatusEtapa/${idEtapa}/${status}`);
    if (response.status === 403) {
      alert('⚠ Você precisa fazer login novamente!');
      localStorage.removeItem('token');
      navigate('/');
    }
    if (response.status === 204) {
      carregarMetas();
      setTimeout(() => {
        setLoading(false);
        tocarSom(audioAtualiza);
        setTimeout(() => { window.location.reload(); }, 500);
      }, 1500);
    } else {
      alert(`⚠ Algo deu errado! Código: ${response.status}`);
    }
  }

  return (
    <div className="page-container">
      <div className="cabecalho-planing">
        <p className="page-title">METAS🪙</p>
        <button className="criar" id="criar" onClick={() => { setShowForm(true); tocarSom(audioclickGTA); }} title="Criar nova meta!">NOVA META</button>
        <button className="criar" id="sair" onClick={() => { voltar_menu(); tocarSom(audioClick); }} title="Sair">🔙</button>
      </div>

      {loading && (
        <div className="loading-container">
          <img id='saindo' src={loadingGif2} alt="Carregando..." />
        </div>
      )}

      {showForm && (
        <div className="overlay">
          <div className="modalMeta">
            <h2 className="Titulo-New">Nova Meta🚀</h2>
            <form id="div-input" className="div-123">
              <label id="label-meta" htmlFor="text">Descrição</label>
              <input
                id="descricao-meta"
                type="text"
                placeholder="Escreva a descrição..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-descricao"
                required
              />

              <label id="label-meta" htmlFor="text">Anotação</label>
              <textarea
                id="anotacao-meta"
                className="anotacao-conteudo"
                maxLength={255}
                onChange={(e) => setAnotacaoMeta(e.target.value)}
                placeholder="Adicione uma anotação aqui..."
              />

              <div className="caixinhas">
                <label htmlFor="text">Data Inicio🗓️</label>
                <input
                  onClick={() => tocarSom(audioclickGTA)}
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicio(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>

              <div className="caixinhas">
                <label htmlFor="text">Data Alvo📅</label>
                <input
                  onClick={() => tocarSom(audioclickGTA)}
                  type="date"
                  value={dataAlvo}
                  onChange={(e) => setDataAlvo(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>

              <div className="add-div">
                <img id='add' src={add} className="icon"
                  onClick={() => { setDescEtapaForm(true); tocarSom(audioClick); }} />
                <label id="Label-nova-etapa" htmlFor="text">Adicionar nova etapa...</label>
              </div>

              {descEtapaForm && (
                <div className="overlay">
                  <div className="modalMeta">
                    <label id="label-meta" htmlFor="text">Nome da nova etapa</label>
                    <input
                      type="text"
                      placeholder="Descrição etapa"
                      onChange={(e) => setDescricaoEtapa(e.target.value)}
                    />
                    <label id="label-meta" htmlFor="text">Anotação</label>
                    <textarea
                      id="anotacao-meta"
                      className="anotacao-conteudo"
                      maxLength={255}
                      onChange={(e) => setAnotacaoEtapa(e.target.value)}
                      placeholder="Adicione uma anotação aqui..."
                    />
                    <button className="botoes" id="editar" onClick={() => {
                      setListaEtapas(prev => [...prev, { numero: prev.length + 1, descricao: descricaoEtapa, anotacao: anotacaoEtapa }]);
                      setTotalEtapas(prev => prev + 1);
                      setDescricaoEtapa('');
                      setAnotacaoEtapa('');
                      setDescEtapaForm(false);
                    }}>Gravar</button>
                    <button className="botoes" id="editar" onClick={() => setDescEtapaForm(false)}>Cancelar</button>
                  </div>
                </div>
              )}

              {listaEtapas.map((etapa, index) => (
                <div className="etapa" key={index}>
                  <div id="etapa-subdiv">
                    <label id="descricao-etapa">Etapa {index + 1}: {etapa.descricao}</label>
                    <div>
                      <img id="del" src={apaga} className="icon"
                        onClick={() => {
                          tocarSom(audioclickGTA);
                          setTotalEtapas(prev => prev - 1);
                          setListaEtapas(prev => {
                            const novaLista = [...prev];
                            novaLista.splice(index, 1);
                            return novaLista;
                          });
                        }}
                      />
                    </div>
                  </div>
                  <textarea
                    id="anotacao-textarea"
                    className="anotacao-conteudo"
                    value={etapa.anotacao === "" ? "Sem anotação..." : "Anotação da etapa: \n" + etapa.anotacao}
                    readOnly={false}
                  />
                </div>
              ))}

              <div className="div-botoes">
                <button className="botoes" type="button" id="editar"
                  onClick={() => {
                    if (listaEtapas && listaEtapas.length > 0) {
                      const bodyJson = {
                        descricao: description,
                        anotacao: anotacaoMeta,
                        dataInicial: dataInicial,
                        dataAlvo: dataAlvo,
                        etapas: listaEtapas.map((etapa, index) => ({
                          numero: index + 1,
                          descricao: etapa.descricao,
                          anotacao: etapa.anotacao
                        }))
                      };
                      CadastraMeta(bodyJson);
                    } else {
                      alert("⚠️ A meta deve ter no mínimo uma etapa!");
                    }
                  }}
                >Enviar</button>
                <button className="botoes" type="button" onClick={() => window.location.reload()} id="excluir">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {metas.length === 0 ? (
        <p className="text-center">Nenhuma meta foi encontrada...</p>
      ) : (
        <div className="planos-grid">
          {metas.map((metaBuscada) => {
            const porcentagem = metaBuscada.totalEtapas > 0
              ? Math.round((metaBuscada.totalEtapasConcluidas / metaBuscada.totalEtapas) * 100)
              : 0;

            return (
              <div className="div-metas" key={metaBuscada.idMeta}>
                <div className="modalMetaBuscada">
                  <div className="texto-caixa">
                    <h2 id="label-meta-map">Descrição Meta:</h2>
                    <h2>{metaBuscada.descricao}</h2>
                  </div>
                  <p>Anotação Meta: {metaBuscada.anotacao}</p>

                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${porcentagem}%` }} />
                    <img id='img-gokui-barra' src={goku} className="icon" />
                    <p className="progress-text">{porcentagem}%</p>
                  </div>

                  {metaBuscada.etapas
                    .slice()
                    .sort((a, b) => a.numero - b.numero)
                    .map((etapa) => (
                      <div className="etapa-div" key={etapa.idEtapa}>
                        <p>Etapa {etapa.numero}</p>
                        <p>Descrição etapa: {etapa.descricao}</p>
                        <p>Anotação etapa: {etapa.anotacao}</p>
                        <div>
                          <p>Status</p>
                          <select
                            className="Status-Select"
                            id="Status-select-lancamento"
                            style={{ color: statusColors[etapa.status] || "#00cbfd" }}
                            value={etapa.status}
                            onChange={(e) => {
                              const statusString = e.target.value.replace(/\s/g, "_").toUpperCase();
                              tocarSom(audioPassedGTA5);
                              alteraStatusEtapa(statusString, etapa.idEtapa);
                            }}
                            onClick={() => tocarSom(clickGTA)}
                          >
                            <option id="Tipo-status-options-PENDENTE" value="PENDENTE">PENDENTE</option>
                            <option id="Tipo-status-options-EMANDAMENTO" value="EMANDAMENTO">EMANDAMENTO</option>
                            <option id="Tipo-status-options-IMPEDIDA" value="IMPEDIDA">IMPEDIDA</option>
                            <option id="Tipo-status-options-CONCLUIDA" value="CONCLUIDA">CONCLUIDA</option>
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}