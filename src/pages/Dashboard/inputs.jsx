import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';

function Imputs() {
    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const mesSelecionado = localStorage.getItem('mes-selecionado');

    const [display, setDisplay] = useState("R$ 0,00");
    const [raw, setRaw] = useState(0);
    const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const [data, setData] = useState(() => {
        const ano = localStorage.getItem("ano-selecionado");
        const mes = localStorage.getItem("mes-selecionado");
        const dia = new Date().getDate().toString().padStart(2, "0");
        if (ano && mes) return `${ano}-${mes.padStart(2, "0")}-${dia}`;
        return new Date().toISOString().split("T")[0];
    });
    const [tipoSelecionado, setTipoSelecionado] = useState("DESPESA");
    const [statusSelecionado, setStatusSelecionado] = useState("PENDENTE");
    const [dataSelecionada, setDataSelecionada] = useState("");
    const [valorSelecionado, setValorSelecionado] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricaoSelecionada, setDescricaoSelecionada] = useState("");
    const [checkRecorrente, setCheckRecorrente] = useState(false);
    const [checkParcelado, setCheckParcelado] = useState(false);
    const [divParcelas, setDivParcelas] = useState(false);
    const [campoAnotacao, setCampoAnotacao] = useState(false);
    const [anotacao, setAnotacao] = useState("");
    const [numeroParcelas, setNumeroParcelas] = useState(0);

    const categoriasDespesa = [
        "MORADIA", "TRANSPORTE", "ALIMENTACAO", "SAUDE", "EDUCACAO",
        "LAZER", "VESTUARIO", "SERVICOS", "PETS", "IMPOSTOS", "OUTRAS_DESPESAS"
    ];
    const categoriasReceita = [
        "SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "INVESTIMENTOS",
        "REEMBOLSOS", "PREMIOS", "VENDAS", "AJUDAS", "OUTRAS_RECEITAS"
    ];

    const formata_data = (e) => setData(e.target.value);

    function formatYMD(date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) return '';
        return date.toISOString().substring(0, 10);
    }

    useEffect(() => {
        const ano = Number(anoSelecionado);
        const mes = Number(mesSelecionado);
        if (!Number.isInteger(ano) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            setData('');
            return;
        }
        const dt = new Date(ano, mes - 1, 1);
        if (isNaN(dt.getTime())) { setData(''); return; }
        setData(formatYMD(dt));
    }, [anoSelecionado, mesSelecionado]);

    function formata_display_input(e) {
        const digits = e.target.value.replace(/\D/g, "") || "0";
        const cents = parseInt(digits, 10);
        setRaw(cents);
        setDisplay(fmt.format(cents / 100));
    }

    async function recarrega_pagina_apos_cadastrar(mes) {
        const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
        if (response.status === 403) {
            alert('⚠ Você precisa fazer login novamente!');
            localStorage.removeItem('token');
            navigate('/');
        }
        localStorage.setItem('body-response-array', JSON.stringify(response.data));
        localStorage.setItem('mes-selecionado', mes);
        localStorage.setItem('ano-selecionado', anoSelecionado);
        navigate('/dashboard');
        window.location.reload();
    }

    async function cadastraLancamento() {
        setCampoAnotacao(false);
        try {
            const body = {
                descricao: descricaoSelecionada,
                preco: valorSelecionado,
                dataVencimento: dataSelecionada,
                status: statusSelecionado,
                tipo: tipoSelecionado,
                categoriaLancamento: categoria,
                recorrente: checkRecorrente,
                numeroParcelas: numeroParcelas,
                anotacao: anotacao
            };

            if (!body.descricao || body.descricao.trim() === "") { tocarSom(audioError); alert("⚠ Preencha a descrição antes de cadastrar!"); return; }
            if (!body.preco || body.preco <= 0) { tocarSom(audioError); alert("⚠ Informe um valor válido!"); return; }
            if (!body.dataVencimento) { tocarSom(audioError); alert("⚠ Selecione uma data de vencimento!"); return; }
            if (!body.status) { tocarSom(audioError); alert("⚠ Selecione um status!"); return; }
            if (!body.tipo) { tocarSom(audioError); alert("⚠ Selecione um tipo (Receita ou Despesa)!"); return; }
            if (!body.categoriaLancamento) { tocarSom(audioError); alert("⚠ Selecione uma categoria!"); return; }

            const response = await api.post(`/lancamento/cadastraLancamento/${mesSelecionado}/${anoSelecionado}`, body);
            setAnotacao("");

            if (response.status === 403) { alert('⚠ Você precisa fazer login novamente!'); localStorage.removeItem('token'); navigate('/'); }
            if (response.status === 201) {
                tocarSom(audioPDF);
                setAnotacao("");
                alert(`Lançamento cadastrado com sucesso ✅`);
                recarrega_pagina_apos_cadastrar(mesSelecionado);
            } else {
                alert(`⚠ Algo deu errado! Código: ${response.status}`);
            }
        } catch (error) {
            const mensagemErro = error.response?.data?.message || error.message;
            alert(`❌ Erro ao cadastrar Lancamento: ${mensagemErro}`);
            console.error('Erro ao cadastrar Lancamento:', error);
        }
    }

    const audioClick = new Audio("/click.mp3");
    const audioExcluir = new Audio("/excluir.mp3");
    const audioError = new Audio("/error.mp3");
    const audioPDF = new Audio("/pdf.mp3");

    const tocarSom = (som) => { som.currentTime = 0; som.play(); };

    return (
        <div className='Inputs'>
            {campoAnotacao && (
                <div className='overlayAnotacao'>
                    <div className='modalAnotacao'>
                        <p id='Descricao-anotacao' style={{ margin: "5px 0" }}>
                            Se quiser, Adicione uma anotação ao Lançamento...
                        </p>
                        <textarea
                            id="caixa-anotacao"
                            rows="4"
                            cols="30"
                            maxLength={255}
                            placeholder="Escreva aqui a sua anotação..."
                            onChange={(e) => setAnotacao(e.target.value)}>
                        </textarea>
                        <div className='anotacao-buttons'>
                            <div>
                                <button id="Cancelar" onClick={() => { tocarSom(audioExcluir); setCampoAnotacao(false); }}>Cancelar</button>
                            </div>
                            <div>
                                <button id="Avancar" onClick={() => { tocarSom(audioClick); cadastraLancamento(); }}>Avançar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {divParcelas && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "5px 0" }}>Mesês deseja repetir o lançamento:</p>
                        <input
                            id='input-quantidade-parcelas'
                            type="number" min="2" max="999" defaultValue={0}
                            onInput={(e) => { if (e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3); }}
                            onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                        />
                        <div className='Botoes-exclui'>
                            <button id="Botao-excluir-sim" onClick={() => { if (numeroParcelas < 2) { alert('⚠ O número de parcelas deve ser no mínimo 2.'); return; } setDivParcelas(false); }}>Sim</button>
                            <button id="Botao-excluir-nao" onClick={() => { setNumeroParcelas(0); setDivParcelas(false); tocarSom(audioClick); setCheckParcelado(false); }}>Não</button>
                        </div>
                    </div>
                </div>
            )}

            <p id='Novo-lancamento'>Novo Lancamento</p>
            <div className='Tipo-status-div'>
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Tipo</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        style={{ color: tipoSelecionado === "RECEITA" ? "#00ad2eff" : "#da0012ff" }}
                        id='Tipo-status-select'
                        value={tipoSelecionado}
                        onChange={(e) => setTipoSelecionado(e.target.value)}
                        required
                    >
                        <option id='Tipo-status-options-receita' value="RECEITA">RECEITA</option>
                        <option id='Tipo-status-options-despesa' value="DESPESA">DESPESA</option>
                    </select>
                </div>
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Status</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        style={{ color: statusSelecionado === "PAGO" ? "#00ad2eff" : "#da0012ff" }}
                        id='Tipo-status-select'
                        value={statusSelecionado}
                        onChange={(e) => setStatusSelecionado(e.target.value)}
                        required
                    >
                        <option id='status-options-pen' value="PENDENTE">PENDENTE</option>
                        <option id='status-options-pag' value="PAGO">PAGO</option>
                    </select>
                </div>
            </div>

            <div className='Tipo-status-div-descricao'>
                <div className='Bloquinho-input-descricao'>
                    <p id='Descricao-text-inputs'>Descrição</p>
                    <input placeholder='Ex: Salário, Conta de luz...' id='Descricao-input' onChange={(e) => setDescricaoSelecionada(e.target.value)} type="text" maxLength={40} required />
                </div>
            </div>

            <div className='Tipo-status-div'>
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Valor</p>
                    <input
                        id='input-valor' type="text" inputMode="decimal" value={display}
                        onChange={(e) => {
                            formata_display_input(e);
                            const somenteNumeros = e.target.value.replace(/\D/g, '');
                            setValorSelecionado(parseFloat(somenteNumeros) / 100);
                        }}
                        placeholder="R$ 0,00" autoComplete="off" required
                    />
                    <input type="hidden" name="valor" value={(raw / 100).toFixed(2)} />
                </div>
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Vencimento</p>
                    <input
                        onClick={() => tocarSom(audioClick)}
                        type="date" id="data" value={data}
                        onChange={(e) => { formata_data(e); setDataSelecionada(e.target.value); }}
                        required
                    />
                </div>
            </div>

            <div className='containerr'>
                <p title='Ele replica o Lançamento, da data atual até o ultimo mês do ano atual' id='Texto-checkbox'>Repetir</p>
                <label className="switch">
                    <input
                        onClick={() => tocarSom(audioExcluir)} type="checkbox" name="aceito" checked={checkRecorrente}
                        onChange={(e) => {
                            if (!checkParcelado) { setCheckRecorrente(e.target.checked); if (e.target.checked) alert('✅ Lançamento será repetido até o final do ano!'); }
                            else alert('❌ Não é possível repetir um lançamento parcelado!');
                        }}
                    />
                    <span className="slider"></span>
                </label>
                <p title='Ele replica o Lançamento, da data atual até o ultimo mês do ano atual' id='Texto-checkbox'>Parcelado</p>
                <label className="switch">
                    <input
                        onClick={() => tocarSom(audioExcluir)} type="checkbox" name="aceito" checked={checkParcelado}
                        onChange={(e) => {
                            if (!checkRecorrente) {
                                if (checkParcelado) { setCheckParcelado(e.target.checked); setNumeroParcelas(0); }
                                else { setCheckParcelado(e.target.checked); setDivParcelas(true); }
                            } else alert('❌ Não é possível parcelar um lançamento recorrente!');
                        }}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            <div id='Categoria-input' className='Tipo-status-div'>
                <div className='Bloquinho-Categoria'>
                    <p id='Descricao-text-inputs'>Categoria</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        id='Tipo-status-select-categoria-input'
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        disabled={!tipoSelecionado}
                        required
                    >
                        <option value="">SELECIONAR CATEGORIA</option>
                        {tipoSelecionado === "DESPESA" && categoriasDespesa.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        {tipoSelecionado === "RECEITA" && categoriasReceita.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className='div-botao-cadastro'>
                <button onClick={() => { tocarSom(audioClick); setCampoAnotacao(true); }} id='Botao-cadastra-lancamento'>CADASTRAR</button>
            </div>
        </div>
    );
}

export default Imputs;