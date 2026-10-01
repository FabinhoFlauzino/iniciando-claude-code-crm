// Números do funil em cartões grandes (total + contagem por etapa, com a cor da etapa).
const ETAPAS = [
  { chave: "novo", rotulo: "Novo", classe: "stat-novo" },
  { chave: "em contato", rotulo: "Em contato", classe: "stat-contato" },
  { chave: "proposta", rotulo: "Proposta", classe: "stat-proposta" },
  { chave: "cliente", rotulo: "Cliente", classe: "stat-cliente" },
];

export default function Painel({ contatos }) {
  const total = contatos.length;
  const contar = (etapa) => contatos.filter((c) => c.etapa === etapa).length;

  return (
    <div className="painel">
      <div className="stat-card stat-total">
        <span className="stat-num">{total}</span>
        <span className="stat-rotulo">Contatos</span>
      </div>
      {ETAPAS.map((e) => (
        <div key={e.chave} className={`stat-card ${e.classe}`}>
          <span className="stat-num">{contar(e.chave)}</span>
          <span className="stat-rotulo">{e.rotulo}</span>
        </div>
      ))}
    </div>
  );
}
