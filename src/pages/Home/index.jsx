import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Logo from '../../assets/finito-logo.png';
import google from '../../assets/google.png';
import Face from '../../assets/f.png';
import api from '../../services/api';
import loadingGif2 from '../../assets/loading3.gif'; // seu gif de loading
import { jwtDecode } from "jwt-decode";

function Home() {
  const anoAtual = new Date().getFullYear();
  localStorage.setItem('ano-selecionado', anoAtual);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(null); //Lebrar de usar o Token
  const [loading, setLoading] = useState(false); // novo estado
  const navigate = useNavigate();

  async function login() {
    try {
      setLoading(true); // mostra o loading
      const body = { email, senha };
      const response = await api.post('/auth/login', body);
      localStorage.setItem('token', response.data.token);
      const tokenRecebido = response.data.token;

      if (!tokenRecebido) {
        // Se não veio token, exibe erro e não navega
        alert('Login falhou: token não recebido.');
        return;
      }

      setToken(tokenRecebido); // salva token
      console.log('Token recebido:', tokenRecebido);
      const decoded = jwtDecode(tokenRecebido);
      console.log(decoded);
      const {id, nomePessoa, perfil } = decoded;
      localStorage.setItem('idPessoa', id);
      localStorage.setItem('nomePessoa', nomePessoa);
      localStorage.setItem('perfil', perfil);
      setTimeout(() => {
        setLoading(false); // esconde o loading
        navigate('/cadastro'); // navega para a página
      }, 1700);

    } catch (error) {
      alert(`Erro ao fazer login: ${error.response?.data || error.message}`);
      window.location.reload();
    }
  }

  async function loadingAnimation() {
    setLoading(true); // mostra o loading
    // Simula um tempo de carregamento
    setTimeout(() => {
      setLoading(false); // esconde o loading
      navigate('/cadastrar')
    }, 1700); // 3 segundos
  }

  return (
    <div className="container">
      {/* Overlay de Loading */}
      {loading && (
        <div className="loading-container">
          <img src={loadingGif2} alt="Carregando..." />
          <p class="typing"><span class="dots"></span></p>
        </div>
      )}

      <form className='form1' onSubmit={(e) => e.preventDefault()}>
        <img id="logo-principal" src={Logo} alt="Finito" />
        <div className='divider'>
          <h5>E-mail</h5>
          <input
            placeholder='Digite o seu e-mail aqui...'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5>Senha</h5>
          <input
            placeholder='Digite o sua senha aqui...'
            type='password'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type='button' onClick={login}>Entrar</button>
      </form>

      <div className='googledivider'>
        <img id="logo-google" name='google' src={google} />
        <button onClick={() => window.open('https://www.google.com', '_blank', 'noopener,noreferrer')} id='botaoGoogle'>Logar com Google</button>
      </div>

      <div className='facedivider'>
        <img id="logo-face" name='google' src={Face} />
        <button onClick={() => window.open('https://www.facebook.com', '_blank', 'noopener,noreferrer')} id='botaoFace'>Logar com Facebook</button>
      </div>
      <button onClick={loadingAnimation} id='botaocadastro'>Cadastrar</button>

      <div className='rodape'>
        <div className='coluna1'>
          <h2>SOBRE</h2>
          <h3>Quem somos</h3>
          <h3>Missão e Valores</h3>
          <h3>Termos de Uso</h3>
        </div>
        <div className='coluna1'>
          <h2>RECURSOS</h2>
          <h3>Dashboard Financeiro</h3>
          <h3>Planejamento Mensal</h3>
          <h3>Metas</h3>
        </div>
        <img id="logo-rodape" name='finito' src={Logo} />
        <div className='coluna1'>
          <h2>RECURSOS</h2>
          <h3>Dashboard Financeiro</h3>
          <h3>Planejamento Mensal</h3>
          <h3>Metas</h3>
        </div>
        <div className='coluna1'>
          <h2>RECURSOS</h2>
          <h3>Dashboard Financeiro</h3>
          <h3>Planejamento Mensal</h3>
          <h3>Metas</h3>
        </div>
      </div>

    </div>
  );
}

export default Home;
