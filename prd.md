# PRD — CRM

## O que é e pra quem

Um CRM simples para organizar contatos e oportunidades de negócio em um só lugar.
É para um administrador (você) que quer acompanhar cada contato desde o primeiro papo até virar cliente, sem planilha bagunçada.
O foco é clareza: ver rápido quem são os contatos, em que etapa estão e o que fazer a seguir.

## Primeira versão (o que vamos entregar)

- [x] Cadastro e listagem de contatos
- [x] Funil com etapas: novo, em contato, proposta, cliente
- [x] Anotações por contato
- [x] Login de administrador
- [x] Usuários e papéis — cadastro (register) que entra pendente, aprovação só pelo admin, papéis admin/usuário e tela de Usuários. Entregue depois, fora do plano original.
- [x] Follow-up gerado por IA
- [x] Painel com os números do funil
- [ ] Publicação na internet

## O que NÃO entra na primeira versão

Deixamos de fora, por enquanto, para não perder o foco:

- Integração com e-mail, WhatsApp ou telefone
- Importar/exportar contatos em massa
- Aplicativo de celular
- Relatórios avançados e gráficos além do painel do funil
- Automações e lembretes agendados
- Personalizar as etapas do funil (ficam fixas nesta versão)

## Versão 2 (o que vamos entregar)

- [x] **Kanban do funil** — ver e mover os contatos entre as etapas arrastando.
  - PRONTO QUANDO:
    1. No Funil, os contatos aparecem em 4 colunas, uma por etapa (novo, em contato, proposta, cliente).
    2. Arrasto o cartão de um contato de uma coluna para outra e ele passa para a nova etapa.
    3. Recarrego a página (F5) e o contato continua na etapa para onde eu arrastei (salvou no banco).
    4. Cada coluna mostra quantos contatos ela tem.
    5. Volto ao Dashboard e os números batem com a mudança que fiz.

- [x] **Página do contato** — tudo de um contato num lugar só, com busca para chegar rápido.
  - PRONTO QUANDO:
    1. Clico num contato e abro uma página dedicada só a ele.
    2. Nessa página vejo, juntos: dados (nome, email, telefone), etapa atual, anotações e os follow-ups já gerados.
    3. Há um campo de busca; digito parte de um nome e a lista filtra os contatos correspondentes.
    4. Clico num resultado da busca e caio direto na página daquele contato.
    5. Um link/botão me leva de volta ao Funil sem me perder.

- [x] **Dashboard v2** — números do funil como painel de sistema, com um gráfico simples da distribuição por etapa.
  - PRONTO QUANDO:
    1. O Dashboard mostra o total de contatos e a contagem por etapa (como hoje).
    2. Aparece um gráfico simples com a distribuição dos contatos por etapa.
    3. As fatias/barras do gráfico usam as cores das etapas do design.md.
    4. Mudo a etapa de um contato, volto ao Dashboard, e o gráfico reflete a nova distribuição.
    5. Com zero contatos, a tela não quebra (mostra vazio ou zeros de forma limpa).

## Fora da v2 (fica pra v3)

- Permissões avançadas (dono por contato, metas por usuário)
- Automações e lembretes agendados
- Integrações com outros sistemas
- Aplicativo de celular
