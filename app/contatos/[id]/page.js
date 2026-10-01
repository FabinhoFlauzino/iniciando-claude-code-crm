"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Shell from "../../components/Shell";
import Anotacoes from "../../components/Anotacoes";
import FollowUps from "../../components/FollowUps";

const COR_ETAPA = {
  novo: "var(--stage-novo)",
  "em contato": "var(--stage-contato)",
  proposta: "var(--stage-proposta)",
  cliente: "var(--stage-cliente)",
};

function tempoDesde(iso) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (dias <= 0) return "há menos de um dia";
  if (dias === 1) return "há 1 dia";
  if (dias < 30) return `há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? "há 1 mês" : `há ${meses} meses`;
}

export default function PaginaContato() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [contato, setContato] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoExiste, setNaoExiste] = useState(false);

  useEffect(() => {
    fetch(`/api/contatos/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNaoExiste(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((c) => setContato(c))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [id]);

  // Contato inexistente: avisa e leva de volta ao Funil.
  useEffect(() => {
    if (!naoExiste) return;
    const t = setTimeout(() => router.push("/funil"), 2500);
    return () => clearTimeout(t);
  }, [naoExiste, router]);

  async function mudarEtapa(novaEtapa) {
    const anterior = contato?.etapa;
    setContato((c) => ({ ...c, etapa: novaEtapa }));
    const r = await fetch(`/api/contatos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapa: novaEtapa }),
    });
    if (!r.ok) setContato((c) => ({ ...c, etapa: anterior }));
  }

  return (
    <Shell>
      <div className="area">
        {carregando ? (
          <p className="empty">Carregando...</p>
        ) : naoExiste || !contato ? (
          <section className="card">
            <p className="empty">
              Este contato não existe mais. Voltando ao Funil...
            </p>
            <button
              className="btn btn-sm"
              type="button"
              onClick={() => router.push("/funil")}
              style={{ marginTop: 12 }}
            >
              Voltar ao Funil
            </button>
          </section>
        ) : (
          <>
            <div className="area-topo">
              <a className="btn-link" href="/funil">
                &larr; Voltar ao Funil
              </a>
            </div>

            <section className="card">
              <h1 className="contato-nome">{contato.nome}</h1>
              <div className="contato-meta">
                {contato.email && <span>{contato.email}</span>}
                {contato.telefone && <span>{contato.telefone}</span>}
                <span>meu contato {tempoDesde(contato.criado_em)}</span>
              </div>
              <div className="contato-etapa">
                <label htmlFor="etapa">Etapa</label>
                <select
                  id="etapa"
                  className="etapa-select"
                  style={{ color: COR_ETAPA[contato.etapa] }}
                  value={contato.etapa}
                  onChange={(e) => mudarEtapa(e.target.value)}
                >
                  <option value="novo">novo</option>
                  <option value="em contato">em contato</option>
                  <option value="proposta">proposta</option>
                  <option value="cliente">cliente</option>
                </select>
              </div>
            </section>

            <section className="card">
              <h2 className="card-title">Anotações</h2>
              <Anotacoes contatoId={id} />
            </section>

            <section className="card">
              <h2 className="card-title">Follow-ups</h2>
              <FollowUps contatoId={id} />
            </section>
          </>
        )}
      </div>
    </Shell>
  );
}
