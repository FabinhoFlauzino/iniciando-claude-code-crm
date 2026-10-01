"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Áreas do sistema (Usuários é adicionada só para admin; há espaço para crescer).
const AREAS = [
  { href: "/", rotulo: "Dashboard" },
  { href: "/funil", rotulo: "Funil" },
  { href: "/contatos", rotulo: "Contatos" },
];

export default function Shell({ children }) {
  const [eu, setEu] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  // Descobre quem está logado (e se é admin) para montar o menu.
  useEffect(() => {
    fetch("/api/eu")
      .then((r) => (r.ok ? r.json() : null))
      .then(setEu)
      .catch(() => {});
  }, []);

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const areas =
    eu?.role === "admin"
      ? [...AREAS, { href: "/usuarios", rotulo: "Usuários" }]
      : AREAS;

  return (
    <div className="shell">
      <header className="appheader">
        <div className="appheader-left">
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir ou fechar o menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="appheader-brand">Meu CRM</span>
        </div>
        <div className="appheader-right">
          {eu && <span className="appheader-user">{eu.usuario}</span>}
          <button className="btn-link" type="button" onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      <div className="shell-body">
        <aside className={`sidebar ${menuAberto ? "sidebar-aberto" : ""}`}>
          <nav className="sidebar-nav">
            {areas.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className={`nav-item ${
                  pathname === a.href ? "nav-item-ativo" : ""
                }`}
                onClick={() => setMenuAberto(false)}
              >
                {a.rotulo}
              </a>
            ))}
          </nav>
        </aside>

        {menuAberto && (
          <div
            className="sidebar-overlay"
            onClick={() => setMenuAberto(false)}
          />
        )}

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
