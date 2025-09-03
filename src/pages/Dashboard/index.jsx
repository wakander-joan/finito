{/* Import's Geral.................*/ }
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styledash.css';
import api from '../../services/api';

import Cabecalho from './cabecalho'
import Valores from './valores'
import Imputs from './inputs'
import Lancamentos from './lancamentos'


function Dashboard() {

  return (
    <div className="container-dash">
      <Cabecalho />
      <div className='Caixa-dados'>
        <Valores />
        <div className='Imputs-Lancamentos'>
          <Imputs />
          <Lancamentos />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;