// src/app/layout.js
// ─────────────────────────────────────────────────────────────
// Layout raiz do PAC — envolve todas as páginas.
// Configura fontes, metadados e tema global.
// ─────────────────────────────────────────────────────────────
import "./globals.css";

export const metadata = {
  title: {
    default: "PAC — Program and Code",
    template: "%s | PAC",
  },
  description:
    "Plataforma escolar de programação competitiva. Resolva problemas, suba no ranking e conquiste badges.",
  keywords: ["programação", "online judge", "competição", "algoritmos", "escola"],
  authors: [{ name: "PAC Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PAC — Program and Code",
    description: "Plataforma escolar de programação competitiva.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-surface text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
