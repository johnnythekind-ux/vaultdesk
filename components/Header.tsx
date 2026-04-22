"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";

export default function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <header className="p-6 border-b border-gray-800 flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        <Link href="/">VaultDesk</Link>
      </h1>

      {!loading && (
        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <Link href="/dashboard" className="text-sm">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm border border-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                Login
              </Link>
              <Link
                href="/request-access"
                className="text-sm border border-white px-4 py-2 rounded"
              >
                Request Access
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}