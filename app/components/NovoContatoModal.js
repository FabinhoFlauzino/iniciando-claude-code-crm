"use client";

import { useState } from "react";

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

export default function NovoContatoModal({ onFechar, onCriado }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

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
      setErros({ geral: dados.mensagem || "Não foi possível salvar o contato." });
      return;
    }

    const novo = await resposta.json();
    onCriado(novo);
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-topo">
          <h2 className="card-title">Novo contato</h2>
          <button className="btn-link" type="button" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <form onSubmit={salvar} noValidate>
          {erros.geral && <p className="error">{erros.geral}</p>}

          <div className="form-row">
            <label htmlFor="m-nome">Nome</label>
            <input
              id="m-nome"
              className={erros.nome ? "input-erro" : ""}
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                limparErro("nome");
              }}
              placeholder="Ex.: Maria Oliveira"
              autoFocus
            />
            {erros.nome && <p className="field-error">{erros.nome}</p>}
          </div>

          <div className="form-row">
            <label htmlFor="m-email">Email</label>
            <input
              id="m-email"
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
            <label htmlFor="m-telefone">Telefone</label>
            <input
              id="m-telefone"
              inputMode="numeric"
              className={erros.telefone ? "input-erro" : ""}
              value={telefone}
              onChange={(e) => {
                setTelefone(formatarTelefone(e.target.value));
                limparErro("telefone");
              }}
              placeholder="Ex.: (11) 91234-5678"
            />
            {erros.telefone && <p className="field-error">{erros.telefone}</p>}
          </div>

          <button className="btn btn-full" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar contato"}
          </button>
        </form>
      </div>
    </div>
  );
}
