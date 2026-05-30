// src/app/auth/callback/route.js
import { NextResponse } from "next/headers";
import { createServerSupabaseClient } from "@/utils/supabaseServer";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Se o 'next' não estiver definido, jogamos o usuário para o dashboard por padrão
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redireciona dinamicamente usando a origem da requisição da Vercel
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se der erro, redireciona para a página de login com um aviso
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}