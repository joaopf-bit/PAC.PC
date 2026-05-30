// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'PAC Online Judge',
  description: 'Sistema de correção automática de exercícios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}