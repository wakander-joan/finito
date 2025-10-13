import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';

function Imputs() {
    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');
    const [loading, setLoading] = useState(false);

    {/* Const's Input's.................*/ }
    const [display, setDisplay] = useState("R$ 0,00");
    const [displayEdita, setDisplayEdita] = useState("R$ 0,00");
    const [raw, setRaw] = useState(0); // em centavos
    const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const [data, setData] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState("DESPESA");
    const [statusSelecionado, setStatusSelecionado] = useState("PENDENTE");
    const [dataSelecionada, setDataSelecionada] = useState("");
    const [valorSelecionado, setValorSelecionado] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricaoSelecionada, setDescricaoSelecionada] = useState("");
    const [checkRecorrente, setCheckRecorrente] = useState(false);

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

    {/* Inputtttttttttttttt.................*/ }
    function formata_display_input(e) {
        const digits = e.target.value.replace(/\D/g, "") || "0";
        const cents = parseInt(digits, 10);
        setRaw(cents);
        setDisplay(fmt.format(cents / 100));
    }

    async function recarrega_pagina_apos_cadastrar(mes) {
        const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
        console.log('Resultado:', response);
        localStorage.setItem('body-response-array', JSON.stringify(response.data))
        localStorage.setItem('mes-selecionado', mes)
        localStorage.setItem('ano-selecionado', anoSelecionado)
        navigate('/dashboard')
        window.location.reload();
        return;
    }

    async function cadastraLancamento() {
        try {
            const body = {
                descricao: descricaoSelecionada,
                preco: valorSelecionado,
                dataVencimento: dataSelecionada,
                status: statusSelecionado,
                tipo: tipoSelecionado,
                categoriaLancamento: categoria,
                recorrente: checkRecorrente
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

            const response = await api.post(`/lancamento/cadastraLancamento/${messelecionado}/${anoSelecionado}`, body);

            if (response.status === 201) {
                tocarSom(audioPDF);

                alert(`Lançamento cadastrado com sucesso ✅`);
                recarrega_pagina_apos_cadastrar(messelecionado)
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
                    id='Texto-checkbox'>Recorrente?</p>
                <label class="switch">
                    <input
                        onClick={() => tocarSom(audioExcluir)}
                        type="checkbox"
                        name="aceito"
                        checked={checkRecorrente}
                        onChange={(e) => setCheckRecorrente(e.target.checked)}
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
                <button onClick={() => { cadastraLancamento(); }} id='Botao-cadastra-lancamento'>CADASTRAR</button>
            </div>

        </div>
    )
}

export default Imputs;