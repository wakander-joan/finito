import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './styledash.css';
import api from '../../services/api';
import Logo from '../../assets/logo.png';
import Exit from '../../assets/exit.png';
import loadingGif4 from '../../assets/loading4.gif';
import seta from '../../assets/seta.png';
import seta2 from '../../assets/seta2.png';

function Cabecalho() {
    const navigate = useNavigate();
    const anoSelecionado = localStorage.getItem('ano-selecionado');
    const messelecionado = localStorage.getItem('mes-selecionado');
    const nomePessoa = localStorage.getItem("nomePessoa");
    const [loading, setLoading] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);

    const EMOJIS = [
        "🕎", "💀", "💸", "😬", "😐",
        "🙂", "😎", "🤑", "💰", "🏦", "🌟"
    ];

    const meses = [
        "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL",
        "MAIO", "JUNHO", "JULHO", "AGOSTO",
        "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    function getPerfilEmoji() {
        const perfilIndex = parseInt(localStorage.getItem("perfil"), 10);
        if (!isNaN(perfilIndex) && perfilIndex >= 0 && perfilIndex < EMOJIS.length) {
            return EMOJIS[perfilIndex];
        }
        return "❓";
    }
    const perfilEmoji = getPerfilEmoji();

    async function voltar_menu_animacao() {
        navigate('/cadastro');
    }

    async function get_next_seta(mes, ano) {
        const response = await api.get(`/lancamento/buscaLancamentosPorMesEAno/${mes}/${ano}`);
        if (response.status === 403) {
            alert('⚠ Você precisa fazer login novamente!');
            localStorage.removeItem('token');
            navigate('/');
        }
        localStorage.setItem('body-response-array', JSON.stringify(response.data));
        localStorage.setItem('mes-selecionado', mes);
        localStorage.setItem('ano-selecionado', ano);
        navigate('/dashboard');
    }

    function direcaoSetaClicada(direcao) {
        const indiceAtual = meses.indexOf(messelecionado);
        let novoAno = anoSelecionado;
        let novoIndice;

        if (direcao === "proximo") {
            novoIndice = (indiceAtual + 1) % meses.length;
            if (messelecionado === "DEZEMBRO") {
                novoAno = parseInt(anoSelecionado) + 1;
            }
        } else if (direcao === "anterior") {
            if (anoSelecionado === "2025" && messelecionado === "JANEIRO") {
                return alert("Você não pode voltar para anos anteriores a 2025!");
            }
            novoIndice = (indiceAtual - 1 + meses.length) % meses.length;
            if (messelecionado === "JANEIRO") {
                novoAno = parseInt(anoSelecionado) - 1;
            }
        }

        const novoMes = meses[novoIndice];
        get_next_seta(novoMes, novoAno);
    }

    const audioClick = new Audio("/click.mp3");

    const tocarSom = (som) => {
        som.currentTime = 0;
        som.play();
    };

    return (
        <div className={`Cabecalho ${menuAberto ? 'menu-aberto-dash' : ''}`}>
            {loading && (
                <div className="loading-container-dash">
                    <img id='saindo' src={loadingGif4} alt="Carregando..." />
                </div>
            )}

            <div className='Areadash1'>
                <img id="logo-finito-cabecalho-dash" src={Logo} alt="Finito" />
                <h2 id='FINITO-TEXT-DASH'>FINITO</h2>
            </div>

            <div className='Areadash2'>
                <img id='seta' src={seta2} alt="Anterior" onClick={() => { direcaoSetaClicada("anterior"); tocarSom(audioClick); }} />
                <h5 id='ano-cabecalho'>{messelecionado}</h5>
                <h5 id='de-cabecalho'>de</h5>
                <h5 id='ano-cabecalho'>{anoSelecionado}</h5>
                <img id='seta' src={seta} alt="Próximo" onClick={() => { direcaoSetaClicada("proximo"); tocarSom(audioClick); }} />
            </div>

            {/* Hamburger — filho direto do Cabecalho */}
            <button className="hamburger-dash" onClick={() => setMenuAberto(!menuAberto)} aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className='Areadash3'>
                <h2 id='USUARIO-TEXT2'>{nomePessoa}</h2>
                <h2 id='PERFIL-EMOGI2'>{perfilEmoji}</h2>
                <img
                    onClick={() => { voltar_menu_animacao(); tocarSom(audioClick); }}
                    id="logo-exit-dash" src={Exit} alt="Finito" title="Voltar ao MENU"
                />
            </div>
        </div>
    );
}

export default Cabecalho;