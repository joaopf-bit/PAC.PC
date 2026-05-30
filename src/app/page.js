// src/app/page.js
// ─────────────────────────────────────────────────────────────
// Página inicial (Landing Page) do PAC.
// Server Component — sem "use client".
// ─────────────────────────────────────────────────────────────
import Link from "next/link";
import { Code2, Trophy, Zap, Users, ArrowRight, Star } from "lucide-react";

// ── Sub-componentes inline ────────────────────────────────────

function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-8 py-4 card-pac">
      <span className="text-3xl font-bold text-brand-400">{value}</span>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="card-pac p-6 flex flex-col gap-3 hover:border-brand-500/50 transition-colors duration-300">
      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const styles = {
    Fácil:    "badge-easy",
    Médio:    "badge-medium",
    Difícil:  "badge-hard",
    Expert:   "badge-expert",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[level]}`}>
      {level}
    </span>
  );
}

const SAMPLE_PROBLEMS = [
  { id: 1, title: "Soma de Dois Números",       difficulty: "Fácil",   solved: 1842, category: "Iniciante" },
  { id: 2, title: "Maior Elemento do Vetor",    difficulty: "Fácil",   solved: 1203, category: "Vetores" },
  { id: 3, title: "Caminho Mínimo em Grafo",    difficulty: "Médio",   solved: 482,  category: "Grafos" },
  { id: 4, title: "Subsequência Crescente Max", difficulty: "Difícil", solved: 187,  category: "DP" },
];

// ── Página principal ──────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface bg-grid">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Code2 size={18} className="text-white" />
            </div>
            <span>PAC</span>
            <span className="text-slate-500 font-normal text-sm hidden sm:block">Program and Code</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/problems"
              className="hidden sm:block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Problemas
            </Link>
            <Link
              href="/ranking"
              className="hidden sm:block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-medium mb-6">
          <Star size={12} />
          Plataforma escolar de programação competitiva
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Aprenda programação{" "}
          <span className="text-brand-400">resolvendo</span>{" "}
          desafios reais
        </h1>

        <p className="max-w-xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
          Submeta seu código, receba feedback instantâneo, suba no ranking e
          desbloqueie conquistas. Do iniciante ao avançado.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-brand-500/20 animate-pulse-brand"
          >
            Começar agora
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/problems"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-surface-border hover:border-brand-500/50 text-slate-300 hover:text-white font-medium transition-all duration-200"
          >
            Ver problemas
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-4">
          <StatCard value="200+"  label="Problemas" />
          <StatCard value="1.2k+" label="Alunos" />
          <StatCard value="15k+"  label="Submissões" />
          <StatCard value="98%"   label="Uptime" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Por que usar o PAC?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={Zap}
            title="Julgamento instantâneo"
            description="Código avaliado em segundos com feedback detalhado: Accepted, Wrong Answer, TLE e mais."
          />
          <FeatureCard
            icon={Trophy}
            title="Gamificação"
            description="Sistema de XP, níveis, badges e ranking para motivar o aprendizado contínuo."
          />
          <FeatureCard
            icon={Users}
            title="Competições"
            description="Contests cronometrados para turmas, com placar ao vivo e modo ICPC."
          />
          <FeatureCard
            icon={Code2}
            title="Multi-linguagem"
            description="Suporte a Python, C++, Java, JavaScript, Go, Rust e mais — escolha a sua."
          />
        </div>
      </section>

      {/* ── Sample Problems ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Problemas em destaque</h2>
          <Link href="/problems" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card-pac overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">#</th>
                <th className="px-6 py-3 text-left font-medium">Título</th>
                <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">Categoria</th>
                <th className="px-6 py-3 text-left font-medium">Dificuldade</th>
                <th className="px-6 py-3 text-right font-medium hidden md:table-cell">Resolvidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {SAMPLE_PROBLEMS.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-surface-hover transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-slate-500">{p.id}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/problems/${p.id}`}
                      className="text-slate-200 hover:text-brand-400 font-medium transition-colors"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-400 hidden sm:table-cell">{p.category}</td>
                  <td className="px-6 py-4">
                    <DifficultyBadge level={p.difficulty} />
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 hidden md:table-cell">
                    {p.solved.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-brand-400" />
            <span>PAC — Program and Code</span>
          </div>
          <span>Construído com Next.js · Supabase · Judge0</span>
        </div>
      </footer>

    </main>
  );
}
