"use client";

// src/app/(auth)/register/page.js
// Tela de Cadastro do PAC.
// Regra de negócio: novos usuários são salvos como 'student' por padrão.
// O trigger `handle_new_user` no Supabase cria o registro em `profiles`
// automaticamente. Aqui passamos username e full_name via user_metadata.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from '../../../utils/supabaseClient';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Regras de força de senha
const PASSWORD_RULES = [
  { label: "Mínimo 8 caracteres",          test: (p) => p.length >= 8 },
  { label: "Pelo menos uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Pelo menos um número",          test: (p) => /\d/.test(p) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-[#ba1a1a]", "bg-[#f59e0b]", "bg-[#22c55e]"];
  const labels = ["Fraca", "Média", "Forte"];

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de força */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? colors[passed - 1] : "bg-[#c3c5d9]"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${passed === 3 ? "text-[#22c55e]" : passed === 2 ? "text-[#f59e0b]" : "text-[#ba1a1a]"}`}>
        Senha {labels[passed - 1] ?? "muito fraca"}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const passwordOk = PASSWORD_RULES.every((r) => r.test(password));

  // ── Lógica de cadastro ───────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!passwordOk) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }
    if (!agree) {
      setError("Você precisa aceitar os Termos de Uso para continuar.");
      return;
    }

    setLoading(true);

    try {
      // Supabase signUp — o trigger `handle_new_user` criará o profile
      // automaticamente com role = 'student' (valor padrão da coluna).
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            // Esses campos são lidos pelo trigger handle_new_user
            full_name: fullName.trim(),
            username:  username.trim().toLowerCase(),
          },
        },
      });

      if (authError) {
        setError(translateError(authError.message));
        return;
      }

      // Se o Supabase precisar de confirmação de e-mail, mostramos mensagem.
      // Caso o e-mail já esteja confirmado (link mágico desabilitado), redireciona.
      if (data.session) {
        // Sessão criada imediatamente → redireciona para /dashboard
        router.push("/dashboard");
      } else {
        // Confirmação de e-mail necessária
        setSuccess(true);
      }

    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function translateError(msg) {
    if (msg.includes("User already registered")) return "Este e-mail já está cadastrado.";
    if (msg.includes("Password should be"))      return "A senha deve ter pelo menos 6 caracteres.";
    if (msg.includes("Invalid email"))           return "E-mail inválido.";
    if (msg.includes("Too many requests"))       return "Muitas tentativas. Aguarde alguns minutos.";
    return "Erro ao criar conta. Tente novamente.";
  }

  // ── Estado de sucesso (aguardando confirmação de e-mail) ─────
  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#c3c5d9] shadow-[0_2px_16px_rgba(19,27,46,0.06)] p-10 text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#eaedff] flex items-center justify-center">
            <CheckCircle2 size={32} className="text-[#003ec7]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#131b2e] mb-2"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Conta criada!
          </h2>
          <p className="text-sm text-[#434656] mb-6">
            Enviamos um link de confirmação para{" "}
            <strong className="text-[#131b2e]">{email}</strong>.
            Verifique sua caixa de entrada (e o spam) para ativar sua conta.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-[#003ec7] hover:bg-[#0033a8] text-white font-bold text-sm py-3 rounded-lg transition-all duration-150 active:scale-[0.98]"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  // ── Formulário de cadastro ───────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-[#c3c5d9] shadow-[0_2px_16px_rgba(19,27,46,0.06)] p-8">

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-bold text-[#131b2e] leading-tight tracking-tight mb-1"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Crie sua conta
          </h1>
          <p className="text-sm text-[#434656]">
            Junte-se a milhares de estudantes no PAC.
          </p>
        </div>

        {/* Badge de role padrão */}
        <div className="mb-6 flex items-center gap-2 bg-[#eaedff] border border-[#003ec7]/20 rounded-lg px-4 py-2.5">
          <span className="text-lg">🎓</span>
          <p className="text-xs text-[#434656]">
            Sua conta será criada como{" "}
            <strong className="text-[#003ec7]">Aluno</strong>. Para acesso de professor,
            solicite ao administrador da plataforma.
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 bg-[#ffdad6] border border-[#93000a]/20 text-[#93000a] rounded-lg px-4 py-3 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleRegister} className="space-y-4" noValidate>

          {/* Nome completo */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-sm font-semibold text-[#131b2e]">
              Nome completo
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-[#c3c5d9] bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#737688] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7] disabled:opacity-50"
            />
          </div>

          {/* Nome de usuário */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-semibold text-[#131b2e]">
              Nome de usuário
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#737688] font-mono select-none">
                @
              </span>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                placeholder="seu_usuario"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())
                }
                disabled={loading}
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-[#c3c5d9] bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#737688] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7] disabled:opacity-50 font-mono"
              />
            </div>
            <p className="text-xs text-[#737688]">
              Apenas letras minúsculas, números e underscore.
            </p>
          </div>

          {/* E-mail */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-[#131b2e]">
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
              className="w-full px-4 py-3 rounded-lg border border-[#c3c5d9] bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#737688] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7] disabled:opacity-50"
            />
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="block text-sm font-semibold text-[#131b2e]">
              Senha
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 pr-11 rounded-lg border border-[#c3c5d9] bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#737688] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#003ec7]/25 focus:border-[#003ec7] disabled:opacity-50"
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

            {/* Requisitos de senha */}
            {password && (
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <CheckCircle2
                      size={13}
                      className={rule.test(password) ? "text-[#22c55e]" : "text-[#c3c5d9]"}
                    />
                    <span
                      className={`text-xs ${
                        rule.test(password) ? "text-[#434656]" : "text-[#737688]"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aceite dos termos */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              disabled={loading}
              className="mt-0.5 w-4 h-4 rounded border-[#c3c5d9] text-[#003ec7] focus:ring-[#003ec7]/25 cursor-pointer"
            />
            <span className="text-xs text-[#434656] leading-relaxed">
              Li e concordo com os{" "}
              <Link href="/terms" className="text-[#003ec7] font-semibold hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacy" className="text-[#003ec7] font-semibold hover:underline">
                Política de Privacidade
              </Link>{" "}
              do PAC.
            </span>
          </label>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading || !fullName || !username || !email || !passwordOk || !agree}
            className="
              w-full flex items-center justify-center gap-2
              bg-[#003ec7] hover:bg-[#0033a8]
              text-white font-bold text-sm
              py-3 rounded-lg
              transition-all duration-150
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[0_1px_4px_rgba(0,62,199,0.3)]
              mt-2
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta grátis"
            )}
          </button>
        </form>

        {/* Link para login */}
        <p className="mt-6 text-center text-sm text-[#434656]">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[#003ec7] font-bold hover:underline">
            Entrar agora
          </Link>
        </p>
      </div>

      <p className="mt-5 text-center text-xs text-[#737688]">
        Seus dados são protegidos com criptografia de ponta a ponta.
      </p>
    </div>
  );
}
