// src/utils/supabaseServer.js
import { createServerClient } from "@supabase/ssr";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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
            // Ignorado em Server Components tradicionais
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Ignorado em Server Components tradicionais
          }
        },
      },
    }
  );
}

// Removido o 'require()' dinâmico para garantir compatibilidade com o build da Vercel
export function createAdminSupabaseClient() {
  return createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}