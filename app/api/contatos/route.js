import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

// Telefone válido: fixo (10 dígitos) ou celular (11 dígitos, começando com 9).
function telefoneValido(valor) {
  const d = valor.replace(/\D/g, "");
  if (d.length === 10) return true;
  if (d.length === 11 && d[2] === "9") return true;
  return false;
}

// GET /api/contatos → devolve a lista de contatos, do mais novo pro mais antigo.
export async function GET() {
  const { data, error } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa, anotacoes, criado_em")
    .order("id", { ascending: false });

  if (error) {
    console.error("GET /api/contatos:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar os contatos." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

// POST /api/contatos → valida e cria um contato novo.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const nome = (corpo.nome || "").trim();
  const email = (corpo.email || "").trim();
  const telefone = (corpo.telefone || "").trim();

  // Mesmas regras do formulário, agora garantidas no servidor.
  if (!nome) {
    return NextResponse.json({ mensagem: "O nome é obrigatório." }, { status: 400 });
  }
  if (email && !emailValido(email)) {
    return NextResponse.json({ mensagem: "Email inválido." }, { status: 400 });
  }
  if (telefone && !telefoneValido(telefone)) {
    return NextResponse.json({ mensagem: "Telefone inválido." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contatos")
    .insert({ nome, email: email || null, telefone: telefone || null })
    .select("id, nome, email, telefone, etapa, anotacoes, criado_em")
    .single();

  if (error) {
    console.error("POST /api/contatos:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível salvar o contato." },
      { status: 500 }
    );
  }
  return NextResponse.json(data, { status: 201 });
}
