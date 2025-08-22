import { useState } from 'react';
import './style.css';
import Logo from '../../assets/finito-logo.png';
import google from '../../assets/google.png';
import Face from '../../assets/f.png';
import api from '../../services/api';

function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(null);
  const [mensagem, setMensagem] = useState('');

  async function login() {
    try {
      const body = { email, senha };
      const response = await api.post('/auth/login', body); // usando sua instância api

      setToken(response.data.token); // salva o token no state
      console.log('Token recebido:', response.data.token);
      setMensagem('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
    }
  }

  return (
    <div className="container">
      <form onSubmit={(e) => e.preventDefault()}>
        <img id="logo-principal" name="finito" src={Logo} />
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
