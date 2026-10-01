"use client";

import { useEffect, useState } from "react";

// Mostra a data num formato legível, ex.: 27/09/2026 15:42
function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Painel de anotações de UM contato (recebe o id do contato).
export default function Anotacoes({ contatoId }) {
  const [anotacoes, setAnotacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Edição: qual anotação está sendo editada e o texto em edição.
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Ao abrir o painel, busca as anotações deste contato.
  useEffect(() => {
    fetch(`/api/contatos/${contatoId}/anotacoes`)
      .then((r) => r.json())
      .then((dados) => setAnotacoes(dados))
      .catch(() => setErro("Não foi possível carregar as anotações."))
      .finally(() => setCarregando(false));
  }, [contatoId]);

  async function adicionar(evento) {
    evento.preventDefault();
    setErro("");

    if (!texto.trim()) {
      setErro("Escreva algo antes de salvar.");
      return;
    }

    setSalvando(true);
    const resposta = await fetch(`/api/contatos/${contatoId}/anotacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Não foi possível salvar a anotação.");
      return;
    }

    const nova = await resposta.json();
    setAnotacoes((atuais) => [nova, ...atuais]); // entra no topo, sem recarregar
    setTexto("");
  }

  function iniciarEdicao(anotacao) {
    setEditandoId(anotacao.id);
    setTextoEditado(anotacao.texto);
    setErro("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTextoEditado("");
  }

  async function salvarEdicao(id) {
    setErro("");
    if (!textoEditado.trim()) {
      setErro("A anotação não pode ficar vazia.");
      return;
    }

    setSalvandoEdicao(true);
    const resposta = await fetch(`/api/anotacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: textoEditado }),
    });
    setSalvandoEdicao(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Não foi possível salvar a edição.");
      return;
    }

    const atualizada = await resposta.json();
    setAnotacoes((atuais) =>
      atuais.map((a) => (a.id === id ? atualizada : a))
    );
    cancelarEdicao();
  }

  async function excluir(id) {
    // Excluir é irreversível: confirma antes.
    if (!window.confirm("Tem certeza que deseja excluir esta anotação?")) {
      return;
    }

    setErro("");
    const resposta = await fetch(`/api/anotacoes/${id}`, { method: "DELETE" });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.mensagem || "Não foi possível excluir a anotação.");
      return;
    }

    setAnotacoes((atuais) => atuais.filter((a) => a.id !== id));
  }

  return (
    <div className="notes">
      <form onSubmit={adicionar} className="notes-form">
        {erro && <p className="field-error">{erro}</p>}
        <textarea
          className="notes-input"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma anotação..."
          rows={2}
        />
        <button className="btn btn-sm" type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Adicionar anotação"}
        </button>
      </form>

      {carregando ? (
        <p className="empty">Carregando anotações...</p>
      ) : anotacoes.length === 0 ? (
        <p className="empty">Nenhuma anotação ainda.</p>
      ) : (
        <ul className="notes-list">
          {anotacoes.map((anotacao) =>
            editandoId === anotacao.id ? (
              <li key={anotacao.id} className="note">
                <textarea
                  className="notes-input"
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  rows={2}
                />
                <div className="note-actions">
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => salvarEdicao(anotacao.id)}
                    disabled={salvandoEdicao}
                  >
                    {salvandoEdicao ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    className="btn-link"
                    type="button"
                    onClick={cancelarEdicao}
                  >
                    Cancelar
                  </button>
                </div>
              </li>
            ) : (
              <li key={anotacao.id} className="note">
                <p className="note-text">{anotacao.texto}</p>
                <div className="note-footer">
                  <p className="note-date">{formatarData(anotacao.criado_em)}</p>
                  <div className="note-actions">
                    <button
                      className="btn-link"
                      type="button"
                      onClick={() => iniciarEdicao(anotacao)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-link btn-link-danger"
                      type="button"
                      onClick={() => excluir(anotacao.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
