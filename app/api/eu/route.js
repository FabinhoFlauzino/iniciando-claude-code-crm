import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lerSessao } from "@/lib/sessao";

// GET /api/eu → diz quem está logado e qual o papel (usado pela navbar).
export async function GET() {
  const cookieStore = await cookies();
  const sessao = await lerSessao(cookieStore.get("sessao")?.value);

  if (!sessao) {
    return NextResponse.json({ mensagem: "Não autenticado." }, { status: 401 });
  }
  return NextResponse.json({ usuario: sessao.usuario, role: sessao.role });
}
