"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-400 text-xl mb-12">
          Welcome, {userEmail}. This is your protected workspace.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Reports</h2>
            <p className="text-gray-400">
              View and manage uploaded or generated reports.
            </p>
          </div>

          <div className="border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Assets</h2>
            <p className="text-gray-400">
              Store and organize client-facing assets.
            </p>
          </div>

          <div className="border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <p className="text-gray-400">
              Manage account settings and access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}