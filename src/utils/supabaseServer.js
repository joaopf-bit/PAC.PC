// src/utils/supabaseServer.js
// ─────────────────────────────────────────────────────────────
// Cliente Supabase para uso em Server Components e Route Handlers.
// Lê e escreve cookies via next/headers (Next.js 14 App Router).
// ─────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria um cliente Supabase para Server Components.
 * Chame dentro de funções async (Server Components, Route Handlers, Server Actions).
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // set() é ignorado em Server Components (só funciona em Route Handlers/Actions)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // idem
          }
        },
      },
    }
  );
}

/**
 * Cliente com service_role — NUNCA exponha no frontend.
 * Use apenas em Route Handlers que precisam bypassar RLS.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createAdminSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
