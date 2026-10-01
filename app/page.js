"use client";

import { useEffect, useState } from "react";
import Shell from "./components/Shell";
import Painel from "./components/Painel";
import GraficoFunil from "./components/GraficoFunil";

function tempoAtras(iso) {
  const seg = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seg < 60) return "agora mesmo";
  const min = Math.floor(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return d === 1 ? "há 1 dia" : `há ${d} dias`;
  const meses = Math.floor(d / 30);
  return meses === 1 ? "há 1 mês" : `há ${meses} meses`;
}

export default function Dashboard() {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/contatos")
      .then((r) => r.json())
      .then(setContatos)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const recentes = contatos.slice(0, 5); // GET já vem do mais novo pro mais antigo

  return (
    <Shell>
      <div className="area">
        <h1 className="area-titulo">Dashboard</h1>

        <Painel contatos={contatos} />

        <section className="card">
          <h2 className="card-title">Distribuição por etapa</h2>
          <GraficoFunil contatos={contatos} />
        </section>

        <section className="card">
          <h2 className="card-title">Últimos contatos</h2>
          {carregando ? (
            <p className="empty">Carregando...</p>
          ) : recentes.length === 0 ? (
            <p className="empty">Nenhum contato ainda.</p>
          ) : (
            <ul className="recentes">
              {recentes.map((c) => (
                <li key={c.id}>
                  <a className="recente-item" href={`/contatos/${c.id}`}>
                    <span className="recente-nome">{c.nome}</span>
                    <span className="recente-tempo">{tempoAtras(c.criado_em)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
