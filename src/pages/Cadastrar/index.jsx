import './cadastraStyle.css';
import Logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import loadingGif2 from '../../assets/loading3.gif';
import goku from '../../assets/goku.gif';
import ok from '../../assets/ok.png';
import api from '../../services/api';
import { useState, useEffect } from 'react';

function Cadastrar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // novo estado
  const [loadingSave, setLoadingSave] = useState(false); // novo estado
  const [loadingSaveOK, setloadingSaveOK] = useState(false); // novo estado
  const token = localStorage.getItem('token');

  const EMOJIS = [
    { ch: "🕎", name: "Fariseu" },
    { ch: "💀", name: "Falido" },
    { ch: "💸", name: "Endividado" },
    { ch: "😬", name: "Muito apertado" },
    { ch: "😐", name: "Apertado" },
    { ch: "🙂", name: "De boa" },
    { ch: "😎", name: "Confortável" },
    { ch: "🤑", name: "Rico" },
    { ch: "💰", name: "Próspero" },
    { ch: "🏦", name: "Investidor" },
    { ch: "🌟", name: "livre" },
  ];

  function insertEmoji(emoji) {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const [emogi, setEmogi] = useState("");

  async function cadastrar() {
    tocarSom(audioAtualiza);
    try {
      if (emogi === "") {
        alert("Selecione um perfil antes de cadastrar!");
        return;
      }
      setLoadingSave(true);
      tocarSom(audio1943) // Mostra o loading
      const indice = parseInt(emogi, 10);
      const body = { nomePessoa: nome, email, senha, perfil: indice };

      const response = await api.post('/usuario/criaUsuario', body);

      if (response.status === 201) {
        setTimeout(() => {
          setLoadingSave(false);
          setloadingSaveOK(true);
          tocarSom(audioPassed)
          setTimeout(() => {
            navigate('/'); // Vai para login
          }, 5000);
        }, 10500); // Tempo para mostrar o OK
      } else {
        alert(`⚠ Algo deu errado! Código: ${response.status}`);
        console.log('Algo deu errado!', response);
      }
    } catch (error) {
      const mensagemErro = error.response?.data?.message || error.message;
      alert(`❌ Erro ao cadastrar usuário: ${mensagemErro}`);
      console.error('Erro ao cadastrar usuário:', error);
    } finally {
      //setLoadingSave(false); // Sempre esconde o loading
    }
  }

  async function loadingAnimation() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/')
    }, 1700);
  }

  const audioPassed = new Audio("/passed.mp3");
  const audioClick = new Audio("/click.mp3");
  const audioExcluir = new Audio("/excluir.mp3");
  const audioAtualiza = new Audio("/atualiza.mp3");
  const audio1943 = new Audio("/1943.mp3");

  const tocarSom = (som) => {
    som.currentTime = 0;
    som.play();
  };

  return (
      <div className="container-cadastro">
        {/* Overlay de Loading */}
        {loading && (
          <div className="loading-container">
            <img id='saindo' src={loadingGif2} alt="Carregando..." />
            <p class="typng"><span class="dotes"></span></p>
          </div>
        )}
        {/* Overlay de Loading */}
        {loadingSave && (
          <div className="loading-container">
            <img id='saindo' src={goku} alt="Cadastrando..." />
            <p class="typn"><span class="doteSave"></span></p>
          </div>
        )}
        {loadingSaveOK && (
          <div className="loading-containerr">
            <img id='cadastrando' src={ok} alt="Cadastrando..." />
          </div>
        )}
        <div className='Form'>
          <div className='div-boas-vindas'>
            <h2 id='Bem-vindos'>🎉 Bem-vindo!</h2>
            <h3 id='palavras-boas'>Comece sua jornada com a gente!</h3>
            <h3 id='palavras-boas'>Cadastro rápido, acesso 100% gratuito. Bora?</h3>
          </div>
          <div className='div-inputs'>
            <div className='Logo-Text-Finito'>
              <img id='Logo' src={Logo} alt="Logo" className='logo' />
              <h2 id='Text-finito'>FINITO</h2>
            </div>
            <h2 className='titulo'>CADASTRO</h2>
            <div className='inputs'>

              <p id='descricao'>Nome</p>
              <input
                type="text"
                maxLength={10}
                placeholder='Como deseja ser chamado?  {10 caracteres...}'
                className='input-cadastro'
                value={nome}
                onChange={(e) => setNome(e.target.value)} />

              <h5 id='descricao'>Email</h5>
              <input
                type="email"
                placeholder='Digite o seu email aqui...'
                className='input-cadastro'
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

              <h5 id='descricao'>Senha</h5>
              <input
                type="password"
                placeholder='Digite o sua senha aqui...'
                className='input-cadastro'
                value={senha}
                onChange={(e) => setSenha(e.target.value)} />

            </div>
            <div className='icon-button'>
              <select
                onClick={() => tocarSom(audioClick)}
                id="select-perfil"
                className="rounded-lg border border-slate-300 bg-white p-2"
                value={emogi}
                onChange={(e) => setEmogi(e.target.value)}
              >
                <option value="" disabled>Escolher Perfil 😎</option>
                {EMOJIS.map((e, index) => (
                  <option key={e.ch} value={index}>
                    {e.ch} {e.name}
                  </option>
                ))}
              </select>
              <button onClick={cadastrar} id='Cadastrar-button'>START</button>
            </div>
            <div className='linha-horizontal-final'>
              <p className='texto-login'>Já possui uma conta?</p>
              <button id='Logar' onClick={() => navigate('/')}>Logar</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Cadastrar;
