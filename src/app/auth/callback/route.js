// src/app/auth/callback/route.js
// ─────────────────────────────────────────────────────────────
// Route Handler do Next.js para o callback de autenticação do Supabase.
// Supabase redireciona aqui após:
//   - Confirmação de e-mail (signUp)
//   - Login com link mágico (se habilitado)
//   - OAuth (Google, GitHub, etc.)
//
// Fluxo:
//   1. Troca o `code` da URL por uma sessão válida
//   2. Busca a role do perfil
//   3. Redireciona para /dashboard (aluno) ou /admin (professor/admin)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabaseServer";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard"; // fallback

  if (code) {
    const supabase = createServerSupabaseClient();

    // Troca o code por uma sessão (PKCE flow)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Busca a role do perfil para redirecionar corretamente
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      const role = profile?.role ?? "student";
      const redirectTo = (role === "admin" || role === "teacher") ? "/admin" : "/dashboard";

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Fallback: redireciona para login com mensagem de erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
