import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-10 py-16">
      <h1 className="text-5xl font-bold mb-6">Dashboard</h1>
      <p className="text-xl text-gray-400 mb-12">
        Welcome, {user.email}. This is your protected workspace.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-3">Reports</h2>
          <p className="text-gray-400">
            View and manage uploaded or generated reports.
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-3">Assets</h2>
          <p className="text-gray-400">
            Store and organize client-facing assets.
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-3">Account</h2>
          <p className="text-gray-400">
            Manage account settings and access.
          </p>
        </div>
      </div>
    </main>
  );
}