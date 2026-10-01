import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/usuarios → lista os usuários (só admin chega aqui; o porteiro garante).
export async function GET() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, usuario, role, status, criado_em")
    .order("id", { ascending: false });

  if (error) {
    console.error("GET /api/usuarios:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar os usuários." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
