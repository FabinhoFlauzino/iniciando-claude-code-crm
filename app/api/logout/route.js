import { NextResponse } from "next/server";

// POST /api/logout → apaga o cookie de sessão (desconecta).
export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set("sessao", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // expira imediatamente
  });
  return resposta;
}
