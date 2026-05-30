// src/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#111827', 
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <h1>PAC Online Judge</h1>
      <p style={{ color: '#9ca3af' }}>Bem-vindo ao sistema de correção automática.</p>
      <Link href="/auth/login" style={{
        marginTop: '20px',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>
        Acessar Login
      </Link>
    </main>
  );
}