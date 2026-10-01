import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

// GET /api/contatos/[id]/followup → lista os follow-ups salvos, mais novos primeiro.
export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("followups")
    .select("id, texto, criado_em")
    .eq("contato_id", id)
    .order("id", { ascending: false });

  if (error) {
    console.error("GET /api/contatos/[id]/followup:", error);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar os follow-ups." },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

// POST /api/contatos/[id]/followup → a IA escreve um follow-up, salva no banco e o devolve.
export async function POST(request, { params }) {
  const { id } = await params;

  const { data: contato, error: erroContato } = await supabase
    .from("contatos")
    .select("nome, etapa")
    .eq("id", id)
    .single();

  if (erroContato || !contato) {
    return NextResponse.json(
      { mensagem: "Contato não encontrado." },
      { status: 404 }
    );
  }

  const { data: anotacoes } = await supabase
    .from("anotacoes")
    .select("texto")
    .eq("contato_id", id)
    .order("id", { ascending: true });

  const historico =
    (anotacoes || []).map((a) => `- ${a.texto}`).join("\n") || "(sem anotações)";

  const instrucao =
    "Você escreve mensagens de follow-up para um CRM, em português do Brasil. " +
    "Tom profissional, caloroso e direto. Escreva UMA única mensagem curta (2 a 4 frases), " +
    "natural, pronta para enviar ao contato. Sem emojis. " +
    "Não invente fatos além do que for informado. " +
    "Responda apenas com a mensagem, sem introduções nem aspas.";

  const conteudo =
    `Contato: ${contato.nome}\n` +
    `Etapa do funil: ${contato.etapa}\n` +
    `Anotações (histórico):\n${historico}\n\n` +
    "Escreva o follow-up.";

  let texto;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const resposta = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: conteudo,
      config: { systemInstruction: instrucao, maxOutputTokens: 1024 },
    });
    texto = (resposta.text || "").trim();
  } catch (e) {
    console.error("Erro ao gerar follow-up:", e);
    return NextResponse.json(
      { mensagem: "Não foi possível gerar o follow-up agora." },
      { status: 500 }
    );
  }

  if (!texto) {
    return NextResponse.json(
      { mensagem: "Não foi possível gerar o follow-up agora." },
      { status: 500 }
    );
  }

  // Salva no banco para reler depois.
  const { data: salvo, error: erroSalvar } = await supabase
    .from("followups")
    .insert({ contato_id: id, texto })
    .select("id, texto, criado_em")
    .single();

  if (erroSalvar) {
    console.error("Salvar follow-up:", erroSalvar);
    return NextResponse.json(
      { mensagem: "Não foi possível salvar o follow-up." },
      { status: 500 }
    );
  }

  return NextResponse.json(salvo);
}
