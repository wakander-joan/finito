// src/pages/Graficos.js
import { useEffect, useState } from "react";
import Cabecalho from '../../pages/Dashboard/cabecalho';
import {
  PieChart, Pie, Tooltip, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  Label
} from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6f42c1", "#fd7e14"];

export default function Graficos() {
  const [bodyResponse, setBodyResponse] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("body-response-array");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setBodyResponse(parsed);
      }
    } catch (err) {
      console.error("Erro ao ler body-response-array:", err);
    }
  }, []);

  // ---- 📊 Cálculos básicos ----
  const totalReceitas = bodyResponse
    .filter((l) => l.tipo === "RECEITA")
    .reduce((sum, l) => sum + (parseFloat(l.preco) || 0), 0);

  const totalDespesas = bodyResponse
    .filter((l) => l.tipo === "DESPESA")
    .reduce((sum, l) => sum + (parseFloat(l.preco) || 0), 0);

  const saldo = totalReceitas - totalDespesas;

  // ---- 🍕 Pizza por categoria ----
  const categorias = bodyResponse.reduce((acc, l) => {
    const cat = l.categoriaLancamento || "OUTROS";
    const valor = parseFloat(l.preco) || 0;
    acc[cat] = (acc[cat] || 0) + valor;
    return acc;
  }, {});

  const dataPie = Object.keys(categorias).map((cat) => ({
    name: cat,
    value: categorias[cat],
  }));

  // ---- 📊 Comparativo mensal ----
  const dataMensal = [
    { name: "Jul", receitas: 3000, despesas: 2000 },
    { name: "Ago", receitas: 4000, despesas: 2500 },
    { name: "Set", receitas: totalReceitas, despesas: totalDespesas },
  ];

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}>
      <Cabecalho />
      <label style={{ textAlign: "center" }}>📊 Dashboard Financeiro</label>

      {/* Visão Geral */}
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
          <h3>Saldo Atual</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>R$ {saldo.toFixed(2)}</p>
        </div>
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
          <h3>Total Despesas</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>R$ {totalDespesas.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        {/* Gráfico de Pizza */}
        <PieChart width={400} height={300}>
          <Pie
            data={dataPie}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {dataPie.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        {/* Gráfico de Barras */}
        <BarChart width={400} height={300} data={dataMensal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="receitas" fill="#28a745" />
          <Bar dataKey="despesas" fill="#dc3545" />
        </BarChart>

        {/* Gráfico de Linha */}
        <LineChart width={400} height={300} data={dataMensal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="receitas" stroke="#28a745" />
          <Line type="monotone" dataKey="despesas" stroke="#dc3545" />
        </LineChart>
      </div>

      {/* Últimas transações */}
      <div style={{ marginTop: "40px" }}>
        <h2>Últimas Transações</h2>
        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {bodyResponse.slice(-5).map((l, i) => (
              <tr key={i}>
                <td>{l.data}</td>
                <td>{l.descricao}</td>
                <td>{l.categoriaLancamento}</td>
                <td style={{ color: l.tipo === "DESPESA" ? "red" : "green" }}>
                  {l.tipo === "DESPESA" ? "-" : "+"} R$ {parseFloat(l.preco).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}
