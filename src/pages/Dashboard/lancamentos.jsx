
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


function Lancamentos() {
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

    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');
    const [loading, setLoading] = useState(false);

    {/* Const's Lancamentos.................*/ }
    const [inputValue, setInputValue] = useState("");

    {/* Edita .................*/ }
    const [overlayVisivel, setOverlayVisivel] = useState(false);
    const [overlayExclui, setOverlayExclui] = useState(false);
    const [dataSelecionadaEdita, setDataSelecionadaEdita] = useState("");
    const [categoriaEdita, setCategoriaEdita] = useState("SALARIO");
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
    const [opcaoTipo, setOpcao] = useState("RECEITA");
    const [descricaoEditada, setDescricaoEditada] = useState("");
    const [valorEditado, setValorEditado] = useState();
    const [categoria, setCategoria] = useState("");

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

    const abrirOverlayExclui = (lancamento) => {
        setLancamentoSelecionado(lancamento);
        setOverlayExclui(true);
    };

    const fecharOverlayExclui = () => {
        setOverlayExclui(false);
        setLancamentoSelecionado(null);
    };

    const confirmarExclusao = () => {
        alert("Excluindo lançamento ID: " + lancamentoSelecionado?.idLancamento);
        // Aqui você chama sua função de exclusão no backend
        fecharOverlayExclui();
    };


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
        <div className='Lancamentos-grafico-IA'>
            {overlayExclui && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "20px 0" }}>
                            Excluir o lançamento
                            <strong id='Descricao-id-exclui'> "{lancamentoSelecionado?.descricao}"</strong>?
                        </p>
                        <div className='Botoes-exclui'>
                            <button
                                id="Botao-excluir-sim"
                                onClick={confirmarExclusao}
                            >
                                Sim
                            </button>
                            <button
                                id="Botao-excluir-nao"
                                onClick={fecharOverlayExclui}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                            <div className='cabecalho-edita'>
                                                <label id='Edita-label' htmlFor="text">Edita Lancamento</label>
                                                <img id='edita-img-edita' src={edita} className="icon" />
                                            </div>
                                            <div className='Bloquinho-edita-descricao'>
                                                <label id='Edita-descricao' htmlFor="text">Descrição</label>
                                                <input
                                                    id='Edita-input-descricao'
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
                                                    value={dataSelecionadaEdita}
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
                                                    disabled={!opcaoTipo} // desabilita se não escolheu tipo
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
                                                    onClick={() =>
                                                        alert(
                                                            'Atualizando od id: ' + lancamentoSelecionado?.idLancamento + '\n' +
                                                            'Descrição: ' + descricaoEditada + '\n' +
                                                            'Categoria: ' + categoriaEdita + '\n' +
                                                            'Tipo: ' + opcaoTipo + '\n' +
                                                            'Data: ' + dataSelecionadaEdita + '\n' +
                                                            'Valor: ' + valorEditado
                                                        )
                                                    }
                                                >
                                                    Atualizar Lançamento
                                                </button>

                                                <button id='Fechar-editar' onClick={fecharOverlay}>Fechar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className='edita-lancamento'>
                                <label id='descricao-lancamento-label' htmlFor="text">EXCLUIR</label>
                                <img id='exclui-img' src={apaga} className="icon" onClick={() => abrirOverlayExclui(lancamento)} />
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
    );
}

export default Lancamentos;