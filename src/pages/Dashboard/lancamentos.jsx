import "../../index.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import edita from '../../assets/edita.png';
import escrevendo from '../../assets/escrevendo.png';
import apaga from '../../assets/apaga.png';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from '../../assets/finito-logo.png';

function Lancamentos() {
    let body_response = [];
    try {
        const stored = localStorage.getItem('body-response-array');
        if (stored) {
            body_response = JSON.parse(stored);
            if (!Array.isArray(body_response)) body_response = [];
        }
    } catch (err) {
        console.error("Erro ao ler body-response-array:", err);
        body_response = [];
    }

    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');

    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
    const [display, setDisplay] = useState('');
    const [valorEditado, setValorEditado] = useState(0);
    const [raw, setRaw] = useState(0);
    const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const [inputValue, setInputValue] = useState("");
    const [menuAcoesAberto, setMenuAcoesAberto] = useState(false);
    const [overlayVisivel, setOverlayVisivel] = useState(false);
    const [overlayExclui, setOverlayExclui] = useState(false);
    const [overlayDescricaoPDF, setOverlayDescricaoPDF] = useState(false);
    const [overlayAnotacao, setOverlayAnotacao] = useState(false);
    const [condicaoAnotacao, setCondicaoAnotacao] = useState(true);
    const [data, setData] = useState('');
    const [descricaoEditada, setDescricaoEditada] = useState("");
    const [anotacaoAtual, setAnotacaoAtual] = useState("");
    const [categoriaEdita, setCategoriaEdita] = useState("SALARIO");
    const [dataSelecionadaEdita, setDataSelecionadaEdita] = useState("");
    const [opcaoTipo, setOpcao] = useState("RECEITA");
    const [categoria, setCategoria] = useState("");
    const [descricaoPDF, setDescricaoPDF] = useState("");
    const [idsReplica, setIdsReplica] = useState([]);
    const [overlayReplica, setOverlayReplica] = useState(false);
    const [mesDestino, setMesDestino] = useState("");
    const [anoDestino, setAnoDestino] = useState("");
    const [checkedExclui, setCheckedExclui] = useState(false);
    const [ckedExcluiParcelas, setCheckedExcluiParcelas] = useState(false);

    const formata_data = (e) => setData(e.target.value);

    const abrirOverlay = (lancamento) => {
        setDescricaoEditada(lancamento.descricao);
        setCategoriaEdita(lancamento.categoriaLancamento);
        setValorEditado(lancamento.preco);
        setDataSelecionadaEdita(lancamento.dataVencimento);
        setLancamentoSelecionado(lancamento);
        setOverlayVisivel(true);
    };

    const fecharOverlay = () => { setOverlayVisivel(false); setLancamentoSelecionado(null); };

    const categoriasDespesaEdita = ["MORADIA", "TRANSPORTE", "ALIMENTACAO", "SAUDE", "EDUCACAO", "LAZER", "VESTUARIO", "SERVICOS", "PETS", "IMPOSTOS", "OUTRAS_DESPESAS"];
    const categoriasReceitaEdita = ["SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "INVESTIMENTOS", "REEMBOLSOS", "PREMIOS", "VENDAS", "AJUDAS", "OUTRAS_RECEITAS"];

    const abrirOverlayExclui = (lancamento) => { setLancamentoSelecionado(lancamento); setOverlayExclui(true); };
    const fecharOverlayExclui = () => { setOverlayExclui(false); setLancamentoSelecionado(null); };
    const confirmarExclusao = () => { excluiLancamento(lancamentoSelecionado?.idLancamento); fecharOverlayExclui(); };
    const confirmarExclusaoRecorrente = (dataVencimento) => { excluiLancamentosRecorrente(lancamentoSelecionado?.idRecorrencia, dataVencimento); fecharOverlayExclui(); };
    const confirmarExclusaoParcelada = (dataVencimento) => { excluiLancamentosParcelados(lancamentoSelecionado?.idParcela, dataVencimento); fecharOverlayExclui(); };

    async function alteraStatus(id, status) {
        const endpoint = status === 'PAGO' ? `/lancamento/statusPago/${id}` : `/lancamento/statusPendente/${id}`;
        const response = await api.patch(endpoint);
        if (response.status === 403) { alert('⚠ Você precisa fazer login novamente!'); localStorage.removeItem('token'); navigate('/'); return; }
        if (response.status === 200) {
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            navigate('/dashboard');
        }
    }

    async function excluiLancamento(id) {
        const response = await api.delete(`/lancamento/deletaLancamento/${id}`);
        if (response.status === 200) {
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            navigate('/dashboard');
        }
    }

    async function excluiLancamentosRecorrente(id, dataVencimento) {
        const response = await api.delete(`/lancamento/deletaAllLancamentoRecorrente/${id}/${dataVencimento}`);
        if (response.status === 200) {
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            navigate('/dashboard');
        }
    }

    async function excluiLancamentosParcelados(idParcela, dataVencimento) {
        alert(`Vai excluir todas as parcelas! ${idParcela} - ${dataVencimento}`);
        const response = await api.delete(`/lancamento/deletaAllLancamentoParcelado/${idParcela}/${dataVencimento}`);
        if (response.status === 200) {
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            navigate('/dashboard');
        }
    }

    const abrirOverlayReplica = (lancamento) => { setLancamentoSelecionado(lancamento); setOverlayReplica(true); };
    const fecharOverlayReplica = () => { setOverlayReplica(false); setLancamentoSelecionado(null); setMesDestino(""); };

    const meses = { JANEIRO: 1, FEVEREIRO: 2, MARCO: 3, ABRIL: 4, MAIO: 5, JUNHO: 6, JULHO: 7, AGOSTO: 8, SETEMBRO: 9, OUTUBRO: 10, NOVEMBRO: 11, DEZEMBRO: 12 };
    const numeroMes = meses[messelecionado];
    const nomeMeses = ["JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
    const nomeMes = nomeMeses[mesDestino - 1];
    const mesesAno = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const anos = [2025, 2026, 2027, 2028, 2029, 2030];

    function confirmaReplica(idsReplica) {
        if (Number(numeroMes) === Number(mesDestino) && anoSelecionado === anoDestino) { alert('Mês e Ano de destino igual! Escolha outro mês, ou outro Ano!'); return; }
        const bodyJson = { mesDestino: Number(mesDestino), anoDestino: Number(anoDestino), idsLancamentos: idsReplica };
        replicarLancamentos(bodyJson);
    }

    async function replicarLancamentos(body) {
        const response = await api.post(`/lancamento/replicaLancamentos`, body);
        if (response.status === 201) {
            setIdsReplica([]);
            setOverlayReplica(false);
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${nomeMes}/${anoDestino}`);
            fecharOverlayReplica();
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            localStorage.setItem('mes-selecionado', nomeMes);
            localStorage.setItem('ano-selecionado', anoDestino);
            navigate('/dashboard');
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
        }
    }

    function verificaSetaLancamento(tipo) {
        if (tipo === "RECEITA") return setareceitas;
        if (tipo === "DESPESA") return setadespesas;
        return "";
    }

    useEffect(() => {
        if (lancamentoSelecionado?.dataVencimento) {
            setDataSelecionadaEdita(new Date(lancamentoSelecionado.dataVencimento).toISOString().split("T")[0]);
        }
    }, [lancamentoSelecionado]);

    useEffect(() => {
        if (lancamentoSelecionado) {
            setOpcao(lancamentoSelecionado.tipo || "RECEITA");
            setCategoria(lancamentoSelecionado.categoria || "");
        }
    }, [lancamentoSelecionado]);

    useEffect(() => {
        if (lancamentoSelecionado?.preco != null) {
            const valor = lancamentoSelecionado.preco;
            setValorEditado(valor);
            setDisplay(valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
        } else {
            setDisplay('');
            setValorEditado(0);
        }
    }, [lancamentoSelecionado]);

    function formatador(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    async function editaLancamento(body, id) {
        const response = await api.patch(`/lancamento/edita/${id}`, body);
        if (response.status === 200) {
            const r = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${messelecionado}/${anoSelecionado}`);
            localStorage.setItem('body-response-array', JSON.stringify(r.data));
            fecharOverlay();
            navigate('/dashboard');
        }
    }

    const gerarPDF = (descriao) => {
        const totalReceitas = localStorage.getItem("totalFormatadoReceitas") || "R$ 0,00";
        const totalDespesas = localStorage.getItem("totalFormatadoDespesas") || "R$ 0,00";
        const mediaTotal = localStorage.getItem("mediaTotalFormatado") || "R$ 0,00";
        const saldo = localStorage.getItem("saldoFormatado") || "R$ 0,00";
        let mesFormatado = messelecionado.toLowerCase();
        mesFormatado = mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1);

        const doc = new jsPDF();
        doc.addImage(Logo, "PNG", 170, 2, 17, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(`Relatório Financeiro de ${mesFormatado} de ${anoSelecionado}`, 12, 10);

        const colunas = ["Descrição", "Tipo", "Preço", "Vencimento", "Status", "Categoria"];
        const linhas = body_response.map((item) => [item.descricao, item.tipo, item.preco, item.dataVencimento, item.status, item.categoriaLancamento, item.anotacao]);

        autoTable(doc, {
            startY: 20, head: [colunas], body: linhas,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [42, 129, 123], textColor: 255 },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const val = Number(data.cell.raw);
                    data.cell.text = [`R$\u00A0${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`];
                    data.cell.styles.textColor = [0, 0, 0];
                }
                if (data.column.index === 4) {
                    const v = String(data.cell.raw).toUpperCase();
                    data.cell.text = [v];
                    data.cell.styles.textColor = v === 'PENDENTE' ? [255, 0, 0] : v === 'PAGO' ? [0, 128, 0] : [255, 255, 255];
                }
                if (data.column.index === 1) {
                    const v = String(data.cell.raw).toUpperCase();
                    data.cell.text = [v];
                    data.cell.styles.textColor = v === 'DESPESA' ? [255, 0, 0] : v === 'RECEITA' ? [0, 128, 0] : [255, 255, 255];
                }
            },
        });

        const finalY = doc.lastAutoTable?.finalY || 5;
        autoTable(doc, {
            startY: finalY + 15,
            head: [["RESUMO", "VALORES"]],
            body: [["Total de Receitas", totalReceitas], ["Total de Despesas", totalDespesas], ["Média Total", mediaTotal], ["Saldo Atual", saldo]],
            styles: { fontSize: 11, cellPadding: 3 },
            headStyles: { fillColor: [255, 0, 0], textColor: 255 },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 1) {
                    const val = Number(data.cell.raw.toString().replace(/[R$\s.]/g, "").replace(",", "."));
                    const cores = [[0, 128, 0], [255, 0, 0], [0, 0, 0], val >= 0 ? [255, 140, 0] : [255, 0, 0]];
                    data.cell.styles.textColor = cores[data.row.index] || [0, 0, 0];
                }
            },
        });

        if (descriao) {
            doc.setFontSize(16);
            doc.text(`ANOTAÇÃO:`, 20, doc.lastAutoTable.finalY + 30);
            doc.setTextColor(100);
            doc.setFontSize(14);
            doc.text(`${descriao}`, 20, doc.lastAutoTable.finalY + 40);
        }

        setDescricaoPDF("");
        window.open(doc.output("bloburl"), "_blank");
    };

    const audioPDF = new Audio("/pdf.mp3");
    const audioClick = new Audio("/click.mp3");
    const audioExcluir = new Audio("/excluir.mp3");
    const audioAtualiza = new Audio("/atualiza.mp3");
    const passedGTA5 = new Audio("/passedGTA5.mp3");
    const clickGTA = new Audio("/clickGTA.mp3");

    const tocarSom = (som) => { som.currentTime = 0; som.play(); };

    function formata_display_input(e) {
        const digits = e.target.value.replace(/\D/g, "") || "0";
        const cents = parseInt(digits, 10);
        setRaw(cents);
        setDisplay(fmt.format(cents / 100));
    }

    return (
        <div className='Lancamentos-grafico-IA'>
            {overlayDescricaoPDF && (
                <div className='overlayPDF'>
                    <div className='modalPDF'>
                        <button id="fechar" onClick={() => { tocarSom(audioClick); setOverlayDescricaoPDF(false); }}>X</button>
                        <p id='Descricao-PDF' style={{ margin: "20px 0" }}>Quer adicionar uma descrição ao PDF?</p>
                        <textarea id="mensagem" rows="4" cols="30" placeholder="Digite aqui a sua descrição..." onChange={(e) => setDescricaoPDF(e.target.value)}></textarea>
                        <div className='Botoes-PDF'>
                            <button id="Botao-PDF-sim" onClick={() => { tocarSom(audioPDF); gerarPDF(descricaoPDF); }}>Sim</button>
                            <button id="Botao-PDF-nao" onClick={() => { tocarSom(audioPDF); setOverlayDescricaoPDF(false); gerarPDF(); }}>Sem descrição!</button>
                        </div>
                    </div>
                </div>
            )}

            {overlayExclui && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "5px 0" }}>
                            Excluir o lançamento <strong id='Descricao-id-exclui'>"{lancamentoSelecionado?.descricao}"</strong>?
                        </p>
                        {lancamentoSelecionado?.idRecorrencia > 0 && (
                            <div className='todos'>
                                <p id='exclui'>Excluir de todos os meses?</p>
                                <label className="switch">
                                    <input onClick={() => tocarSom(audioClick)} type="checkbox" onChange={(e) => setCheckedExclui(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        )}
                        {lancamentoSelecionado?.idParcela > 0 && (
                            <div className='todos'>
                                <p id='exclui'>Excluir todas as Parcelas?</p>
                                <label className="switch">
                                    <input onClick={() => tocarSom(audioClick)} type="checkbox" onChange={(e) => setCheckedExcluiParcelas(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        )}
                        <div className='Botoes-exclui'>
                            <button id="Botao-excluir-sim" onClick={() => {
                                if (checkedExclui) { tocarSom(audioExcluir); setCheckedExclui(false); confirmarExclusaoRecorrente(lancamentoSelecionado.dataVencimento); }
                                else { tocarSom(audioExcluir); confirmarExclusao(); }
                                if (ckedExcluiParcelas) { tocarSom(audioExcluir); setCheckedExcluiParcelas(false); confirmarExclusaoParcelada(lancamentoSelecionado.dataVencimento); }
                            }}>Sim</button>
                            <button id="Botao-excluir-nao" onClick={() => { fecharOverlayExclui(); tocarSom(audioClick); }}>Não</button>
                        </div>
                    </div>
                </div>
            )}

            {overlayReplica && (
                <div className='overlay'>
                    <div className='modal'>
                        <div className='cabecalho-replica'><label id='Replica-label'>Replicar Lançamentos</label></div>
                        <div className='info-replica'>
                            <p id='Descricao-replica'>Ano atual: <strong id='ano-base-replica'>{anoSelecionado}</strong></p>
                            <p id='Descricao-replica'>Mês atual: <strong id='ano-base-replica'>{messelecionado}</strong></p>
                        </div>
                        <div className='selecao-horizontal-replica'>
                            <label id='text-replica'>Ano de destino:</label>
                            <select onClick={() => tocarSom(audioClick)} required id='Select-replica-ano-mes' value={anoDestino} onChange={(e) => setAnoDestino(e.target.value)}>
                                <option value="">SELECIONE</option>
                                {anos.map((ano, idx) => <option key={idx} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                        <div className='selecao-horizontal-replica'>
                            <label id='text-replica'>Mês de destino:</label>
                            <select onClick={() => tocarSom(audioClick)} required id='Select-replica-ano-mes' value={mesDestino} onChange={(e) => setMesDestino(e.target.value)}>
                                <option value="">SELECIONE</option>
                                {mesesAno.map((mes, idx) => <option key={idx} value={mes}>{mes}</option>)}
                            </select>
                        </div>
                        <div className='listagem-replica'>
                            {body_response.map((lancamento) => (
                                <div key={lancamento.idLancamento} className='linha-horizontal-replica'>
                                    <p id='descricao-lancamento-replica'>{lancamento.descricao}</p>
                                    <label className="switch">
                                        <input onClick={() => tocarSom(clickGTA)} type="checkbox"
                                            onChange={() => setIdsReplica((prev) => [...prev, lancamento.idLancamento])} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className='Botoes-replica'>
                            <button id="Botao-excluir-nao" onClick={() => {
                                if (!mesDestino) { alert('Escolha o mês de destino!'); return; }
                                if (!anoDestino) { alert('Escolha o ano de destino!'); return; }
                                if (idsReplica.length === 0) { alert('Escolha ao menos um lançamento para replicar!'); return; }
                                tocarSom(passedGTA5); confirmaReplica(idsReplica);
                            }}>Confirmar</button>
                            <button id="Botao-excluir-sim" onClick={() => { fecharOverlayReplica(); tocarSom(audioClick); }}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CABEÇALHO LANCAMENTOS ── */}
            <div className='cabecalho-lancamentos'>

                {/* Linha 1: título + pesquisa + sanduíche */}
                <div className='cabecalho-lancamentos-linha1'>
                    <div className='caixa-lancamentos'>
                        <p id='Lancamentos'>Lancamentos</p>
                    </div>
                    <div className='caixa-filtro-busca'>
                        {/* Desktop */}
                        <div className="acoes-desktop">
                            <button id='botao-replica' onClick={() => { abrirOverlayReplica(); tocarSom(audioClick); }}>↪️REPLICAR</button>
                            <button title="Gerar PDF" id='botao-dashboard' onClick={() => { tocarSom(audioClick); setOverlayDescricaoPDF(true); }}>📄Gerar-PDF</button>
                        </div>
                        <div className="search-box">
                            <input type="text" maxLength={15} placeholder="Pesquisar..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        </div>
                        {/* Mobile: botão sanduíche */}
                        <button className="hamburger-acoes" onClick={() => setMenuAcoesAberto(!menuAcoesAberto)} aria-label="Ações">
                            {menuAcoesAberto ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Linha 2: botões expandidos no mobile */}
                {menuAcoesAberto && (
                    <div className="acoes-mobile-expandido">
                        <button id='botao-replica' onClick={() => { abrirOverlayReplica(); tocarSom(audioClick); setMenuAcoesAberto(false); }}>↪️ REPLICAR</button>
                        <button id='botao-dashboard' onClick={() => { tocarSom(audioClick); setOverlayDescricaoPDF(true); setMenuAcoesAberto(false); }}>📄 Gerar-PDF</button>
                    </div>
                )}
            </div>

            <div className='Grupo-de-Lancamentos'>
                {body_response
                    .filter((l) => {
                        const t = inputValue.toLowerCase();
                        return (
                            l.descricao.toLowerCase().includes(t) ||
                            l.categoriaLancamento.toLowerCase().includes(t) ||
                            l.tipo.toLowerCase().includes(t) ||
                            l.status.toLowerCase().includes(t) ||
                            l.preco.toString().includes(t) ||
                            l.anotacao.toString().includes(t) ||
                            l.idLancamento.toString().includes(t)
                        );
                    })
                    .map((lancamentoAtual) => (
                        <div key={lancamentoAtual.idLancamento} className='lancamento-block'>
                            <div className='descricao-edit-exclui'>
                                <div className='descricao-lancamento-block'>
                                    <label id='descricao-lancamento-label' htmlFor="text">DESCRIÇÃO</label>
                                    <p id='descricao-lancamento'>{lancamentoAtual.descricao}</p>
                                </div>
                                {lancamentoAtual.idRecorrencia > 0 && <p title='Lançamento Recorrente!' id="recorrente">R</p>}
                                {lancamentoAtual.idParcela > 0 && <p title='Lançamento Parcelado!' id="parcelado">P</p>}

                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>ANOTAÇÃO</label>
                                    <img id='edita-img' src={escrevendo} className="icon" onClick={() => { setAnotacaoAtual(lancamentoAtual.anotacao); setLancamentoSelecionado(lancamentoAtual); setOverlayAnotacao(true); tocarSom(audioClick); }} />
                                    {overlayAnotacao && (
                                        <div className='overlay2'>
                                            <div className='modal-anotacao'>
                                                <div className="botoes-div-anotacao">
                                                    <button id="fechar-anotacao" onClick={() => { setOverlayAnotacao(false); setCondicaoAnotacao(true); tocarSom(audioClick); }}>{condicaoAnotacao ? 'Fechar' : 'Cancelar'}</button>
                                                    {condicaoAnotacao
                                                        ? <button id="editar-anotacao" onClick={() => { setCondicaoAnotacao(false); tocarSom(audioExcluir); }}>Editar</button>
                                                        : <button id="salvar-anotacao" onClick={() => {
                                                            tocarSom(passedGTA5);
                                                            const bodyJson = {
                                                                descricao: lancamentoSelecionado?.descricao,
                                                                preco: lancamentoSelecionado?.preco,
                                                                dataVencimento: lancamentoSelecionado?.dataVencimento,
                                                                tipo: lancamentoSelecionado?.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
                                                                categoriaLancamento: lancamentoSelecionado?.categoriaLancamento?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
                                                                anotacao: anotacaoAtual === "" ? "   " : anotacaoAtual
                                                            };
                                                            setCondicaoAnotacao(true);
                                                            editaLancamento(bodyJson, lancamentoSelecionado?.idLancamento);
                                                            setOverlayAnotacao(false);
                                                        }}>Salvar</button>
                                                    }
                                                </div>
                                                <div className="anotacao-conteudo">
                                                    <textarea id="text-anotacao" className="anotacao-conteudo" value={anotacaoAtual || ""} readOnly={condicaoAnotacao} maxLength={255} onChange={(e) => setAnotacaoAtual(e.target.value)} placeholder="Sem anotação..." />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>EDITAR</label>
                                    <img id='edita-img' src={edita} className="icon" onClick={() => { abrirOverlay(lancamentoAtual); tocarSom(audioClick); }} />
                                    {overlayVisivel && (
                                        <div className='overlay'>
                                            <div className='modal-edita'>
                                                <div className='cabecalho-edita'>
                                                    <label id='Edita-label'>Edita Lancamento</label>
                                                    <img id='edita-img-edita' src={edita} />
                                                </div>
                                                <div className='Bloquinho-edita-descricao'>
                                                    <label id='Edita-descricao'>Descrição</label>
                                                    <input id='Edita-input-descricao' maxLength={40} placeholder='Descrição...' type="text" defaultValue={descricaoEditada} onChange={(e) => setDescricaoEditada(e.target.value)} />
                                                </div>
                                                <label id='Label-tipo'>Tipo</label>
                                                <label id='Label-data'>Data</label>
                                                <div id='Tipo-data-edita'>
                                                    <select className='Tipo-edita' value={opcaoTipo} onChange={(e) => setOpcao(e.target.value)}>
                                                        <option value="RECEITA">RECEITA</option>
                                                        <option value="DESPESA">DESPESA</option>
                                                    </select>
                                                    <input type="date" id="data-edita" value={data} onChange={(e) => { formata_data(e); setDataSelecionadaEdita(e.target.value); }} />
                                                </div>
                                                <label id='Label-tipo'>Valor</label>
                                                <label id='Label-categoria'>Categoria</label>
                                                <div id='Valor-categoria'>
                                                    <input id='Input-valor' type="text" inputMode="decimal" value={display}
                                                        onChange={(e) => {
                                                            formata_display_input(e);
                                                            const nums = e.target.value.replace(/\D/g, '');
                                                            setValorEditado(nums === '' ? lancamentoSelecionado?.preco || 0 : parseFloat(nums) / 100);
                                                            setDisplay((parseFloat(nums) / 100 || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                                                        }}
                                                        placeholder="R$ 0,00" autoComplete="off"
                                                    />
                                                    <select id='Tipo-status-select-categoria' defaultValue={categoria} onChange={(e) => setCategoriaEdita(e.target.value)}>
                                                        <option value="">SELECIONAR CATEGORIA</option>
                                                        {opcaoTipo === "DESPESA" && categoriasDespesaEdita.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                                        {opcaoTipo === "RECEITA" && categoriasReceitaEdita.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </div>
                                                <div className='Botoes'>
                                                    <button id="Botao-atualizar-editar" onClick={() => {
                                                        tocarSom(passedGTA5);
                                                        const semAcento = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                                                        editaLancamento({ descricao: descricaoEditada, preco: valorEditado, dataVencimento: dataSelecionadaEdita, tipo: opcaoTipo, categoriaLancamento: semAcento(categoriaEdita) }, lancamentoSelecionado?.idLancamento);
                                                        setData('');
                                                    }}>Atualizar</button>
                                                    <button id='Fechar-editar' onClick={() => { tocarSom(audioClick); fecharOverlay(); }}>Fechar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>EXCLUIR</label>
                                    <img id='exclui-img' src={apaga} className="icon" onClick={() => { abrirOverlayExclui(lancamentoAtual); tocarSom(audioClick); }} />
                                </div>
                            </div>

                            <div className='tipo-valor-vencimento-etc'>
                                <div className='Tipo-lancamento-block'>
                                    <label id='descricao-lancamento-label'>TIPO</label>
                                    <div style={{ backgroundColor: lancamentoAtual.tipo === "RECEITA" ? "#5EBB48" : "#dc3545" }} id='Div-tipo-lancamento'>
                                        <img id="Iconseta-tipo" src={verificaSetaLancamento(lancamentoAtual.tipo)} alt="" />
                                        <p id='Tipo-lancamento'>{lancamentoAtual.tipo}</p>
                                    </div>
                                </div>
                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>VALOR</label>
                                    <p id='Valor-lancamento'>{formatador(lancamentoAtual.preco)}</p>
                                </div>
                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>VENCIMENTO</label>
                                    <p id='Vencimento-lancamento'>{lancamentoAtual.dataVencimento.split("-").reverse().join("/")}</p>
                                </div>
                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label'>STATUS</label>
                                    <select
                                        onClick={() => tocarSom(clickGTA)}
                                        style={{ color: lancamentoAtual.status === "PAGO" ? "#00ad2eff" : "#da0012ff" }}
                                        id="Status-select-lancamento"
                                        value={lancamentoAtual.status}
                                        onChange={(e) => {
                                            if (e.target.value === "PAGO") { alteraStatus(lancamentoAtual.idLancamento, 'PAGO'); tocarSom(passedGTA5); }
                                            else { alteraStatus(lancamentoAtual.idLancamento, 'PENDENTE'); tocarSom(audioExcluir); }
                                        }}
                                    >
                                        <option value="PAGO">PAGO</option>
                                        <option value="PENDENTE">PENDENTE</option>
                                    </select>
                                </div>
                                <div className='Categoria-lancamento'>
                                    <label id='descricao-lancamento-label'>CATEGORIA</label>
                                    <p id='Categoria-lancamento'>{lancamentoAtual.categoriaLancamento}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Lancamentos;