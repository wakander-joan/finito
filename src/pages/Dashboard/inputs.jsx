import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';

function Imputs() {
    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const mesSelecionado = localStorage.getItem('mes-selecionado');
    const [loading, setLoading] = useState(false);

    {/* Const's Input's.................*/ }
    const [display, setDisplay] = useState("R$ 0,00");
    const [displayEdita, setDisplayEdita] = useState("R$ 0,00");
    const [raw, setRaw] = useState(0); // em centavos
    const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const [data, setData] = useState(() => {
        const ano = localStorage.getItem("ano-selecionado");
        const mes = localStorage.getItem("mes-selecionado");
        const dia = new Date().getDate().toString().padStart(2, "0");

        // se já tiver ano e mês salvos, usa eles
        if (ano && mes) {
            return `${ano}-${mes.padStart(2, "0")}-${dia}`;
        }

        // senão, usa a data atual
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
    const formata_data = (e) => {
        setData(e.target.value); // já vem no formato yyyy-mm-dd
    };

    function formatYMD(date) {
        // garante que a Date é válida antes de usar toISOString
        if (!(date instanceof Date) || isNaN(date.getTime())) return '';
        return date.toISOString().substring(0, 10);
    }

    useEffect(() => {
        // tenta converter para números
        const ano = Number(anoSelecionado);
        const mes = Number(mesSelecionado); // 1..12 esperados

        // checa se ano e mês são números válidos e mês dentro do intervalo
        if (!Number.isInteger(ano) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            // opcional: limpar ou manter valor atual
            setData('');
            return;
        }

        // monta Date de forma segura: new Date(year, monthIndex, day)
        const dt = new Date(ano, mes - 1, 1); // monthIndex = mes - 1

        // valida Date antes de usar toISOString
        if (isNaN(dt.getTime())) {
            setData('');
            return;
        }

        setData(formatYMD(dt));
    }, [anoSelecionado, mesSelecionado]);

    {/* Inputtttttttttttttt.................*/ }
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
        console.log('Resultado:', response);
        localStorage.setItem('body-response-array', JSON.stringify(response.data))
        localStorage.setItem('mes-selecionado', mes)
        localStorage.setItem('ano-selecionado', anoSelecionado)
        navigate('/dashboard')
        window.location.reload();
        return;
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

                // Validações individuais
                if (!body.descricao || body.descricao.trim() === "") {
                    tocarSom(audioError)
                    alert("⚠ Preencha a descrição antes de cadastrar!");
                    return;
                }
                if (!body.preco || body.preco <= 0) {
                    tocarSom(audioError)
                    alert("⚠ Informe um valor válido!");
                    return;
                }
                if (!body.dataVencimento) {
                    tocarSom(audioError)
                    alert("⚠ Selecione uma data de vencimento!");
                    return;
                }
                if (!body.status) {
                    tocarSom(audioError)
                    alert("⚠ Selecione um status!");
                    return;
                }
                if (!body.tipo) {
                    tocarSom(audioError)
                    alert("⚠ Selecione um tipo (Receita ou Despesa)!");
                    return;
                }
                if (!body.categoriaLancamento) {
                    tocarSom(audioError)
                    alert("⚠ Selecione uma categoria!");
                    return;
                }
            

            console.log(body);

                const response = await api.post(`/lancamento/cadastraLancamento/${mesSelecionado}/${anoSelecionado}`, body);
                setAnotacao("")

                if (response.status === 403) {
                    alert('⚠ Você precisa fazer login novamente!');
                    localStorage.removeItem('token');
                    navigate('/');
                }

                if (response.status === 201) {
                    tocarSom(audioPDF);
                    setAnotacao("")
                    alert(`Lançamento cadastrado com sucesso ✅`);
                    recarrega_pagina_apos_cadastrar(mesSelecionado)
                } else {
                    alert(`⚠ Algo deu errado! Código: ${response.status}`);
                    console.log('Algo deu errado!', response);
                }
            
        } catch (error) {
            const mensagemErro = error.response?.data?.message || error.message;
            alert(`❌ Erro ao cadastrar Lancamento: ${mensagemErro}`);
            console.error('Erro ao cadastrar Lancamento:', error);
        }
    }

    const audioBlip = new Audio("/mes.mp3");
    const audioClick = new Audio("/click.mp3");
    const audioExcluir = new Audio("/excluir.mp3");
    const audioGameOver = new Audio("/over.mp3");
    const audioError = new Audio("/error.mp3");
    const audioPDF = new Audio("/pdf.mp3");

    // funções de reprodução
    const tocarSom = (som) => {
        som.currentTime = 0;
        som.play();
    };

    return (
        <div className='Inputs'>
            {campoAnotacao && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "5px 0" }}>
                            Adicionar uma anotação ao Lançamento?
                        </p>

                        <textarea
                            id="caixa-anotacao"
                            rows="4"
                            cols="30"
                            placeholder="Escreva aqui a sua anotação..."
                            onChange={(e) => setAnotacao(e.target.value)}>
                        </textarea>

                        <div className='anotacao-sim'>
                            <button
                                id=""
                                onClick={() => {
                                    alert(`Anotação a ser salva: ${anotacao}`);
                                    cadastraLancamento();
                                }}
                            >
                                Avançar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {divParcelas && (
                <div className='overlayExclui'>
                    <div className='modalExclui'>
                        <p id='Descricao-exclui' style={{ margin: "5px 0" }}>
                            Mesês deseja repetir o lançamento:
                        </p>

                        <input
                            id='input-quantidade-parcelas'
                            type="number"
                            min="2"
                            max="999"
                            defaultValue={0}
                            onInput={(e) => {
                                if (e.target.value.length > 3) {
                                    e.target.value = e.target.value.slice(0, 3);
                                }
                            }}
                            onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                        />

                        <div className='Botoes-exclui'>
                            <button
                                id="Botao-excluir-sim"
                                onClick={() => {
                                    if (numeroParcelas < 2) {
                                        alert('⚠ O número de parcelas deve ser no mínimo 2.');
                                        return;
                                    }
                                    console.log(`Numero de Parcelas definido como ${numeroParcelas}`);
                                    setDivParcelas(false);

                                }}
                            >
                                Sim
                            </button>
                            <button
                                id="Botao-excluir-nao"
                                onClick={() => { setNumeroParcelas(0); setDivParcelas(false); tocarSom(audioClick); setCheckParcelado(false); }}

                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <p id='Novo-lancamento'>Novo Lancamento</p>
            {/* Tipo-status */}
            <div className='Tipo-status-div'>
                {/* Escolha de Tipos */}
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Tipo</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        style={{
                            color: tipoSelecionado === "RECEITA" ? "#00ad2eff" : "#da0012ff"
                        }}
                        id='Tipo-status-select'
                        value={tipoSelecionado}
                        onChange={(e) => setTipoSelecionado(e.target.value)}
                        className="TipoSelect"
                        required
                    >
                        <option id='Tipo-status-options-receita' value="RECEITA">RECEITA</option>
                        <option id='Tipo-status-options-despesa' value="DESPESA">DESPESA</option>
                    </select>
                </div>

                {/* Escolha de Status ---------------------------------------*/}
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Status</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        style={{
                            color: statusSelecionado === "PAGO" ? "#00ad2eff" : "#da0012ff"
                        }}
                        id='Tipo-status-select'
                        value={statusSelecionado}
                        onChange={(e) => setStatusSelecionado(e.target.value)}
                        className="StatusSelect"
                        required
                    >
                        <option id='status-options-pen' value="PENDENTE">PENDENTE</option>
                        <option id='status-options-pag' value="PAGO">PAGO</option>
                    </select>
                </div>
            </div>

            {/* Descrição ------------------------------------------------*/}
            <div className='Tipo-status-div'>
                <div className='Bloquinho-input-descricao'>
                    <p id='Descricao-text-inputs'>Descrição</p>
                    <input
                        placeholder='Ex: Salário, Conta de luz...'
                        id='Descricao-input'
                        onChange={(e) => setDescricaoSelecionada(e.target.value)}
                        type="text"
                        maxLength={30}
                        required
                    />

                </div>
            </div>

            {/* Valor e Data de Vencimento ------------------------------------------------*/}
            <div className='Tipo-status-div'>
                {/* Escolha de Tipos */}
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Valor</p>
                    <input
                        id='input-valor'
                        type="text"
                        inputMode="decimal"
                        value={display} // "R$ 12,34"
                        onChange={(e) => {
                            formata_display_input(e); // continua formatando o display
                            const somenteNumeros = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
                            const valorNumerico = parseFloat(somenteNumeros) / 100; // converte para reais
                            setValorSelecionado(valorNumerico); // agora salva 12.34 (número real)
                        }}
                        placeholder="R$ 0,00"
                        autoComplete="off"
                        required
                    />
                    {/* campo oculto envia valor numérico para backend */}
                    <input
                        type="hidden"
                        name="valor"
                        value={(raw / 100).toFixed(2)} // "12.34"
                    />
                </div>

                {/* Escolha de Data ---------------------------------------*/}
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Vencimento</p>
                    <input
                        onClick={() => tocarSom(audioClick)}
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => {
                            formata_data(e);
                            setDataSelecionada(e.target.value);
                        }}
                        required
                    />
                </div>
            </div>

            <div className='containerr' >
                <p title='Ele replica o Lançamento, da data atual até o ultimo mês do ano atual'
                    id='Texto-checkbox'>Repetir</p>
                <label class="switch">
                    <input
                        onClick={() => tocarSom(audioExcluir)}
                        type="checkbox"
                        name="aceito"
                        checked={checkRecorrente}
                        onChange={(e) => {
                            if (!checkParcelado) {
                                setCheckRecorrente(e.target.checked);
                                if (e.target.checked) {
                                    alert('✅ Lançamento será repetido até o final do ano!');
                                }
                            } else {
                                alert('❌ Não é possível repetir um lançamento parcelado!');
                            }
                        }}
                    />
                    <span class="slider"></span>
                </label>
                <p title='Ele replica o Lançamento, da data atual até o ultimo mês do ano atual'
                    id='Texto-checkbox'>Parcelado</p>
                <label class="switch">
                    <input
                        onClick={() => tocarSom(audioExcluir)}
                        type="checkbox"
                        name="aceito"
                        checked={checkParcelado}
                        onChange={(e) => {
                            if (!checkRecorrente) {
                                if (checkParcelado) {
                                    setCheckParcelado(e.target.checked);
                                    setNumeroParcelas(0);
                                } else {
                                    setCheckParcelado(e.target.checked);
                                    setDivParcelas(true);
                                }
                            } else {
                                alert('❌ Não é possível parcelar um lançamento recorrente!');
                            }

                        }}
                    />
                    <span class="slider"></span>
                </label>
            </div>


            {/* Tipo-status */}
            <div id='Categoria-input' className='Tipo-status-div'>
                {/* Escolha de Tipos */}
                <div className='Bloquinhos'>
                    <p id='Descricao-text-inputs'>Categoria</p>
                    <select
                        onClick={() => tocarSom(audioClick)}
                        id='Tipo-status-select-categoria-input'
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        disabled={!tipoSelecionado} // desabilita se não escolheu tipo
                        required
                    >
                        <option id='opção-edita' value="">SELECIONAR CATEGORIA</option>
                        {tipoSelecionado === "DESPESA" &&
                            categoriasDespesa.map((cat) => (
                                <option id='opção-edita' key={cat} value={cat}>{cat}</option>
                            ))
                        }
                        {tipoSelecionado === "RECEITA" &&
                            categoriasReceita.map((cat) => (
                                <option id='opção-edita' key={cat} value={cat}>{cat}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className='div-botao-cadastro'>
                <button onClick={() => { setCampoAnotacao(true) }} id='Botao-cadastra-lancamento'>CADASTRAR</button>
            </div>

        </div>
    )
}

export default Imputs;