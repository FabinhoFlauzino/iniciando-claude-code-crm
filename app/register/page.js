"use client";

import { useState } from "react";

export default function Register() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    const resposta = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });
    setEnviando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Não foi possível cadastrar.");
      return;
    }
    setPronto(true);
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Meu CRM</h1>
        <p className="login-tagline">Crie sua conta para acessar o sistema.</p>

        {pronto ? (
          <>
            <p className="sucesso">
              Cadastro enviado! Sua conta ficará pendente até um administrador
              aprovar.
            </p>
            <p className="login-link">
              <a href="/login">Ir para o login</a>
            </p>
          </>
        ) : (
          <form onSubmit={cadastrar} noValidate>
            {erro && <p className="error">{erro}</p>}

            <div className="form-row">
              <label htmlFor="usuario">Usuário</label>
              <input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-row">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button className="btn btn-full" type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Cadastrar"}
            </button>

            <p className="login-link">
              Já tem conta? <a href="/login">Entrar</a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
