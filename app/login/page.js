"use client";

import { useState } from "react";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(evento) {
    evento.preventDefault();
    setErro("");
    setEntrando(true);

    const resposta = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });
    setEntrando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Usuário ou senha inválidos.");
      return;
    }

    // Entrou: recarrega indo para a tela principal (agora com o cookie válido).
    window.location.href = "/";
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Meu CRM</h1>
        <p className="login-tagline">Entre para acessar seus contatos.</p>

        <form onSubmit={entrar} noValidate>
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
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-full" type="submit" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>

          <p className="login-link">
            Não tem conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </div>
    </main>
  );
}
