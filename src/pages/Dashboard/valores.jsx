import './styledash.css';
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import calendarioicon from '../../assets/calendarioicon.png';
import carteiraicon from '../../assets/carteiraicon.png';

export default function Cabecalho() {
    let body_response = [];
    try {
        const stored = localStorage.getItem('body-response-array');
        if (stored) {
            body_response = JSON.parse(stored); // só tenta parsear se houver algo
            if (!Array.isArray(body_response)) {
                body_response = []; // garante que seja array
            }
        }
    } catch (err) {
        console.error("Erro ao ler body-response-array:", err);
        body_response = [];
    }
    const totalFormatadoReceitas = somarReceitasFormatadas(body_response);
    const totalFormatadoDespesas = somarDespesasFormatadas(body_response);
    const mediaTotal = totalReceitas - totalDespesas;
    const saldo = totalReceitas - totalDespesas;
    const mediaTotalFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(mediaTotal);
    

    const saldoFormatado = calcularSaldo(body_response);

    function calcularSaldo(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";

        let totalReceitas = 0;
        let totalDespesas = 0;

        bodyArray.forEach(item => {
            if (item.preco != null) {
                if (item.tipo === 'RECEITA' && item.status === 'PAGO') {
                    totalReceitas += Number(item.preco);
                } else if (item.tipo === 'DESPESA' && item.status === 'PAGO') {
                    totalDespesas += Number(item.preco);
                }
            }
        });
    }


    function somarReceitasFormatadas(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";

        const totalPreco = bodyArray.reduce((acc, item) => {
            if (item.tipo === 'RECEITA' && item.preco != null) {
                return acc + Number(item.preco);
            }
            return acc;
        }, 0);

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(totalPreco);
    }

    function somarDespesasFormatadas(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";

        const totalPreco = bodyArray.reduce((acc, item) => {
            if (item.tipo === 'DESPESA' && item.preco != null) {
                return acc + Number(item.preco);
            }
            return acc;
        }, 0);

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(totalPreco);
    }


    return (
        <div className='Valores'>
            <div id='Resultados' className='Resulato-Receitas'>
                <img id='iconseta' src={setareceitas} alt="" />
                <p className='Valores-nomes'>Receitas</p>
                <p id='Valor-receitas' className='Valores-numeros'>{totalFormatadoReceitas}</p>
            </div>
            <div id='Resultados' className='Resulato-Despesas'>
                <img id='iconseta' src={setadespesas} alt="" />
                <p className='Valores-nomes'>Despesas</p>
                <p id='Valor-depesas' className='Valores-numeros'>{totalFormatadoDespesas}</p>
            </div>
            <div id='Resultados' className='Resulato-Despesas'>
                <img id='icons' src={calendarioicon} alt="" />
                <p className='Valores-nomes'>Média</p>
                <p id='Valor-media' className='Valores-numeros'>{mediaTotalFormatado}</p>
            </div>
            <div id='Resultados' className='Resulato-Despesas'>
                <img id='icons' src={carteiraicon} alt="" />
                <p className='Valores-nomes'>Carteira</p>
                <p id='Valor-atual' className='Valores-numeros'>{saldoFormatado}</p>
            </div>
        </div>
    )

}