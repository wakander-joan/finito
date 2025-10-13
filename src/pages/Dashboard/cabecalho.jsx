import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';
import Logo from '../../assets/logo.png';
import Exit from '../../assets/exit.png';
import loadingGif4 from '../../assets/loading4.gif';

function Cabecalho() {
    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');
    {/* Const's Cabecalho.................*/ }
    const nomePessoa = localStorage.getItem("nomePessoa");
    const [loading, setLoading] = useState(false);
    const setlaD = "--->"
    const setlaE = "<---"
    const EMOJIS = [
        "🕎", // 0
        "💀", // 1
        "💸", // 2
        "😬", // 3
        "😐", // 4
        "🙂", // 5
        "😎", // 6
        "🤑", // 7
        "💰", // 8
        "🏦", // 9
        "🌟"  // 10
    ];
    const meses = [
        "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL",
        "MAIO", "JUNHO", "JULHO", "AGOSTO",
        "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];
    const perfilEmoji = getPerfilEmoji();

    {/* Cabecalhooooooooooooooooooooooo.................*/ }
    function getPerfilEmoji() {
        const perfil = localStorage.getItem("perfil"); // Ex.: "3"
        const perfilIndex = parseInt(perfil, 10); // Converte para número

        if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
            return EMOJIS[perfilIndex];
        }
        return "❓"; // Caso não exista
    }

    async function voltar_menu_animacao() {
        navigate('/cadastro')
    }

    async function get_next(mes) {
        const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${anoSelecionado}`);
        console.log('Resultado:', response);
        localStorage.setItem('body-response-array', JSON.stringify(response.data))
        localStorage.setItem('mes-selecionado', mes)
        localStorage.setItem('ano-selecionado', anoSelecionado)
        navigate('/dashboard')
        return;
    }

    async function get_next_seta(mes, ano) {
        const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${ano}`);
        console.log('Resultado:', response);
        localStorage.setItem('body-response-array', JSON.stringify(response.data))
        localStorage.setItem('mes-selecionado', mes)
        localStorage.setItem('ano-selecionado', ano)
        navigate('/dashboard')
        return;
    }

    function direcaoSetaClicada(direcao) {
        // Pega o índice do mês atualmente selecionado
        const indiceAtual = meses.indexOf(messelecionado); // mesSelecionado deve estar no estado
        
        let novoAno = anoSelecionado;
        let novoIndice;

        if (direcao === "proximo") {
            // próximo mês (loop no final)
            novoIndice = (indiceAtual + 1) % meses.length;
            if(messelecionado === "DEZEMBRO"){
                novoAno = parseInt(anoSelecionado) + 1;
                //alert(`Mudando Para o ano de ${novoAno}`)
            }
        } else if (direcao === "anterior") {
            if(anoSelecionado === "2025" && messelecionado === "JANEIRO"){
                return alert("Você não pode voltar para anos anteriores a 2025!");
            }

            // mês anterior (loop no começo)
            novoIndice = (indiceAtual - 1 + meses.length) % meses.length;
            if(messelecionado === "JANEIRO"){
                novoAno = parseInt(anoSelecionado) - 1;
                //alert(`Mudando Para o ano de ${novoAno}`)
            }
        }

        const novoMes = meses[novoIndice];
        get_next_seta(novoMes, novoAno); // chama sua função
    }

    const audioBlip = new Audio("/mes.mp3");
    const audioClick = new Audio("/click.mp3");
    const audioClickMes = new Audio("/clickMes.mp3");
    const audioGameOver = new Audio("/over.mp3");
    const audioError = new Audio("/error.mp3");
    const audioPDF = new Audio("/pdf.mp3");

    // funções de reprodução
    const tocarSom = (som) => {
        som.currentTime = 0;
        som.play();
    };

    return (
        <div className='Cabecalho'>
            {/* Overlay de Loading */}
            {loading && (
                <div className="loading-container-dash">
                    <img id='saindo' src={loadingGif4} alt="Carregando..." />
                    <p class="typng"><span class="dotes"></span></p>
                </div>
            )}
            <div className='Areadash1'>
                <img id="logo-finito-cabecalho-dash" src={Logo} alt="Finito" />
                <h2 id='FINITO-TEXT-DASH'>FINITO</h2>
            </div>

            <div className='Areadash2'>
                <h5 id='seta' onClick={() => {direcaoSetaClicada("anterior"); tocarSom(audioClick);}}>{setlaE}</h5>
                <h5 id='ano-cabecalho'>{messelecionado}</h5>
                <h5 id='de-cabecalho'>de</h5>
                <h5 id='ano-cabecalho'>{anoSelecionado}</h5>
                <h5 id='seta' onClick={() => {direcaoSetaClicada("proximo"); tocarSom(audioClick);}}>{setlaD}</h5>
            </div>

            <div className='Area3'>
                <h2 id='USUARIO-TEXT2'>{nomePessoa}</h2>
                <h2 id='PERFIL-EMOGI2'>{perfilEmoji}</h2>
                <img onClick={() => { voltar_menu_animacao(); tocarSom(audioClick);}} id="logo-exit" src={Exit} alt="Finito" title="Voltar ao MENU" />
            </div>
        </div>
    )
}

export default Cabecalho;