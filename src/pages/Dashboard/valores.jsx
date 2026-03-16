import './styledash.css';
import setareceitas from '../../assets/seta-receitas.png';
import setadespesas from '../../assets/seta-despesas.png';
import calendarioicon from '../../assets/calendarioicon.png';
import carteiraicon from '../../assets/carteiraicon.png';

function Valores() {
    let body_response = [];
    try {
        const stored = localStorage.getItem('body-response-array');
        if (stored) {
            body_response = JSON.parse(stored);
            if (!Array.isArray(body_response)) body_response = [];
        }
    } catch (err) {
        console.error("Erro ao ler body-response-array:", err);
        body_response = [];
    }

    const totalReceitas = somarReceitas(body_response);
    const totalDespesas = somarDespesas(body_response);
    const mediaTotal = totalReceitas - totalDespesas;
    const mediaTotalFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaTotal);
    const totalFormatadoReceitas = somarReceitasFormatadas(body_response);
    const totalFormatadoDespesas = somarDespesasFormatadas(body_response);
    const saldoFormatado = calcularSaldo(body_response);

    localStorage.setItem("totalFormatadoReceitas", totalFormatadoReceitas);
    localStorage.setItem("totalFormatadoDespesas", totalFormatadoDespesas);
    localStorage.setItem("mediaTotalFormatado", mediaTotalFormatado);
    localStorage.setItem("saldoFormatado", saldoFormatado);

    function somarReceitasFormatadas(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";
        const total = bodyArray.reduce((acc, item) => item.tipo === 'RECEITA' && item.preco != null ? acc + Number(item.preco) : acc, 0);
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    }

    function somarDespesasFormatadas(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";
        const total = bodyArray.reduce((acc, item) => item.tipo === 'DESPESA' && item.preco != null ? acc + Number(item.preco) : acc, 0);
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    }

    function somarReceitas(bodyArray) {
        if (!Array.isArray(bodyArray)) return 0;
        return bodyArray.reduce((acc, item) => item.tipo === 'RECEITA' && item.preco != null ? acc + Number(item.preco) : acc, 0);
    }

    function somarDespesas(bodyArray) {
        if (!Array.isArray(bodyArray)) return 0;
        return bodyArray.reduce((acc, item) => item.tipo === 'DESPESA' && item.preco != null ? acc + Number(item.preco) : acc, 0);
    }

    function calcularSaldo(bodyArray) {
        if (!Array.isArray(bodyArray)) return "R$ 0,00";
        let rec = 0, desp = 0;
        bodyArray.forEach(item => {
            if (item.preco != null) {
                if (item.tipo === 'RECEITA' && item.status === 'PAGO') rec += Number(item.preco);
                else if (item.tipo === 'DESPESA' && item.status === 'PAGO') desp += Number(item.preco);
            }
        });
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rec - desp);
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
            <div id='Resultados'>
                <img id='icons' src={calendarioicon} alt="" />
                <p className='Valores-nomes'>Média</p>
                <p id='Valor-media' className='Valores-numeros'>{mediaTotalFormatado}</p>
            </div>
            <div id='Resultados'>
                <img id='icons' src={carteiraicon} alt="" />
                <p className='Valores-nomes'>Carteira</p>
                <p id='Valor-atual' className='Valores-numeros'>{saldoFormatado}</p>
            </div>
        </div>
    );
}

export default Valores;