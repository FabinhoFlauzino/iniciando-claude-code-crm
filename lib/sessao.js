// Cria e lê o "crachá" de sessão com HMAC-SHA256 (Web Crypto).
// O crachá carrega quem está logado: { id, usuario, role }.
// Funciona tanto nas rotas do servidor quanto no middleware (porteiro).

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64urlDeBytes(buffer) {
  const bytes = new Uint8Array(buffer);
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function bytesDeB64url(texto) {
  let s = texto.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const binario = atob(s);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

async function chave() {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.SESSION_SECRET || ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Gera o token que vai no cookie após o login.
export async function criarTokenSessao(dados) {
  const corpo = b64urlDeBytes(enc.encode(JSON.stringify(dados)));
  const assinatura = await crypto.subtle.sign("HMAC", await chave(), enc.encode(corpo));
  return `${corpo}.${b64urlDeBytes(assinatura)}`;
}

// Lê e valida o token. Devolve { id, usuario, role } ou null se for inválido.
export async function lerSessao(token) {
  if (!token || typeof token !== "string") return null;
  const ponto = token.indexOf(".");
  if (ponto === -1) return null;

  const corpo = token.slice(0, ponto);
  const assinatura = token.slice(ponto + 1);

  const valido = await crypto.subtle.verify(
    "HMAC",
    await chave(),
    bytesDeB64url(assinatura),
    enc.encode(corpo)
  );
  if (!valido) return null;

  try {
    return JSON.parse(dec.decode(bytesDeB64url(corpo)));
  } catch {
    return null;
  }
}
