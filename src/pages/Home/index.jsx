import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Logo from '../../assets/finito-logo.png';
import google from '../../assets/google.png';
import Face from '../../assets/f.png';
import api from '../../services/api';
import loadingGif from '../../assets/loading.gif'; // seu gif de loading

function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(null); //Lebrar de usar o Token
  const [loading, setLoading] = useState(false); // novo estado
  const navigate = useNavigate();

  async function login() {
    try {
      setLoading(true); // começa o loading
      const body = { email, senha };
      const response = await api.post('/auth/login', body); // usando sua instância api

      setToken(response.data.token); // salva o token no state
      console.log('Token recebido:', response.data.token);
      navigate('/cadastro'); // substitua pelo caminho da sua rota
    } catch (error) {
      alert(`Erro ao fazer login: ${error.response?.data || error.message}`);
      window.location.reload();
    } finally {
      setLoading(false); // para o loading sempre no final
    }
  }
  
  return (
    <div className="container">
      {/* Overlay de Loading */}
      {loading && (
        <div className="loading-container">
          <img src={loadingGif} alt="Carregando..." />
          <p>Entrando...</p>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
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
        <button id='botaoGoogle'>Logar com Google</button>
      </div>

      <div className='facedivider'>
        <img id="logo-face" name='google' src={Face} />
        <button id='botaoFace'>Logar com Facebook</button>
      </div>

      <button id='botaocadastro'>Cadastrar</button>

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
          <h3>Metas e Orçamentos</h3>
        </div>
        <img id="logo-rodape" name='finito' src={Logo} />
        <div className='coluna1'>
          <h2>RECURSOS</h2>
          <h3>Dashboard Financeiro</h3>
          <h3>Planejamento Mensal</h3>
          <h3>Metas e Orçamentos</h3>
        </div>
        <div className='coluna1'>
          <h2>RECURSOS</h2>
          <h3>Dashboard Financeiro</h3>
          <h3>Planejamento Mensal</h3>
          <h3>Metas e Orçamentos</h3>
        </div>
      </div>

    </div>
  );
}

export default Home;
