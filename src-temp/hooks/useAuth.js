"use client";

// src/hooks/useAuth.js
// ─────────────────────────────────────────────────────────────
// Hook React para acessar o usuário e perfil autenticados.
// Use em qualquer Client Component para obter dados do usuário logado.
//
// Exemplo de uso:
//   const { user, profile, loading, signOut } = useAuth();
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";

export function useAuth() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuta mudanças de sessão (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, role, score, level, xp, problems_solved")
        .eq("id", userId)
        .single();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin:   profile?.role === "admin",
    isTeacher: profile?.role === "teacher",
    isStudent: profile?.role === "student",
  };
}
