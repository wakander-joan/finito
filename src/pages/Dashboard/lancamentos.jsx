
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
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');
    const [loading, setLoading] = useState(false);

    {/* Const's Lancamentos.................*/ }
    const [inputValue, setInputValue] = useState("");

    {/* Edita .................*/ }
    const [overlayVisivel, setOverlayVisivel] = useState(false);
    const [overlayExclui, setOverlayExclui] = useState(false);
    const [overlayDescricaoPDF, setOverlayDescricaoPDF] = useState(false);
    const [dataSelecionadaEdita, setDataSelecionadaEdita] = useState("");
    const [data, setData] = useState('');
    const [categoriaEdita, setCategoriaEdita] = useState("SALARIO");
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
    const [opcaoTipo, setOpcao] = useState("RECEITA");
    const [descricaoEditada, setDescricaoEditada] = useState("");
    const [valorEditado, setValorEditado] = useState();
    const [categoria, setCategoria] = useState("");
    const [descricaoPDF, setDescricaoPDF] = useState("");
    const [idsReplica, setIdsReplica] = useState([]);

    const formata_data = (e) => {
        setData(e.target.value); // já vem no formato yyyy-mm-dd
    };

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
        excluiLancamento(lancamentoSelecionado?.idLancamento)
        fecharOverlayExclui();
    };

    const confirmarExclusaoRecorrente = (dataVencimento) => {
        excluiLancamentosRecorrente(lancamentoSelecionado?.idRecorrencia, dataVencimento)
        fecharOverlayExclui();
    };

    const confirmarExclusaoParcelada = (dataVencimento) => {
        excluiLancamentosParcelados(lancamentoSelecionado?.idParcela, dataVencimento)
        fecharOverlayExclui();
    };

    async function alteraStatusPago(id) {
        const response = await api.patch(`/lancamento/statusPago/${id}`);
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
            navigate('/dashboard'); // Vai para login
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    async function alteraStatusPendente(id) {
        const response = await api.patch(`/lancamento/statusPendente/${id}`);
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
            navigate('/dashboard'); // Vai para login
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }


    async function excluiLancamento(id) {
        console.log(id)
        const response = await api.delete(`/lancamento/deletaLancamento/${id}`);
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
            navigate('/dashboard'); // Vai para login
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }
    async function excluiLancamentosRecorrente(id, dataVencimento) {
        console.log(id)
        //alert(`/lancamento/deletaAllLancamentoRecorrente/${id}/${dataVencimento}`)
        const response = await api.delete(`/lancamento/deletaAllLancamentoRecorrente/${id}/${dataVencimento}`);
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
            navigate('/dashboard'); // Recarrega a Pagina
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    async function excluiLancamentosParcelados(idParcela, dataVencimento) {
        console.log(idParcela)
        alert(`Vai excluir todas as parcelas! ${idParcela} - ${dataVencimento}`)
        const response = await api.delete(`/lancamento/deletaAllLancamentoParcelado/${idParcela}/${dataVencimento}`);
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
            navigate('/dashboard'); // Recarrega a Pagina
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    const [overlayReplica, setOverlayReplica] = useState(false);
    const [mesDestino, setMesDestino] = useState("");
    const [anoDestino, setAnoDestino] = useState("");

    const abrirOverlayReplica = (lancamento) => {
        setLancamentoSelecionado(lancamento);
        setOverlayReplica(true);
    };

    const fecharOverlayReplica = () => {
        setOverlayReplica(false);
        setLancamentoSelecionado(null);
        setMesDestino("");
    };

    const meses = {
        JANEIRO: 1,
        FEVEREIRO: 2,
        MARCO: 3,
        ABRIL: 4,
        MAIO: 5,
        JUNHO: 6,
        JULHO: 7,
        AGOSTO: 8,
        SETEMBRO: 9,
        OUTUBRO: 10,
        NOVEMBRO: 11,
        DEZEMBRO: 12
    };

    const numeroMes = meses[messelecionado];

    function confirmaReplica(idsReplica) {
        //alert('Entrou no comfirmaReplica!');

        if (Number(numeroMes) === Number(mesDestino)) {
            alert('Mês de destino igual ao mês atual! Escolha outro mês!');
            return;
        }
        const bodyJson = {
            mesDestino: Number(mesDestino),
            anoDestino: Number(anoDestino),
            idsLancamentos: idsReplica
        };
        console.log(bodyJson);
        //alert(`Esse é o Bady JSon ${JSON.stringify(bodyJson)}`);
        replicarLancamentos(bodyJson);
    };

    const nomeMeses = [
        "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    const nomeMes = nomeMeses[mesDestino - 1];
    console.log(nomeMes)
    async function replicarLancamentos(body) {
        const response = await api.post(`/lancamento/replicaLancamentos`, body);
        if (response.status === 403) {
            alert('⚠ Você precisa fazer login novamente!');
            localStorage.removeItem('token');
            navigate('/');
        }
        if (response.status === 201) {
            setIdsReplica([]);
            setOverlayReplica(false);
            const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${nomeMes}/${anoDestino}`);
            if (response.status === 403) {
                alert('⚠ Você precisa fazer login novamente!');
                localStorage.removeItem('token');
                navigate('/');
            }
            console.log(response);
            fecharOverlayReplica();
            localStorage.setItem('body-response-array', JSON.stringify(response.data))
            localStorage.setItem('mes-selecionado', nomeMes)
            localStorage.setItem('ano-selecionado', anoDestino)
            navigate('/dashboard')
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    // Array com meses em maiúsculo
    const mesesAno = [
        1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12
    ];

    const anos = [
        2025, 2026, 2027, 2028, 2029, 2030
    ];


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
            navigate('/dashboard'); // Vai para login
            return;
        } else {
            alert(`⚠ Algo deu errado! Código: ${response.status}`);
            console.log('Algo deu errado!', response);
        }
    }

    const gerarPDF = (descriao) => {
        // Recupera totais do localStorage
        const totalReceitas = localStorage.getItem("totalFormatadoReceitas") || "R$ 0,00";
        const totalDespesas = localStorage.getItem("totalFormatadoDespesas") || "R$ 0,00";
        const mediaTotal = localStorage.getItem("mediaTotalFormatado") || "R$ 0,00";
        const saldo = localStorage.getItem("saldoFormatado") || "R$ 0,00";
        let messelecionadoMinusculo = messelecionado.toLowerCase();
        let messelecionadoFormatado = messelecionadoMinusculo.charAt(0).toUpperCase() + messelecionadoMinusculo.slice(1);

        const doc = new jsPDF();

        doc.addImage(Logo, "PNG", 170, 2, 17, 15);
        // Título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(`Relatório Financeiro de ${messelecionadoFormatado} de ${anoSelecionado}`, 12, 10);

        // Tabela com receitas/despesas
        const colunas = ["Descrição", "Tipo", "Preço", "Vencimento", "Status", "Categoria"];
        const linhas = body_response.map((item) => [
            item.descricao,
            item.tipo,
            item.preco,
            item.dataVencimento,
            item.status,
            item.categoriaLancamento,
        ]);

        // ⚡ Aqui está a mudança
        autoTable(doc, {
            startY: 20,
            head: [colunas],
            body: linhas,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [42, 129, 123], textColor: 255 },

            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    let valorNumerico = Number(data.cell.raw);
                    let valorTexto = `R$\u00A0${valorNumerico.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;

                    // força ser uma única linha
                    data.cell.text = [valorTexto];
                    data.cell.styles.textColor = [0, 0, 0];
                }

                if (data.column.index === 4) {
                    const valorTexto = String(data.cell.raw).toUpperCase();
                    data.cell.text = [valorTexto];

                    if (valorTexto === 'PENDENTE') {
                        data.cell.styles.textColor = [255, 0, 0];
                    } else if (valorTexto === 'PAGO') {
                        data.cell.styles.textColor = [0, 128, 0];
                    } else {
                        data.cell.styles.textColor = [255, 255, 255];
                    }
                }

                if (data.column.index === 1) {
                    const valorTexto = String(data.cell.raw).toUpperCase();
                    data.cell.text = [valorTexto];

                    if (valorTexto === 'DESPESA') {
                        data.cell.styles.textColor = [255, 0, 0];
                    } else if (valorTexto === 'RECEITA') {
                        data.cell.styles.textColor = [0, 128, 0];
                    } else {
                        data.cell.styles.textColor = [255, 255, 255];
                    }
                }
            },
        });


        // 2️⃣ Tabela de Resumo
        const finalY = doc.lastAutoTable?.finalY || 5; // posição abaixo da primeira tabela
        const resumoColunas = ["RESUMO", "VALORES"];
        const resumoLinhas = [
            ["Total de Receitas", totalReceitas],
            ["Total de Despesas", totalDespesas],
            ["Média Total", mediaTotal],
            ["Saldo Atual", saldo],
        ];

        autoTable(doc, {
            startY: finalY + 15,
            head: [resumoColunas],
            body: resumoLinhas,
            styles: { fontSize: 11, cellPadding: 3 },
            headStyles: {
                fillColor: [255, 0, 0], // vermelho
                textColor: 255          // texto branco
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 1) { // só aplica na coluna de valores
                    const valorTexto = data.cell.raw;
                    const valorNumerico = Number(valorTexto.toString().replace(/[R$\s.]/g, "").replace(",", "."));

                    // Define a cor conforme a linha
                    switch (data.row.index) {
                        case 0: // Total de Receitas
                            data.cell.styles.textColor = [0, 128, 0]; // verde
                            break;
                        case 1: // Total de Despesas
                            data.cell.styles.textColor = [255, 0, 0]; // vermelho
                            break;
                        case 2: // Média Total
                            data.cell.styles.textColor = [0, 0, 0]; // azul
                            break;
                        case 3: // Saldo Final
                            data.cell.styles.textColor = valorNumerico >= 0 ? [255, 140, 0] : [255, 0, 0];
                            break;
                        default:
                            data.cell.styles.textColor = [0, 0, 0]; // fallback (preto)
                    }
                }
            },
        });


        if (descriao !== undefined && descriao !== "") {
            doc.setFontSize(16);
            doc.text(`ANOTAÇÃO:`, 20, doc.lastAutoTable.finalY + 30);

            doc.setTextColor(100)
            doc.setFontSize(14);
            doc.text(`${descriao}`, 20, doc.lastAutoTable.finalY + 40);
        }

        setDescricaoPDF("");

        window.open(doc.output("bloburl"), "_blank");
        //doc.save(`relatorio-financeiro-de-${messelecionado}.pdf`);
    };

    const audioPDF = new Audio("/pdf.mp3");
    const audioClick = new Audio("/click.mp3");
    const audioExcluir = new Audio("/excluir.mp3");
    const audioAtualiza = new Audio("/atualiza.mp3");
    const audioHover = new Audio("/hover.mp3");
    const passedGTA5 = new Audio("/passedGTA5.mp3");
    const clickGTA = new Audio("/clickGTA.mp3");

    const tocarSom = (som) => {
        som.currentTime = 0;
        som.play();
    };

    function ativaOverlayPDF() {

    }

    const [checkedExclui, setCheckedExclui] = useState(false);
    const [ckedExcluiParcelas, setCheckedExcluiParcelas] = useState(false);

    return (
        <div className='Lancamentos-grafico-IA'>
            {overlayDescricaoPDF && (
                <div className='overlayPDF'>
                    <div className='modalPDF'>
                        <button
                            id="fechar"
                            onClick={() => { tocarSom(audioClick); setOverlayDescricaoPDF(false); }}
                        >X</button>
                        <p id='Descricao-PDF' style={{ margin: "20px 0" }}>Quer adicionar uma descrição ao PDF?</p>
                        <textarea
                            id="mensagem"
                            rows="4"
                            cols="30"
                            placeholder="Digite aqui a sua descrição..."
                            onChange={(e) => setDescricaoPDF(e.target.value)}>
                        </textarea>

                        <div className='Botoes-PDF'>
                            <button
                                id="Botao-PDF-sim"
                                onClick={() => { tocarSom(audioPDF); gerarPDF(descricaoPDF); }}
                            >
                                Sim
                            </button>
                            <button
                                id="Botao-PDF-nao"
                                onClick={() => { tocarSom(audioPDF); setOverlayDescricaoPDF(false); gerarPDF(); }}
                            >
                                Sem descrição!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {overlayExclui && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "5px 0" }}>
                            Excluir o lançamento
                            <strong id='Descricao-id-exclui'> "{lancamentoSelecionado?.descricao}"</strong>?
                        </p>
                        {lancamentoSelecionado?.idRecorrencia > 0 && (
                            <div className='todos' >
                                <p id='exclui'>
                                    Excluir de todos os meses?
                                </p>

                                <label class="switch">
                                    <input
                                        onClick={() => tocarSom(audioHover)}
                                        type="checkbox"
                                        name="aceito"
                                        onChange={(e) => {
                                            setCheckedExclui(e.target.checked);
                                        }}
                                    />
                                    <span class="slider"></span>
                                </label>
                            </div>
                        )}

                        {lancamentoSelecionado?.idParcela > 0 && (
                            <div className='todos' >
                                <p id='exclui'>
                                    Excluir todas as Parcelas?
                                </p>

                                <label class="switch">
                                    <input
                                        onClick={() => tocarSom(audioHover)}
                                        type="checkbox"
                                        name="aceito"
                                        onChange={(e) => {
                                            setCheckedExcluiParcelas(e.target.checked);
                                        }}
                                    />
                                    <span class="slider"></span>
                                </label>
                            </div>
                        )}

                        <div className='Botoes-exclui'>
                            <button
                                id="Botao-excluir-sim"
                                onClick={() => {
                                    if (checkedExclui == true) {
                                        tocarSom(audioExcluir);
                                        setCheckedExclui(false);
                                        confirmarExclusaoRecorrente(lancamentoSelecionado.dataVencimento);
                                    } else {
                                        tocarSom(audioExcluir); confirmarExclusao();
                                    }

                                    if (ckedExcluiParcelas == true) {
                                        tocarSom(audioExcluir);
                                        setCheckedExcluiParcelas(false);
                                        confirmarExclusaoParcelada(lancamentoSelecionado.dataVencimento);
                                    }
                                }}
                            >
                                Sim
                            </button>
                            <button
                                id="Botao-excluir-nao"
                                onClick={() => { fecharOverlayExclui(); tocarSom(audioClick); }}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {overlayReplica && (
                <div className='overlay'>
                    <div className='modal'>
                        <div className='cabecalho-replica'>
                            <label id='Replica-label'>Replicar Lançamentos</label>
                        </div>
                        <div className='info-replica'>
                            <p id='Descricao-replica'>Ano atual:
                                <strong id='ano-base-replica'> {anoSelecionado}</strong>
                            </p>
                            <p id='Descricao-replica'>Mês atual:
                                <strong id='ano-base-replica'> {messelecionado}</strong>
                            </p>
                        </div>
                        <div className='selecao-horizontal-replica'>

                            <label id='text-replica'>Ano de destino:</label>
                            <select
                                onClick={() => tocarSom(audioClick)}
                                required
                                id='Select-replica-ano-mes'
                                value={anoDestino}
                                onChange={(e) => setAnoDestino(e.target.value)}
                            >
                                <option id='opção-edita' value="">SELECIONE</option>
                                {anos.map((ano, idx) => (
                                    <option id='opção-edita' key={idx} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                        <div className='selecao-horizontal-replica'>
                            <label id='text-replica'>Mês de destino:</label>
                            <select
                                onClick={() => tocarSom(audioClick)}
                                required
                                id='Select-replica-ano-mes'
                                value={mesDestino}
                                onChange={(e) => setMesDestino(e.target.value)}
                            >
                                <option id='opção-edita' value="">SELECIONE</option>
                                {mesesAno.map((mes, idx) => (
                                    <option id='opção-edita' key={idx} value={mes}>{mes}</option>
                                ))}
                            </select>
                        </div>
                        <div className='listagem-replica'>
                            {body_response
                                .map((lancamento) => (
                                    <div className='linha-horizontal-replica'>
                                        <p id='descricao-lancamento-replica'>{lancamento.descricao}</p>
                                        <label class="switch">
                                            <input
                                                onClick={() => tocarSom(clickGTA)}
                                                type="checkbox"
                                                name="aceito"
                                                onChange={(e) => {
                                                    const id = String(lancamento.idLancamento); // garante string única
                                                    setIdsReplica((prev) => [...prev, lancamento.idLancamento]);
                                                    console.log(typeof lancamento.idLancamento, lancamento.idLancamento);
                                                    //alert(id);
                                                }}
                                            />


                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                ))}
                        </div>

                        <div className='Botoes-replica'>
                            <button
                                id="Botao-excluir-nao"
                                //disabled={!mesDestino}
                                onClick={() => {
                                    if (mesDestino === "") {
                                        alert('Escolha o mês de destino!');
                                        return;
                                    }
                                    if (anoDestino === "") {
                                        alert('Escolha o ano de destino!');
                                        return;
                                    }
                                    if (idsReplica.length === 0) {
                                        alert('Escolha ao menos um lançamento para replicar!');
                                        return;
                                    }
                                    tocarSom(passedGTA5);
                                    confirmaReplica(idsReplica);
                                    //alert(idsReplica.map((id) => `${id}`).join("\n"));
                                }}
                            >
                                Confirmar
                            </button>
                            <button id="Botao-excluir-sim" onClick={() => { fecharOverlayReplica(); tocarSom(audioClick); }}>
                                Cancelar
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
                    <button id='botao-replica' onClick={() => { abrirOverlayReplica(); tocarSom(audioClick); }}>↪️REPLICAR</button>
                    <button title="Gerar um relatório detalhado do mês em PDF"
                        id='botao-dashboard' onClick={() => { tocarSom(audioClick); setOverlayDescricaoPDF(true); }}>📄Gerar-PDF</button>
                    <div className="search-box">
                        <img
                            src={icon_lupa}
                            className="icon"
                            onClick={() => alert(inputValue)}
                        />
                        <input
                            type="text"
                            maxLength={15}
                            placeholder="Pesquisar..."
                            value={inputValue} // controlled input
                            onChange={(e) => setInputValue(e.target.value)} // atualiza a constante
                        />
                    </div>
                </div>
            </div>
            <div className='Grupo-de-Lancamentos'>

                {/* Lancamentos-AQUI.............................................. */}
                {body_response
                    .filter((lancamento) => {
                        const texto = inputValue.toLowerCase();
                        return (
                            lancamento.descricao.toLowerCase().includes(texto) ||
                            lancamento.categoriaLancamento.toLowerCase().includes(texto) ||
                            lancamento.tipo.toLowerCase().includes(texto) ||
                            lancamento.status.toLowerCase().includes(texto) ||
                            lancamento.preco.toString().includes(texto)
                        );
                    })
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
                                <div className='edita-lancamento'>
                                    <label id='descricao-lancamento-label' htmlFor="text">EXCLUIR</label>
                                    <img id='exclui-img' src={apaga} className="icon" onClick={() => { abrirOverlayExclui(lancamento); tocarSom(audioClick); }} />
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
                                    <label id='descricao-lancamento-label' htmlFor="text">STATUS</label>
                                    <div id='Div-status-lancamento'>
                                        <select
                                            onClick={() => tocarSom(clickGTA)}
                                            style={{
                                                color: lancamento.status === "PAGO" ? "#00ad2eff" : "#da0012ff"
                                            }}
                                            id="Status-select-lancamento"
                                            value={lancamento.status}
                                            onChange={(e) => {
                                                if (e.target.value === "PAGO") {
                                                    alteraStatusPago(lancamento.idLancamento);
                                                    tocarSom(passedGTA5)
                                                } else {
                                                    alteraStatusPendente(lancamento.idLancamento);
                                                    tocarSom(audioExcluir)
                                                }
                                            }}
                                            className="Status-Select"
                                        >
                                            <option id='Tipo-status-options-receita' value="PAGO">PAGO</option>
                                            <option id='Tipo-status-options-despesa' value="PENDENTE">PENDENTE</option>
                                        </select>
                                    </div>
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
    );
}

export default Lancamentos;