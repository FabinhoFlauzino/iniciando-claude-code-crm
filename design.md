# Identidade visual do CRM — v2 · Dark Tech

Estas regras valem para **todas as telas** do projeto (inclusive login, cadastro e usuários) e **substituem** a identidade anterior.

## Clima
Ferramenta técnica e precisa, escura, de quem trabalha à noite. Um produto profissional, não um template.

## Cores

### Base
- Fundo: `#0D1117` (quase-preto, azulado)
- Superfícies (cards, caixas): `#151B24` com bordas visíveis `#262F3D`
- Superfícies elevadas (modais, menus): `#1B222E`
- Texto principal: `#E6EAF2`
- Texto de apoio: `#8B97A8`  <!-- corrigido do #9A0A8B do briefing, que era um magenta e brigaria com a regra de "uma só cor de marca" -->

### Destaque (uma só)
Uma única cor de destaque para ações e elementos ativos:
- Azul elétrico: `#4DBDFF`
- Hover (mais claro): `#6BA1FF`

Nenhuma outra cor de marca.

### Etapas do funil (versões luminosas, legíveis no escuro; só nas etiquetas de etapa)
- Novo: `#8B99AD`
- Em contato: `#F5A524`
- Proposta: `#A78BFA`
- Cliente: `#34D399`

### Aviso
- Erro: `#FB7171`

Contraste sempre confortável de ler.

## Tipografia
- Textos e títulos: **Manrope** (sem serifa).
- **Números, contadores e etiquetas técnicas: JetBrains Mono** (o toque tech) — ex.: os números do painel, contagens, o valor da etapa.
- Títulos em peso forte, textos em peso normal. Tamanhos generosos e hierarquia clara.

## Formas
- Cantos levemente arredondados: `10px`.
- Bordas visíveis em vez de sombras.
- Bastante respiro (espaçamento) entre os elementos.

## Proibido
- Gradientes
- Efeito de vidro / desfoque (glassmorphism)
- Emojis na interface
- Sombras exageradas
- Animações chamativas

Se parecer template de IA, está errado.

---

# Do "página" para "sistema" — shell de aplicação

O CRM deixa de ser uma página só e vira um sistema com uma casca (shell) fixa.

## Navegação lateral (esquerda, fixa)
Uma barra lateral fixa à esquerda com as áreas do sistema:
- **Dashboard** — os números do funil.
- **Funil** — a lista de contatos e suas etapas.
- **Contatos** — o cadastro de contato.
- **Usuários** — visível **só para administrador**.
- (espaço reservado para novas áreas crescerem)

O **item ativo** da navegação aparece com **fundo de destaque**.

## Cabeçalho (topo)
Uma faixa no topo com:
- o **nome do CRM**;
- **quem está logado**;
- o botão **Sair**.

## Área de conteúdo (direita)
À direita do menu fica o conteúdo. Cada área é uma **tela cheia** (uma coisa por vez, com respiro).

## Responsivo (telas estreitas)
Em telas estreitas, a navegação lateral **se recolhe** de um jeito simples e usável (ex.: um botão que abre/fecha o menu), sem quebrar o uso.

## Fora do shell
As telas de **login** e **cadastro** não usam o shell (não há menu antes de entrar), mas seguem a mesma identidade Dark Tech: fundo escuro, cartão central, tipografia e cores desta identidade.
