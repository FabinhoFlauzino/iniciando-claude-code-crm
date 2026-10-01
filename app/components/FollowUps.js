"use client";

import { useEffect, useState } from "react";

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Lista os follow-ups salvos de um contato e permite gerar novos (salvos no banco).
export default function FollowUps({ contatoId }) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const [copiadoId, setCopiadoId] = useState(null);

  useEffect(() => {
    fetch(`/api/contatos/${contatoId}/followup`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setLista)
      .catch(() => setErro("Não foi possível carregar os follow-ups."))
      .finally(() => setCarregando(false));
  }, [contatoId]);

  async function gerar() {
    setErro("");
    setGerando(true);
    try {
      const r = await fetch(`/api/contatos/${contatoId}/followup`, {
        method: "POST",
      });
      if (!r.ok) throw new Error();
      const novo = await r.json();
      setLista((atuais) => [novo, ...atuais]);
    } catch {
      setErro("Não foi possível gerar o follow-up agora. Tente de novo.");
    } finally {
      setGerando(false);
    }
  }

  async function copiar(id, texto) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      setErro("Não foi possível copiar. Copie o texto manualmente.");
    }
  }

  return (
    <div>
      <button
        className="btn btn-sm"
        type="button"
        onClick={gerar}
        disabled={gerando}
      >
        {gerando ? "Escrevendo..." : "Gerar follow-up"}
      </button>

      {gerando && <p className="followup-status">A IA está escrevendo...</p>}
      {erro && <p className="field-error">{erro}</p>}

      {carregando ? (
        <p className="empty followups-lista">Carregando follow-ups...</p>
      ) : lista.length === 0 ? (
        <p className="empty followups-lista">Nenhum follow-up gerado ainda.</p>
      ) : (
        <ul className="notes-list followups-lista">
          {lista.map((f) => (
            <li key={f.id} className="note">
              <p className="note-text">{f.texto}</p>
              <div className="note-footer">
                <p className="note-date">{formatarData(f.criado_em)}</p>
                <button
                  className="btn-link"
                  type="button"
                  onClick={() => copiar(f.id, f.texto)}
                >
                  {copiadoId === f.id ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
