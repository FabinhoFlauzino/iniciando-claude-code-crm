import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// GET /api/contatos/[id] → dados de um contato.
export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa, criado_em")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("GET /api/contatos/[id]:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar o contato." },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { mensagem: "Contato não encontrado." },
      { status: 404 }
    );
  }
  return NextResponse.json(data);
}

// PATCH /api/contatos/[id] → muda a etapa do contato no funil.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const corpo = await request.json().catch(() => ({}));
  const etapa = (corpo.etapa || "").trim();

  if (!ETAPAS.includes(etapa)) {
    return NextResponse.json({ mensagem: "Etapa inválida." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contatos")
    .update({ etapa })
    .eq("id", id)
    .select("id, nome, email, telefone, etapa, criado_em")
    .single();

  if (error) {
    console.error("PATCH /api/contatos/[id]:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível mudar a etapa." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
