import { createClient } from "@supabase/supabase-js";

// Lê os segredos do arquivo .env.local (nunca ficam no código).
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Faltam SUPABASE_URL ou SUPABASE_SECRET_KEY. Preencha o arquivo .env.local."
  );
}

// Cliente do Supabase para uso APENAS no servidor (usa a chave secreta).
export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
