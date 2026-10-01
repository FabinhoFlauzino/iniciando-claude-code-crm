import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH /api/anotacoes/[id] → edita o texto de uma anotação.
export async function PATCH(request, { params }) {
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
    .update({ texto })
    .eq("id", id)
    .select("id, contato_id, texto, criado_em")
    .single();

  if (error) {
    console.error("PATCH /api/anotacoes/[id]:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível salvar a anotação." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

// DELETE /api/anotacoes/[id] → exclui uma anotação.
export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    console.error("DELETE /api/anotacoes/[id]:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível excluir a anotação." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
