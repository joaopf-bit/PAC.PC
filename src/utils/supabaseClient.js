// src/utils/supabaseClient.js
// ─────────────────────────────────────────────────────────────
// Cliente Supabase para uso em Client Components (navegador).
// Usa @supabase/ssr para gerenciar cookies corretamente no Next.js 14.
// ─────────────────────────────────────────────────────────────
import { createBrowserClient } from "@supabase/ssr";

/**
 * Cria e retorna um cliente Supabase para o lado do cliente (browser).
 * Use este cliente em componentes com "use client".
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Instância singleton para uso direto nos componentes
const supabase = createClient();

export default supabase;
