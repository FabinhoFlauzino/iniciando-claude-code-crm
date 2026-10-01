import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/contatos/[id]/anotacoes → anotações de UM contato, mais novas primeiro.
export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("anotacoes")
    .select("id, contato_id, texto, criado_em")
    .eq("contato_id", id) // só as anotações deste contato
    .order("id", { ascending: false });

  if (error) {
    console.error("GET /api/contatos/[id]/anotacoes:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar as anotações." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

// POST /api/contatos/[id]/anotacoes → adiciona uma anotação ao contato.
export async function POST(request, { params }) {
  const { id } = await params;
  const corpo = await request.json().catch(() => ({}));
  const texto = (corpo.texto || "").trim();

  if (!texto) {
    return NextResponse.json(
      { mensagem: "A anotação não pode ficar vazia." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .insert({ contato_id: id, texto })
    .select("id, contato_id, texto, criado_em")
    .single();

  if (error) {
    console.error("POST /api/contatos/[id]/anotacoes:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível salvar a anotação." },
      { status: 500 }
    );
  }
  return NextResponse.json(data, { status: 201 });
}
