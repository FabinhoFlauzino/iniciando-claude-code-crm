import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// Embaralha a senha (scrypt). Guarda no formato "salt:hash", em hex.
export function gerarHashSenha(senha) {
  const salt = randomBytes(16);
  const derivado = scryptSync(senha, salt, 64);
  return `${salt.toString("hex")}:${derivado.toString("hex")}`;
}

// Confere a senha digitada contra o hash guardado.
export function verificarSenha(senha, armazenado) {
  const [saltHex, hashHex] = (armazenado || "").split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const derivado = scryptSync(senha, salt, 64);
  const esperado = Buffer.from(hashHex, "hex");

  if (derivado.length !== esperado.length) return false;
  return timingSafeEqual(derivado, esperado);
}
