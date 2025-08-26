import './style.css';
import calender from '../../assets/calendario.png';
import Logo from '../../assets/logo.png';
import { useState } from 'react';

function Cadastro() {
  const [anoSelecionado, setAnoSelecionado] = useState('2025');

  return (
    <div className="container">
      <div className='Cabecalho'>
        <img id="logo-finito-cabecalho" src={Logo} alt="Finito" />
        <h2 id='FINITO-TEXT'>FINITO</h2>
        <h2 id='ANO-TEXT'>ANO</h2>
        {/* Menu de opções */}
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(e.target.value)}
          className="select-ano"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
        <h2 id='USUARIO-TEXT'>Joan</h2>
      </div>

      <div className="image-container">
        <img id="logo-principal" src={calender} alt="Finito" />
        <div className="mes-overlay">
          <h1 onClick={() => alert('Janeiro de ' + anoSelecionado)} className="JANEIRO">JANEIRO</h1>
          <h1 onClick={() => alert('Fevereiro de ' + anoSelecionado)} className="FEVEREIRO">FEVEREIRO</h1>
          <h1 onClick={() => alert('Março de ' + anoSelecionado)} className="MARCO">MARÇO</h1>
          <h1 onClick={() => alert('Abril de ' + anoSelecionado)} className="ABRIL">ABRIL</h1>
          <h1 onClick={() => alert('Maio de ' + anoSelecionado)} className="MAIO">MAIO</h1>
          <h1 onClick={() => alert('Junho de ' + anoSelecionado)} className="JUNHO">JUNHO</h1>
          <h1 onClick={() => alert('Julho de ' + anoSelecionado)} className="JULHO">JULHO</h1>
          <h1 onClick={() => alert('Agosto de ' + anoSelecionado)} className="AGOSTO">AGOSTO</h1>
          <h1 onClick={() => alert('Setembro de ' + anoSelecionado)} className="SETEMBRO">SETEMBRO</h1>
          <h1 onClick={() => alert('Outubro de ' + anoSelecionado)} className="OUTUBRO">OUTUBRO</h1>
          <h1 onClick={() => alert('Novembro de ' + anoSelecionado)} className="NOVEMBRO">NOVEMBRO</h1>
          <h1 onClick={() => alert('Dezembro de ' + anoSelecionado)} className="DEZEMBRO">DEZEMBRO</h1>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
