"use client";

import { useEffect, useState } from "react";
import Shell from "../components/Shell";

// Máscara de telefone brasileiro (fixo 10 dígitos / celular 11 dígitos).
function formatarTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function telefoneValido(valor) {
  const d = valor.replace(/\D/g, "");
  if (d.length === 10) return true;
  if (d.length === 11 && d[2] === "9") return true;
  return false;
}

export default function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    fetch("/api/contatos")
      .then((r) => (r.ok ? r.json() : []))
      .then(setContatos)
      .catch(() => {});
  }, []);

  const q = busca.trim().toLowerCase();
  const resultados = q
    ? contatos.filter(
        (c) =>
          c.nome.toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
      )
    : [];

  function validar() {
    const e = {};
    if (!nome.trim()) e.nome = "O nome é obrigatório.";
    if (email.trim() && !emailValido(email.trim()))
      e.email = "Digite um email válido (ex.: nome@email.com).";
    if (telefone.trim() && !telefoneValido(telefone))
      e.telefone = "Telefone inválido. Use DDD + número, fixo ou celular.";
    return e;
  }

  function limparErro(campo) {
    setErros((atuais) => {
      if (!atuais[campo]) return atuais;
      const copia = { ...atuais };
      delete copia[campo];
      return copia;
    });
  }

  async function salvar(evento) {
    evento.preventDefault();
    setSucesso(false);

    const novos = validar();
    if (Object.keys(novos).length > 0) {
      setErros(novos);
      return;
    }
    setErros({});

    setSalvando(true);
    const resposta = await fetch("/api/contatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone }),
    });
    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErros({
        geral: dados.mensagem || "Não foi possível salvar o contato.",
      });
      return;
    }

    const novo = await resposta.json();
    setContatos((atuais) => [novo, ...atuais]);
    setNome("");
    setEmail("");
    setTelefone("");
    setSucesso(true);
  }

  return (
    <Shell>
      <div className="area">
        <h1 className="area-titulo">Contatos</h1>

        <section className="card">
          <h2 className="card-title">Buscar contato</h2>
          <input
            className="busca-input"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou email..."
            aria-label="Buscar contato"
          />
          {q &&
            (resultados.length === 0 ? (
              <p className="empty busca-vazio">Nenhum contato encontrado.</p>
            ) : (
              <ul className="busca-resultados">
                {resultados.map((c) => (
                  <li key={c.id}>
                    <a className="busca-item" href={`/contatos/${c.id}`}>
                      <span className="busca-item-nome">{c.nome}</span>
                      {c.email && (
                        <span className="busca-item-email">{c.email}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
        </section>

        <section className="card">
          <h2 className="card-title">Novo contato</h2>
          <form onSubmit={salvar} noValidate>
            {erros.geral && <p className="error">{erros.geral}</p>}

            <div className="form-row">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                className={erros.nome ? "input-erro" : ""}
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  limparErro("nome");
                }}
                placeholder="Ex.: Maria Oliveira"
              />
              {erros.nome && <p className="field-error">{erros.nome}</p>}
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={erros.email ? "input-erro" : ""}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  limparErro("email");
                }}
                placeholder="Ex.: maria@email.com"
              />
              {erros.email && <p className="field-error">{erros.email}</p>}
            </div>

            <div className="form-row">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                inputMode="numeric"
                className={erros.telefone ? "input-erro" : ""}
                value={telefone}
                onChange={(e) => {
                  setTelefone(formatarTelefone(e.target.value));
                  limparErro("telefone");
                }}
                placeholder="Ex.: (11) 91234-5678"
              />
              {erros.telefone && (
                <p className="field-error">{erros.telefone}</p>
              )}
            </div>

            <button className="btn" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar contato"}
            </button>

            {sucesso && (
              <p className="sucesso">Contato cadastrado. Veja no Funil.</p>
            )}
          </form>
        </section>
      </div>
    </Shell>
  );
}
