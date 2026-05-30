"use client";

// src/app/(auth)/login/page.js
// Tela de Login do PAC.
// Design fiel ao sistema de design do Stitch:
//   - Paleta Material You (primary #003ec7, surface #faf8ff)
//   - Tipografia: Hanken Grotesk (títulos) + Inter (corpo)
//   - Cantos suaves, sombras sutis, inputs com foco azul

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from '../../utils/supabaseClient';
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ── Lógica de login ──────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Autentica com Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(translateError(authError.message));
        return;
      }

      // 2. Busca o perfil para saber a role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setError("Perfil não encontrado. Entre em contato com o suporte.");
        await supabase.auth.signOut();
        return;
      }

      // 3. Redireciona conforme a role
      if (profile.role === "admin" || profile.role === "teacher") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Traduz as mensagens de erro do Supabase para PT-BR
  function translateError(msg) {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed"))       return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("Too many requests"))         return "Muitas tentativas. Aguarde alguns minutos.";
    return "Erro ao entrar. Verifique seus dados.";
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">

      {/* Card principal */}
      <div
        className="bg-white rounded-2xl border border-[#c3c5d9] shadow-[0_2px_16px_rgba(19,27,46,0.06)] p-8"
      >
        {/* Cabeçalho do card */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-bold text-[#131b2e] leading-tight tracking-tight mb-1"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Boas-vindas de volta!
          </h1>
          <p className="text-sm text-[#434656]">
            Acesse sua conta para continuar praticando.
          </p>
        </div>

        {/* Alerta de erro */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 bg-[#ffdad6] border border-[#93000a]/20 text-[#93000a] rounded-lg px-4 py-3 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5" noValidate>

          {/* Campo e-mail */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#131b2e]"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="
                w-full px-4 py-3 rounded-lg
                border border-[#c3c5d9]
                bg-[#f2f3ff]
                text-sm text-[#131b2e]
                placeholder:text-[#737688]
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Campo senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#131b2e]"
              >
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#003ec7] hover:underline font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="
                  w-full px-4 py-3 pr-11 rounded-lg
                  border border-[#c3c5d9]
                  bg-[#f2f3ff]
                  text-sm text-[#131b2e]
                  placeholder:text-[#737688]
                  transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7]
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737688] hover:text-[#003ec7] transition-colors"
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="
              w-full flex items-center justify-center gap-2
              bg-[#003ec7] hover:bg-[#0033a8]
              text-white font-bold text-sm
              py-3 rounded-lg
              transition-all duration-150
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[0_1px_4px_rgba(0,62,199,0.3)]
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar na plataforma"
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#c3c5d9]" />
          <span className="text-xs text-[#737688]">ou</span>
          <div className="flex-1 h-px bg-[#c3c5d9]" />
        </div>

        {/* Link para cadastro */}
        <p className="text-center text-sm text-[#434656]">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-[#003ec7] font-bold hover:underline"
          >
            Criar conta grátis
          </Link>
        </p>
      </div>

      {/* Nota de segurança */}
      <p className="mt-5 text-center text-xs text-[#737688]">
        Seus dados são protegidos com criptografia de ponta a ponta.
      </p>
    </div>
  );
}
