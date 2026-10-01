"use client";

import { useEffect, useState } from "react";
import Shell from "../components/Shell";

function formatarData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((r) => r.json())
      .then(setUsuarios)
      .catch(() => setErro("Não foi possível carregar os usuários."))
      .finally(() => setCarregando(false));
  }, []);

  async function aprovar(id) {
    setErro("");
    const resposta = await fetch(`/api/usuarios/${id}/aprovar`, {
      method: "POST",
    });
    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Não foi possível aprovar.");
      return;
    }
    const atualizado = await resposta.json();
    setUsuarios((atuais) => atuais.map((u) => (u.id === id ? atualizado : u)));
  }

  const pendentes = usuarios.filter((u) => u.status === "pendente");
  const aprovados = usuarios.filter((u) => u.status === "aprovado");

  return (
    <Shell>
      <div className="area">
        <h1 className="area-titulo">Usuários</h1>

        <section className="card">
          <h2 className="card-title">Pendentes de aprovação</h2>
          {erro && <p className="error">{erro}</p>}
          {carregando ? (
            <p className="empty">Carregando...</p>
          ) : pendentes.length === 0 ? (
            <p className="empty">Ninguém aguardando aprovação.</p>
          ) : (
            <ul className="list">
              {pendentes.map((u) => (
                <li key={u.id} className="contact">
                  <div className="contact-top">
                    <div>
                      <p className="contact-name">{u.usuario}</p>
                      <p className="contact-detail">
                        Cadastrado em {formatarData(u.criado_em)}
                      </p>
                    </div>
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() => aprovar(u.id)}
                    >
                      Aprovar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Usuários ativos</h2>
          {carregando ? (
            <p className="empty">Carregando...</p>
          ) : aprovados.length === 0 ? (
            <p className="empty">Nenhum usuário ativo ainda.</p>
          ) : (
            <ul className="list">
              {aprovados.map((u) => (
                <li key={u.id} className="contact">
                  <div className="contact-top">
                    <div>
                      <p className="contact-name">{u.usuario}</p>
                    </div>
                    <span
                      className={`pill ${
                        u.role === "admin" ? "pill-proposta" : "pill-novo"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
