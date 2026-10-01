# Meu CRM

Um CRM (sistema para organizar contatos e oportunidades de negócio) construído do
zero como **projeto prático para aprender a trabalhar com o [Claude Code](https://claude.com/claude-code)** — desenvolvimento assistido por IA.

## Sobre o projeto

Sou **desenvolvedor front-end** e estou sempre me atualizando. Montei este CRM
ponta a ponta usando o **Claude Code** para aprender, na prática, como conduzir um
projeto real ao lado de um assistente de IA: do documento inicial (PRD e identidade
visual) ao código, aos testes e à publicação.

Não é um template: é um produto pequeno, porém completo — com banco de dados,
autenticação própria, área de administração e um toque de IA.

## O que o CRM faz

**v1**

- Cadastro e listagem de contatos
- Funil com etapas (novo, em contato, proposta, cliente)
- Anotações por contato
- Login e sistema de usuários com papéis (admin/usuário) e aprovação de cadastro
- Follow-up gerado por IA
- Painel com os números do funil

**v2 — "Dark Tech"**

- Nova identidade visual escura e técnica, com navegação lateral (shell de aplicação)
- Kanban do funil (arrastar e soltar entre as etapas)
- Página do contato (dados, etapa, anotações e follow-ups num só lugar, com busca)
- Dashboard repaginado, com gráfico simples da distribuição por etapa

## Tecnologias

- **Next.js (App Router) + React** — telas e back-end no mesmo projeto
- **Supabase (PostgreSQL)** — banco de dados
- **Google Gemini** — geração dos follow-ups por IA
- **Autenticação própria** — senha com hash (scrypt) e sessão em cookie assinado (HMAC), protegida por middleware
- **CSS puro** — identidade visual por tokens; fontes Manrope e JetBrains Mono

## Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz com as suas chaves (ficam **fora** do
   controle de versão):

   ```
   SUPABASE_URL=...
   SUPABASE_SECRET_KEY=...
   SESSION_SECRET=...
   GEMINI_API_KEY=...
   ```

3. Crie as tabelas no Supabase (SQL Editor):

   ```sql
   create table contatos (
     id         bigint generated always as identity primary key,
     nome       text not null,
     email      text,
     telefone   text,
     etapa      text not null default 'novo'
                check (etapa in ('novo', 'em contato', 'proposta', 'cliente')),
     anotacoes  text,
     criado_em  timestamptz not null default now()
   );

   create table anotacoes (
     id          bigint generated always as identity primary key,
     contato_id  bigint not null references contatos(id) on delete cascade,
     texto       text not null,
     criado_em   timestamptz not null default now()
   );

   create table usuarios (
     id         bigint generated always as identity primary key,
     usuario    text not null unique,
     senha_hash text not null,
     role       text not null default 'usuario' check (role in ('admin', 'usuario')),
     status     text not null default 'pendente' check (status in ('pendente', 'aprovado')),
     criado_em  timestamptz not null default now()
   );

   create table followups (
     id          bigint generated always as identity primary key,
     contato_id  bigint not null references contatos(id) on delete cascade,
     texto       text not null,
     criado_em   timestamptz not null default now()
   );
   ```

4. Crie o usuário administrador (a senha é digitada no terminal, nunca gravada como
   texto puro):

   ```bash
   node --env-file=.env.local scripts/criar-admin.mjs
   ```

5. Rode em desenvolvimento e abra <http://localhost:3000>:

   ```bash
   npm run dev
   ```

## Construído com Claude Code

Todo o projeto — planejamento, código, testes e publicação — foi conduzido com o
**Claude Code**, como exercício de aprendizado de desenvolvimento assistido por IA.
