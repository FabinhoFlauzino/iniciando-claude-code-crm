// Gráfico de barras simples: distribuição dos contatos por etapa.
// Cada barra usa a cor da etapa (design.md) e mostra o número ao lado (rótulo direto).
const COLUNAS = [
  { etapa: "novo", nome: "Novo", cor: "var(--stage-novo)" },
  { etapa: "em contato", nome: "Em contato", cor: "var(--stage-contato)" },
  { etapa: "proposta", nome: "Proposta", cor: "var(--stage-proposta)" },
  { etapa: "cliente", nome: "Cliente", cor: "var(--stage-cliente)" },
];

export default function GraficoFunil({ contatos }) {
  if (!contatos || contatos.length === 0) {
    return <p className="empty">Sem dados ainda.</p>;
  }

  const dados = COLUNAS.map((c) => ({
    ...c,
    n: contatos.filter((x) => x.etapa === c.etapa).length,
  }));
  const max = Math.max(1, ...dados.map((d) => d.n));

  return (
    <div
      className="grafico"
      role="img"
      aria-label="Distribuição de contatos por etapa do funil"
    >
      {dados.map((d) => (
        <div className="grafico-linha" key={d.etapa}>
          <span className="grafico-rotulo">{d.nome}</span>
          <div className="grafico-trilha">
            <div
              className="grafico-barra"
              style={{ width: `${(d.n / max) * 100}%`, background: d.cor }}
            />
          </div>
          <span className="grafico-valor">{d.n}</span>
        </div>
      ))}
    </div>
  );
}
