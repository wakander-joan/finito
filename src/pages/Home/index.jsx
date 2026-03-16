import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Logo from '../../assets/finito-logo.png';
import api from '../../services/api';
import loadingGif2 from '../../assets/loading3.gif';
import { jwtDecode } from "jwt-decode";

function Home() {
  localStorage.setItem('ano-selecionado', new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const audioLoading = new Audio("/loading.mp3");

  const tocarSomLoading = () => {
    audioLoading.currentTime = 0;
    audioLoading.play();
  };

  async function login() {
    try {
      setLoading(true);
      const body = { email, senha };
      const response = await api.post('/auth/login', body);
      const tokenRecebido = response.data.token;

      if (!tokenRecebido) {
        alert('Login falhou: token não recebido.');
        return;
      }

      localStorage.setItem('token', tokenRecebido);
      const decoded = jwtDecode(tokenRecebido);
      const { id, nomePessoa, perfil } = decoded;
      localStorage.setItem('idPessoa', id);
      localStorage.setItem('nomePessoa', nomePessoa);
      localStorage.setItem('perfil', perfil);
      tocarSomLoading();
      setTimeout(() => {
        setLoading(false);
        navigate('/cadastro');
      }, 3100);

    } catch (error) {
      alert(`Erro ao fazer login: ${error.response?.data || error.message}`);
      window.location.reload();
    }
  }

  return (
    <div className="container">
      {loading && (
        <div className="loading-container">
          <img src={loadingGif2} alt="Carregando..." />
          <p className="typing"><span className="dots"></span></p>
        </div>
      )}

      <form className='form1' onSubmit={(e) => e.preventDefault()}>
        <img id="logo-principal-home" src={Logo} alt="Finito" />
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
        <button type='button' onClick={() => { login(); tocarSomLoading(); }}>Entrar</button>
      </form>

      <button onClick={() => navigate('/cadastrar')} id='botaocadastro'>Cadastrar</button>
    </div>
  );
}

export default Home;