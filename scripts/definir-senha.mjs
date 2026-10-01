// Define usuário e senha do administrador.
// A senha é digitada AQUI no seu terminal, embaralhada com scrypt e salva
// no .env.local. Ela nunca é gravada como texto puro nem enviada a lugar nenhum.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { scryptSync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const CAMINHO_ENV = ".env.local";

// Pergunta visível (para o usuário).
async function perguntar(texto) {
  const rl = createInterface({ input: stdin, output: stdout });
  const resposta = await rl.question(texto);
  rl.close();
  return resposta.trim();
}

// Pergunta oculta (para a senha): não mostra o que é digitado.
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
        if (ch === "\u0003") process.exit(1); // Ctrl+C
        else if (ch === "\u007f" || ch === "\b") senha = senha.slice(0, -1);
        else senha += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const usuario = await perguntar("Usuário do administrador: ");
const senha = await perguntarSenha("Senha (não aparece na tela): ");

if (!usuario || !senha) {
  console.log("\nUsuário e senha são obrigatórios. Nada foi salvo.");
  process.exit(1);
}

// Embaralha a senha (scrypt) e gera um segredo aleatório para assinar as sessões.
const salt = randomBytes(16);
const hash = scryptSync(senha, salt, 64).toString("hex");
const senhaHash = `${salt.toString("hex")}:${hash}`;
const sessionSecret = randomBytes(32).toString("hex");

// Preserva as outras linhas do .env.local (ex.: as do Supabase).
let linhas = existsSync(CAMINHO_ENV)
  ? readFileSync(CAMINHO_ENV, "utf8").split(/\r?\n/)
  : [];

const gerenciadas = ["ADMIN_USUARIO", "ADMIN_SENHA_HASH", "SESSION_SECRET"];
linhas = linhas.filter((l) => !gerenciadas.some((n) => l.startsWith(n + "=")));
while (linhas.length && linhas[linhas.length - 1].trim() === "") linhas.pop();

linhas.push("");
linhas.push("# Login do administrador (gerado por scripts/definir-senha.mjs)");
linhas.push(`ADMIN_USUARIO=${usuario}`);
linhas.push(`ADMIN_SENHA_HASH=${senhaHash}`);
linhas.push(`SESSION_SECRET=${sessionSecret}`);
linhas.push("");

writeFileSync(CAMINHO_ENV, linhas.join("\n"), "utf8");

console.log("Pronto! Usuário e senha (embaralhada) salvos em .env.local.");
console.log("Agora reinicie o servidor (npm run dev) para valer.");
