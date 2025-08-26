import './cadastraStyle.css';
import Logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import React, { useMemo, useRef, useState } from "react";
import loadingGif2 from '../../assets/loading3.gif';

function Cadastrar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // novo estado

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

  async function loadingAnimation() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/')
    }, 1700);
  }

  return (
    <div className="container-cadastro">
      {/* Overlay de Loading */}
      {loading && (
        <div className="loading-container">
          <img id='saindo' src={loadingGif2} alt="Carregando..." />
          <p class="typng"><span class="dotes"></span></p>
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
            <h5 id='descricao'>Nome</h5>
            <input type="text" placeholder='Digite o seu nome aqui...' className='input-cadastro' />
            <h5 id='descricao'>Email</h5>
            <input type="email" placeholder='Digite o seu email aqui...' className='input-cadastro' />
            <h5 id='descricao'>Senha</h5>
            <input type="password" placeholder='Digite o sua senha aqui...' className='input-cadastro' />
            <h5 id='descricao'>Repetir Senha</h5>
            <input type="password" placeholder='Digite o sua senha aqui...' className='input-cadastro' />
          </div>
          <div className='icon-button'>
            <select
              className="rounded-lg border border-slate-300 bg-white p-2"
              onChange={(e) => insertEmoji(e.target.value)}
              defaultValue=""
            >
              <option id='Text-selecao' value="" disabled>
                Perfis 😎
              </option>
              {EMOJIS.map((e) => (
                <option key={e.ch} value={e.ch}>
                  {e.ch} {e.name}
                </option>
              ))}
            </select>
            <button id='Cadastrar-button'>START</button>
          </div>
        </div>
      </div>
      <div className='linha-horizontal-final'>
        <p className='texto-login'>Já possui uma conta?</p>
        <button id='Logar' onClick={loadingAnimation}>Logar</button>
      </div>
    </div>
  );
}

export default Cadastrar;
