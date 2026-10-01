import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { gerarHashSenha } from "@/lib/senha";

// POST /api/register → cria um usuário novo, sempre como pendente.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const usuario = (corpo.usuario || "").trim();
  const senha = corpo.senha || "";

  if (!usuario || !senha) {
    return NextResponse.json(
      { mensagem: "Informe usuário e senha." },
      { status: 400 }
    );
  }
  if (senha.length < 6) {
    return NextResponse.json(
      { mensagem: "A senha deve ter ao menos 6 caracteres." },
      { status: 400 }
    );
  }

  // Já existe alguém com esse usuário?
  const { data: existente } = await supabase
    .from("usuarios")
    .select("id")
    .eq("usuario", usuario)
    .maybeSingle();

  if (existente) {
    return NextResponse.json(
      { mensagem: "Esse usuário já existe. Tente outro." },
      { status: 409 }
    );
  }

  const senha_hash = gerarHashSenha(senha);
  const { error } = await supabase
    .from("usuarios")
    .insert({ usuario, senha_hash, role: "usuario", status: "pendente" });

  if (error) {
    console.error("POST /api/register:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível concluir o cadastro." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
