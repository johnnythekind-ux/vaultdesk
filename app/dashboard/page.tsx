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

  const { data: workspaces } = await supabase
  .from("workspaces")
  .select("id")
  .eq("user_id", user.id);

  return (
    <main className="min-h-screen px-10 py-16">
      <h1 className="text-5xl font-bold mb-6">Dashboard</h1>
      <p className="text-xl text-gray-400 mb-12">
        Welcome, {user.email}. This is your protected workspace.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
  <div className="border border-gray-800 rounded-2xl p-6">
    <h2 className="text-2xl font-semibold mb-3">Workspaces</h2>
    <p className="text-gray-400 mb-4">Total workspaces</p>
    <p className="text-4xl font-bold">
      {workspaces?.length || 0}
    </p>
  </div>

  <a
    href="/workspaces/new"
    className="border border-gray-800 rounded-2xl p-6 block hover:border-gray-500"
  >
    <h2 className="text-2xl font-semibold mb-3">Create Workspace</h2>
    <p className="text-gray-400">
      Start a new secure workspace.
    </p>
  </a>

  <a
    href="/workspaces"
    className="border border-gray-800 rounded-2xl p-6 block hover:border-gray-500"
  >
    <h2 className="text-2xl font-semibold mb-3">View Workspaces</h2>
    <p className="text-gray-400">
      Manage your existing workspaces.
    </p>
  </a>
</div>
    </main>
  );
}