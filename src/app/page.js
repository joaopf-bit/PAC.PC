// src/app/page.js
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <Code size={40} />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">PAC Online Judge</h1>
        <p className="text-gray-400 text-lg">
          Bem-vindo ao sistema de correção automática de exercícios de programação.
        </p>
        <div className="pt-4">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            Acessar a Plataforma
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}