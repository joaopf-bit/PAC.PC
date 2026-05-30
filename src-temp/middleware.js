// src/middleware.js
// ─────────────────────────────────────────────────────────────
// Middleware do Next.js: protege rotas autenticadas e
// redireciona usuários já logados que tentam acessar /login ou /register.
// Executa no Edge Runtime (antes do servidor renderizar a página).
// ─────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rotas que qualquer usuário (logado ou não) pode acessar
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/auth/callback"];

// Prefixos de rotas que exigem autenticação
const PROTECTED_PREFIXES = ["/dashboard", "/problems", "/ranking", "/profile", "/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Cria resposta base para poder manipular cookies
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Cria cliente Supabase para o Edge
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Verifica a sessão atual
  const { data: { session } } = await supabase.auth.getSession();

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Usuário não logado tentando acessar rota protegida → /login
  if (!session && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário já logado tentando acessar /login ou /register → /dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Proteção extra: /admin só para admin e teacher
  if (session && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "teacher") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  // Aplica o middleware a todas as rotas exceto assets estáticos e _next
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
