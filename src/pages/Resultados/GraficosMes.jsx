import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./GraficosMes.css";

export default function GraficosMes() {
  const [dados, setDados] = useState([]);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  useEffect(() => {
    const body = localStorage.getItem("body-response-array");
    const mesSelecionado = localStorage.getItem("mes-selecionado");
    const anoSelecionado = localStorage.getItem("ano-selecionado");

    if (body) {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed)) {
          setDados(parsed);
        } else {
          console.error("O conteúdo do body-response-array não é um array:", parsed);
        }
      } catch (e) {
        console.error("Erro ao ler body-response-array:", e);
      }
    }

    setMes(mesSelecionado || "Mês não definido");
    setAno(anoSelecionado || "Ano não definido");
  }, []);

  // ===================== CÁLCULOS =====================
  const receitas = dados.filter((d) => d.tipo === "RECEITA");
  const despesas = dados.filter((d) => d.tipo === "DESPESA");

  const totalReceitas = receitas.reduce((acc, cur) => acc + Number(cur.preco || 0), 0);
  const totalDespesas = despesas.reduce((acc, cur) => acc + Number(cur.preco || 0), 0);
  const saldo = totalReceitas - totalDespesas;

  // --- Gráfico de barras (comparativo simples)
  const graficoComparativo = [
    { nome: "Receitas", valor: totalReceitas },
    { nome: "Despesas", valor: totalDespesas },
  ];

  // --- Gráfico de pizza (categorias)
  const categorias = {};
  dados.forEach((d) => {
    const cat = d.categoriaLancamento || "Sem Categoria";
    categorias[cat] = (categorias[cat] || 0) + Number(d.preco || 0);
  });

  const graficoPizza = Object.entries(categorias).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  const cores = [
    "#4CAF50",
    "#E53935",
    "#FFB300",
    "#42A5F5",
    "#8E24AA",
    "#00897B",
    "#D81B60",
  ];

  // --- Gráfico de linha (evolução diária)
  const graficoLinha = dados
    .map((d) => ({
      data: d.dataVencimento,
      valor: Number(d.preco || 0),
      tipo: d.tipo,
    }))
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  return (
    <div className="pixel-dashboard">
      <h1 className="titulo-pixel">
        📊 RELATÓRIO DE {mes?.toUpperCase()} DE {ano}
      </h1>

      {/* === Cards de Resumo === */}
      <div className="resumo-pixel">
        <div className="card-pixel green">
          <p>Receitas</p>
          <h2>R$ {totalReceitas.toFixed(2)}</h2>
        </div>
        <div className="card-pixel red">
          <p>Despesas</p>
          <h2>R$ {totalDespesas.toFixed(2)}</h2>
        </div>
        <div className={`card-pixel ${saldo >= 0 ? "green" : "red"}`}>
          <p>Saldo</p>
          <h2>R$ {saldo.toFixed(2)}</h2>
        </div>
      </div>

      {/* === Gráfico de Barras === */}
      <div className="grafico-area">
        <h3>Receitas x Despesas</h3>
        <ResponsiveContainer width="50%" height={350}>
          <BarChart data={graficoComparativo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" name="Valor">
              {graficoComparativo.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.nome === "Receitas" ? "#4CAF50" : "#E53935"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* === Gráfico de Pizza === */}
      <div className="grafico-area">
        <h3>Distribuição por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={graficoPizza}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name }) => name}
            >
              {graficoPizza.map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* === Gráfico de Linha === */}
      <div className="grafico-area">
        <h3>Evolução Diária</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={graficoLinha}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="valor" stroke="#7E57C2" name="Valor diário" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="botao-voltar">
        <button onClick={() => window.history.back()}>⬅ Voltar</button>
      </div>
    </div>
  );
}