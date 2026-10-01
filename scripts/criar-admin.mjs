// Cria (ou promove) um usuário como ADMIN, já aprovado.
// A senha é digitada aqui no seu terminal, embaralhada com scrypt e salva no
// banco. Também garante que exista um SESSION_SECRET no .env.local.
//
// Rode assim (para carregar os segredos do Supabase):
//   node --env-file=.env.local scripts/criar-admin.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { scryptSync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createClient } from "@supabase/supabase-js";

const CAMINHO_ENV = ".env.local";

async function perguntar(texto) {
  const rl = createInterface({ input: stdin, output: stdout });
  const resposta = await rl.question(texto);
  rl.close();
  return resposta.trim();
}

function perguntarSenha(texto) {
  return new Promise((resolve) => {
    stdout.write(texto);
    stdin.resume();
    stdin.setEncoding("utf8");
    if (stdin.setRawMode) stdin.setRawMode(true);
    let senha = "";
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n" || ch === "\u0004") {
          if (stdin.setRawMode) stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          return resolve(senha);
        }
        if (ch === "\u0003") process.exit(1);
        else if (ch === "\u007f" || ch === "\b") senha = senha.slice(0, -1);
        else senha += ch;
      }
    };
    stdin.on("data", onData);
  });
}

// 1) Garante um SESSION_SECRET no .env.local (para assinar as sessões).
let linhas = existsSync(CAMINHO_ENV)
  ? readFileSync(CAMINHO_ENV, "utf8").split(/\r?\n/)
  : [];
if (!linhas.some((l) => l.startsWith("SESSION_SECRET="))) {
  while (linhas.length && linhas[linhas.length - 1].trim() === "") linhas.pop();
  linhas.push("");
  linhas.push("# Segredo para assinar as sessões (gerado automaticamente)");
  linhas.push(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
  linhas.push("");
  writeFileSync(CAMINHO_ENV, linhas.join("\n"), "utf8");
  console.log("SESSION_SECRET criado no .env.local.");
}

// 2) Pergunta usuário e senha do admin.
const usuario = await perguntar("Usuário do admin (ex.: Fabio): ");
const senha = await perguntarSenha("Senha do admin (não aparece na tela): ");

if (!usuario || !senha) {
  console.log("\nUsuário e senha são obrigatórios. Nada foi salvo.");
  process.exit(1);
}

// 3) Embaralha a senha e grava no banco como admin já aprovado.
const salt = randomBytes(16);
const hash = scryptSync(senha, salt, 64).toString("hex");
const senha_hash = `${salt.toString("hex")}:${hash}`;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const { data: existente } = await supabase
  .from("usuarios")
  .select("id")
  .eq("usuario", usuario)
  .maybeSingle();

let erro;
if (existente) {
  ({ error: erro } = await supabase
    .from("usuarios")
    .update({ senha_hash, role: "admin", status: "aprovado" })
    .eq("id", existente.id));
} else {
  ({ error: erro } = await supabase
    .from("usuarios")
    .insert({ usuario, senha_hash, role: "admin", status: "aprovado" }));
}

if (erro) {
  console.log("Erro ao salvar no banco:", erro.message);
  process.exit(1);
}

console.log(`Pronto! "${usuario}" agora é admin e está aprovado.`);
console.log("Reinicie o servidor (npm run dev) para valer.");
