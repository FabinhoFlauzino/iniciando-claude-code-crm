import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verificarSenha } from "@/lib/senha";
import { criarTokenSessao } from "@/lib/sessao";

export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const usuario = (corpo.usuario || "").trim();
  const senha = corpo.senha || "";

  // Busca o usuário no banco.
  const { data: user } = await supabase
    .from("usuarios")
    .select("id, usuario, senha_hash, role, status")
    .eq("usuario", usuario)
    .maybeSingle();

  // Usuário inexistente ou senha errada: mesma mensagem genérica.
  if (!user || !verificarSenha(senha, user.senha_hash)) {
    return NextResponse.json(
      { mensagem: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  // Existe e a senha bate, mas ainda não foi aprovado.
  if (user.status !== "aprovado") {
    return NextResponse.json(
      { mensagem: "Sua conta está pendente de aprovação do administrador." },
      { status: 403 }
    );
  }

  // Tudo certo: emite o crachá com quem é e qual o papel.
  const token = await criarTokenSessao({
    id: user.id,
    usuario: user.usuario,
    role: user.role,
  });

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set("sessao", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    secure: process.env.NODE_ENV === "production",
  });
  return resposta;
}
