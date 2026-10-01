"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "../components/Shell";
import NovoContatoModal from "../components/NovoContatoModal";

const COLUNAS = [
  { etapa: "novo", nome: "Novo", cor: "var(--stage-novo)" },
  { etapa: "em contato", nome: "Em contato", cor: "var(--stage-contato)" },
  { etapa: "proposta", nome: "Proposta", cor: "var(--stage-proposta)" },
  { etapa: "cliente", nome: "Cliente", cor: "var(--stage-cliente)" },
];

// Mostra há quanto tempo o contato foi cadastrado.
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

export default function Funil() {
  const router = useRouter();
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [sobreEtapa, setSobreEtapa] = useState(null);
  const arrastandoId = useRef(null);

  useEffect(() => {
    fetch("/api/contatos")
      .then((r) => r.json())
      .then(setContatos)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  // Muda a etapa: atualiza na tela na hora e salva no banco; se falhar, desfaz.
  async function mudarEtapa(id, novaEtapa) {
    const anterior = contatos.find((c) => c.id === id)?.etapa;
    if (anterior === novaEtapa) return;
    setContatos((atuais) =>
      atuais.map((c) => (c.id === id ? { ...c, etapa: novaEtapa } : c))
    );
    const resposta = await fetch(`/api/contatos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapa: novaEtapa }),
    });
    if (!resposta.ok && anterior) {
      setContatos((atuais) =>
        atuais.map((c) => (c.id === id ? { ...c, etapa: anterior } : c))
      );
    }
  }

  function aoSoltar(etapa) {
    const id = arrastandoId.current;
    arrastandoId.current = null;
    setSobreEtapa(null);
    if (id != null) mudarEtapa(id, etapa);
  }

  return (
    <Shell>
      <div className="area-larga">
        <div className="area-topo">
          <h1 className="area-titulo">Funil</h1>
          <button
            className="btn"
            type="button"
            onClick={() => setModalAberto(true)}
          >
            Novo contato
          </button>
        </div>

        {carregando ? (
          <p className="empty">Carregando o funil...</p>
        ) : (
          <div className="kanban">
            {COLUNAS.map((coluna) => {
              const daColuna = contatos.filter((c) => c.etapa === coluna.etapa);
              return (
                <div
                  key={coluna.etapa}
                  className={`coluna ${
                    sobreEtapa === coluna.etapa ? "coluna-sobre" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (sobreEtapa !== coluna.etapa) setSobreEtapa(coluna.etapa);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    aoSoltar(coluna.etapa);
                  }}
                >
                  <div className="coluna-topo">
                    <span className="coluna-nome" style={{ color: coluna.cor }}>
                      {coluna.nome}
                    </span>
                    <span className="coluna-contador">{daColuna.length}</span>
                  </div>
                  <div className="coluna-corpo">
                    {daColuna.length === 0 ? (
                      <p className="coluna-vazia">Nenhum contato aqui</p>
                    ) : (
                      daColuna.map((contato) => (
                        <div
                          key={contato.id}
                          className="card-contato"
                          draggable
                          onClick={() => router.push(`/contatos/${contato.id}`)}
                          onDragStart={(e) => {
                            arrastandoId.current = contato.id;
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(contato.id));
                          }}
                          onDragEnd={() => {
                            arrastandoId.current = null;
                            setSobreEtapa(null);
                          }}
                        >
                          <p className="card-nome">{contato.nome}</p>
                          {contato.email && (
                            <p className="card-email">{contato.email}</p>
                          )}
                          <p className="card-tempo">
                            {tempoAtras(contato.criado_em)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalAberto && (
        <NovoContatoModal
          onFechar={() => setModalAberto(false)}
          onCriado={(novo) => {
            setContatos((atuais) => [novo, ...atuais]);
            setModalAberto(false);
          }}
        />
      )}
    </Shell>
  );
}
