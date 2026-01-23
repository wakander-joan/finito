import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./PlanosPage.css";
import Exit from '../../assets/back.gif';
import { useNavigate } from 'react-router-dom';
import add from '../../assets/add.png';
import apaga from '../../assets/apaga.png';

export default function PlanosPage() {
  // exemplo de dado vindo da API: "13/30"
  function calculaProgressValue(parcelasPagas, parcelastotais) {
    console.log(`${parcelasPagas}/${parcelastotais}`)
    const backendValue = `${parcelasPagas}/${parcelastotais}`;
    const [num, total] = backendValue.split("/").map(Number);
    const percentage = Math.round((num / total) * 100);
    return percentage;
  }

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

  const [anotacaoMeta, setAnotacaoMeta] = useState("");
  const [totalEtapas, setTotalEtapas] = useState(0);

  const [listaEtapas, setListaEtapas] = useState([]);

  const [descEtapaForm, setDescEtapaForm] = useState(false);
  const [anotacaoEtapa, setAnotacaoEtapa] = useState("");
  const [descricaoEtapa, setDescricaoEtapa] = useState("");
  const [metas, setMetas] = useState([]);


  const idUsuario = idPessoa;


  async function voltar_menu() {
    navigate('/cadastro')
  }

  const audioClick = new Audio("/click.mp3");
  const audioclickGTA = new Audio("/clickGTA.mp3");
  const audioPassedGTA5 = new Audio("/passedGTA5.mp3");

  const tocarSom = (som) => {
    som.currentTime = 0; // reinicia o áudio do começo
    som.play();
  };

  async function CadastraMeta(bodyJson) {
    alert("Entrou no cadastra Meta!")
    const response = await api.post(`/meta/cadastraMeta`, bodyJson);
    if (response.status === 403) {
      alert('⚠ Você precisa fazer login novamente!');
      localStorage.removeItem('token');
      navigate('/');
    }
    if (response.status === 201) {
      alert("Meta cadastrada com sucesso!")
      //const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
      if (response.status === 403) {
        alert('⚠ Você precisa fazer login novamente!');
        localStorage.removeItem('token');
        navigate('/');
      }
      console.log('Resultado:', response);
      //localStorage.setItem('body-response-array', JSON.stringify(response.data))
      window.location.reload()
      setShowForm(false);
      return;
    } else {
      alert(`⚠ Algo deu errado! Código: ${response.status}`);
      console.log('Algo deu errado!', response);
    }
  }

  //Função que busca as metas
  const carregarMetas = async () => {
    const response = await api.get(`/meta/buscaMetas`);

    if (response.status === 403) {
      alert('⚠ Você precisa fazer login novamente!');
      localStorage.removeItem('token');
      navigate('/');
    }
    if (response.status === 200) {
      localStorage.setItem('body-metas-array', JSON.stringify(response.data))
      console.log('Resposta: ', response.data);

    } else {
      alert(`⚠ Algo deu errado! Código: ${response.status}`);
      console.log('Algo deu errado!', response);
    }
  };

  useEffect(() => {
    const metasString = localStorage.getItem('body-metas-array');
    if (metasString) {
      const metasParsed = JSON.parse(metasString);
      console.log("metasParsed:", metasParsed);
      setMetas(metasParsed);
    }
  }, []);


  useEffect(() => {
    carregarMetas();
  }, []); // [] significa "executa só uma vez, quando o componente monta"

  return (
    <div className="page-container">
      <div className="cabecalho-planing">
        <p className="page-title">  METAS🪙  </p>
        <button className="criar" id="criar" onClick={() => { setShowForm(true); tocarSom(audioclickGTA); }} title="Criar nova meta!">NOVA META</button>
        <button className="criar" id="sair" onClick={() => { voltar_menu(); tocarSom(audioClick); }} title="Sair">🔙</button>
      </div>

      {/* Overlay Cria Meta*/}
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
                  placeholder="Data de Vencimento (dd-mm-aaaa)"
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
                  placeholder="Data de Vencimento (dd-mm-aaaa)"
                  value={dataAlvo}
                  onChange={(e) => setDataAlvo(e.target.value)}
                  id="data-plano"
                  required
                />
              </div>

              <div className="add-div">
                <img id='add' src={add} className="icon"
                  onClick={() => {
                    setDescEtapaForm(true);
                    //alert(`Adicionando mais uma etapa... \n Total de etapas ${totalEtapas + 1}`);
                    tocarSom(audioClick);
                  }} />
                <label id="Label-nova-etapa" htmlFor="text">Adicionar nova etapa...</label>
              </div>

              {descEtapaForm && (
                <div className="overlay">
                  <div className="modalMeta">
                    <label id="label-meta" htmlFor="text">Nome da nova etapa</label>
                    <input
                      type="text"
                      placeholder="Descrição etapa"
                      onChange={(e) =>
                        setDescricaoEtapa(e.target.value)
                      }
                    />

                    <label id="label-meta" htmlFor="text">Anotação</label>
                    <textarea
                      id="anotacao-meta"
                      className="anotacao-conteudo"
                      maxLength={255}
                      onChange={(e) => setAnotacaoEtapa(e.target.value)}
                      placeholder="Adicione uma anotação aqui..."
                    />

                    <button
                      className="botoes"
                      id="editar"
                      onClick={() => {
                        const proximoNumero = listaEtapas.length + 1; // pega o próximo número da etapa
                        setListaEtapas(prev => [
                          ...prev,
                          { numero: proximoNumero, descricao: descricaoEtapa, anotacao: anotacaoEtapa } // grava número + descrição
                        ]);
                        setTotalEtapas(prev => prev + 1); // opcional, se você quiser atualizar totalEtapas
                        setDescricaoEtapa(''); // limpa o input
                        setAnotacaoEtapa(''); // limpa o input
                        setDescEtapaForm(false)
                      }}
                    >
                      Gravar
                    </button>

                    <button
                      className="botoes"
                      id="editar"
                      onClick={() => { setDescEtapaForm(false) }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Aqui ele exibe a lista de Etapas...................................................................*/}
              {listaEtapas.map((etapa, index) => (
                <div className="etapa" key={index}>
                  <div id="etapa-subdiv">


                    <label id="descricao-etapa">Etapa {index + 1}: {etapa.descricao}</label> <br />

                    <div>
                      <img
                        id="del"
                        src={apaga}
                        className="icon"
                        onClick={() => {
                          tocarSom(audioclickGTA);

                          setTotalEtapas(prev => prev - 1);

                          // Remove a etapa clicada e reorganiza números
                          setListaEtapas(prev => {
                            const novaLista = [...prev];
                            novaLista.splice(index, 1); // remove a etapa
                            return novaLista; // indices vão servir como novo número
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
                <button
                  className="botoes"
                  type="button"
                  id="editar"
                  onClick={() => { // Mostrar todas as etapas
                    if (listaEtapas && listaEtapas.length > 0) {
                      alert(
                        JSON.stringify(
                          {
                            descricao: description,
                            anotacao: anotacaoMeta,
                            dataInicial: dataInicial,
                            dataAlvo: dataAlvo,
                            etapas: listaEtapas.map((etapa, index) => ({
                              numero: index + 1,
                              descricao: etapa.descricao,
                              anotacao: etapa.anotacao
                            }))
                          },
                          null,
                          2 // identação de 2 espaços
                        )
                      );

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
                      alert("⚠️ A meta deve ter no minimo uma etapa!")
                    }

                  }}
                >
                  Enviar
                </button>

                <button
                  className="botoes"
                  type="button"
                  onClick={() => { window.location.reload() }}
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

      {/*Começa overlayer de Metas.............................*/}
      {metas.length === 0 ? (
        <p className="text-center">Nenhuma meta foi encontrada...</p>
      ) : (
        <div className="planos-grid">
          {metas.map((metaBuscada) => (

            <div className="div-metas" key={metaBuscada.idMeta} >
              <div className="modalMetaBuscada">
                <p>descrição Meta: {metaBuscada.descricao}</p>
                <p>Anotação Meta: {metaBuscada.anotacao}`</p>

                {metaBuscada.etapas.map((etapa) => (
                  <div key={etapa.idEtapa}>
                    <p>Etapa {etapa.numero}</p>
                    <p>Descrição etapa: {etapa.descricao}</p>
                    <p>Anotação etapa: {etapa.anotacao}</p>
                  </div>
                ))}

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
