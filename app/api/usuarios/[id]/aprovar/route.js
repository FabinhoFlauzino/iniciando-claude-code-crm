import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/usuarios/[id]/aprovar → aprova um usuário pendente.
// Só admin chega aqui (o porteiro garante).
export async function POST(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("usuarios")
    .update({ status: "aprovado" })
    .eq("id", id)
    .select("id, usuario, role, status, criado_em")
    .single();

  if (error) {
    console.error("POST /api/usuarios/[id]/aprovar:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível aprovar o usuário." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
