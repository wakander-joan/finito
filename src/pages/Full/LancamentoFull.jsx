import "../../index.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';
{/* Import's Lancamentos...........*/ }
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import icon_filtro from '../../assets/filtro.png';
import icon_lupa from '../../assets/lupa.png';
import edita from '../../assets/edita.png';
import apaga from '../../assets/apaga.png';
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from '../../assets/finito-logo.png';
import maximizar from '../../assets/maximizar.png';

function Lancamentos() {
    {/* Body-response-Geral.................................................................*/ }
    {/* Body iniciado antes das constantes para carregamento dos, VALORES & LANCAMENTOS.....*/ }
    let body_response = [];
    try {
        const stored = localStorage.getItem('body-response-array');
        //console.log(`${stored}`)
        //alert(stored)
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

    const navigate = useNavigate();
    const [overlayVisivel, setOverlayVisivel] = useState(false);
    const [descricaoEditada, setDescricaoEditada] = useState("");
    const [categoriaEdita, setCategoriaEdita] = useState("SALARIO");
    const [valorEditado, setValorEditado] = useState();
    const [dataSelecionadaEdita, setDataSelecionadaEdita] = useState("");
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
    const [opcaoTipo, setOpcao] = useState("RECEITA");
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState("");

    const categoriasDespesaEdita = [
        "MORADIA", "TRANSPORTE", "ALIMENTACAO", "SAUDE", "EDUCACAO",
        "LAZER", "VESTUARIO", "SERVICOS", "PETS", "IMPOSTOS", "OUTRAS_DESPESAS"
    ];
    const categoriasReceitaEdita = [
        "SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "INVESTIMENTOS",
        "REEMBOLSOS", "PREMIOS", "VENDAS", "AJUDAS", "OUTRAS_RECEITAS"
    ];

    const abrirOverlay = (lancamento) => {
        setDescricaoEditada(lancamento.descricao)
        setCategoriaEdita(lancamento.categoriaLancamento)
        setValorEditado(lancamento.preco)
        setDataSelecionadaEdita(lancamento.dataVencimento)
        setLancamentoSelecionado(lancamento);
        setOverlayVisivel(true);
    };

    const fecharOverlay = () => {
        setOverlayVisivel(false);
        setLancamentoSelecionado(null);
    };

    const tocarSom = (som) => {
        som.currentTime = 0;
        som.play();
    };

    const audioClick = new Audio("/click.mp3");
    const audioAtualiza = new Audio("/atualiza.mp3");

    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');

    function verificaSetaLancamento(tipo) {
        if (tipo === "RECEITA") {
            return setareceitas;
        } else if (tipo === "DESPESA") {
            return setadespesas;
        }
        return "";
    }

    function formatador(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    async function editaLancamento(body, id) {
        const response = await api.patch(`/lancamento/edita/${id}`, body);
        if (response.status === 403) {
            alert('⚠ Você precisa fazer login novamente!');
            localStorage.removeItem('token');
            navigate('/');
        }
        if (response.status === 200) {
            const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            if (response.status === 403) {
                alert('⚠ Você precisa fazer login novamente!');
                localStorage.removeItem('token');
                navigate('/');
            }
            console.log('Resultado:', response);
            localStorage.setItem('body-response-array', JSON.stringify(response.data))
            fecharOverlay();
            navigate('/full'); // Vai para login
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    return (
        <div className="div-total">
            <div className="div-cabeca-fora">
                <div className="cabeca">
                    <p></p>
                    <label id='Label-lancamentos' htmlFor="text">{messelecionado}/{anoSelecionado}</label>
                    <p
                        id="exit-lancamentos"
                        onClick={() => { navigate('/dashboard'); tocarSom(audioClick); }}
                    >Voltar</p>
                </div>
            </div>
            <div className='Grupo-de-Lancamentos-overlay'>
                {/* Lancamentos-AQUI.............................................. */}
                {body_response
                    .map((lancamento) => (
                        <div key={lancamento.idLancamento} className='lancamento-block'>
                            <div className='descricao-edit-exclui'>
                                <div className='descricao-lancamento-block'>
                                    <label id='descricao-lancamento-label' htmlFor="text">DESCRIÇÃO</label>
                                    <p id='descricao-lancamento'>{lancamento.descricao}</p>
                                </div>
                                {lancamento.idRecorrencia > 0 && (
                                    <p title='Esse é um Lançamento Recorrente!' id="recorrente">R</p>
                                )}

                                {lancamento.idParcela > 0 && (
                                    <p title='Esse é um Lançamento Parcelado!' id="parcelado">P</p>
                                )}

                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label' htmlFor="text">EDITAR</label>
                                    <img id='edita-img' src={edita} className="icon" onClick={() => { abrirOverlay(lancamento); tocarSom(audioClick); }} />

                                    {/* Overlay do editar ---------------------------------------------------- */}
                                    {overlayVisivel && (
                                        <div className='overlay'>
                                            <div className='modal-edita'>
                                                <div className='cabecalho-edita'>
                                                    <label id='Edita-label' htmlFor="text">Edita Lancamento</label>
                                                    <img id='edita-img-edita' src={edita} className="icon" />
                                                </div>
                                                <div className='Bloquinho-edita-descricao'>
                                                    <label id='Edita-descricao' htmlFor="text">Descrição</label>
                                                    <input
                                                        id='Edita-input-descricao'
                                                        maxLength={30}
                                                        placeholder='Descrição...'
                                                        type="text" name="nome"
                                                        defaultValue={descricaoEditada}
                                                        onChange={(e) => setDescricaoEditada(e.target.value)} />
                                                </div>
                                                <label id='Label-tipo' htmlFor="text">Tipo</label>
                                                <label id='Label-data' htmlFor="text">Data</label>
                                                <div id='Tipo-data-edita'>
                                                    <select className='Tipo-edita' value={opcaoTipo} onChange={(e) => setOpcao(e.target.value)}>
                                                        <option id='opção-edita' value="RECEITA">RECEITA</option>
                                                        <option id='opção-edita' value="DESPESA">DESPESA</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        id="data-edita"
                                                        value={data}
                                                        onChange={(e) => {
                                                            formata_data(e);
                                                            setDataSelecionadaEdita(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <label id='Label-tipo' htmlFor="text">Valor</label>
                                                <label id='Label-categoria' htmlFor="text">Categoria</label>
                                                <div id='Valor-categoria'>
                                                    <input
                                                        id='Input-valor'
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
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
                                                        defaultValue={categoria}
                                                        onChange={(e) => setCategoriaEdita(e.target.value)}
                                                    >
                                                        <option id='opção-edita' value="">SELECIONAR CATEGORIA</option>

                                                        {opcaoTipo === "DESPESA" &&
                                                            categoriasDespesaEdita.map((cat) => (
                                                                <option id='opção-edita' key={cat} value={cat}>{cat}</option>
                                                            ))
                                                        }

                                                        {opcaoTipo === "RECEITA" &&
                                                            categoriasReceitaEdita.map((cat) => (
                                                                <option id='opção-edita' key={cat} value={cat}>{cat}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='Botoes'>
                                                    <button
                                                        id="Botao-atualizar-editar"
                                                        onClick={() => {
                                                            tocarSom(audioAtualiza);

                                                            const semAcento = (str) =>
                                                                str
                                                                    .normalize("NFD")              // separa os caracteres e os acentos
                                                                    .replace(/[\u0300-\u036f]/g, "") // remove os acentos
                                                                    .toUpperCase();                // transforma em maiúscula


                                                            const bodyJson = {
                                                                descricao: descricaoEditada,
                                                                preco: valorEditado,
                                                                dataVencimento: dataSelecionadaEdita,
                                                                tipo: opcaoTipo,
                                                                categoriaLancamento: semAcento(categoriaEdita),
                                                            };

                                                            console.log(bodyJson);
                                                            editaLancamento(bodyJson, lancamentoSelecionado?.idLancamento)
                                                            setData('');
                                                        }
                                                        }
                                                    >
                                                        Atualizar
                                                    </button>

                                                    <button id='Fechar-editar' onClick={() => { tocarSom(audioClick); fecharOverlay(); }}>Fechar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                    <p id='Vencimento-lancamento'>{lancamento.dataVencimento.split("-").reverse().join("/")}</p>
                                </div>
                                <div className='edita-lancamento'>


                                </div>
                                <div className='Categoria-lancamento'>
                                    <label id='descricao-lancamento-label' htmlFor="text">CATEGORIA</label>
                                    <p
                                        style={{
                                            color: lancamento.categoriaLancamento === "Outras_Despesasas" ? "#4b4b4bff" : "#000000ff"
                                        }}
                                        id='Categoria-lancamento'>{lancamento.categoriaLancamento}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Lancamentos;