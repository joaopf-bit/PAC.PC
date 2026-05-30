// src/app/(auth)/layout.js
// Layout compartilhado para as rotas de autenticação.
// Aplica as fontes do design system do PAC (Hanken Grotesk + Inter).

import { Code2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Acesso | PAC",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col font-inter">
      {/* Cabeçalho mínimo */}
      <header className="px-8 py-5 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#003ec7] p-1.5 rounded-lg">
            <Code2 size={18} className="text-white" />
          </div>
          <span
            className="font-bold text-lg text-[#003ec7] tracking-tight"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            PAC
          </span>
        </Link>
      </header>

      {/* Conteúdo central */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Rodapé mínimo */}
      <footer className="text-center py-5 text-xs text-[#737688]">
        © {new Date().getFullYear()} PAC — Program and Code
      </footer>
    </div>
  );
}
