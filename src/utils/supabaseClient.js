// src/utils/supabaseClient.js
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Inicializa de forma segura apenas quando estiver rodando no navegador (client-side)
let supabaseInstance;

if (typeof window !== "undefined") {
  supabaseInstance = createClient();
}

export default supabaseInstance;