import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteWorkspaceButton from "@/components/DeleteWorkspaceButton";

export default async function WorkspaceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("id, name, description, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !workspace) {
    notFound();
  }

  async function deleteWorkspace() {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/workspaces?success=deleted");
}

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        {success === "updated" && (
  <p style={{ color: "limegreen", marginBottom: "1rem" }}>
    Workspace updated successfully.
  </p>
)}
      <Link href="/workspaces" style={{ color: "#aaa", textDecoration: "underline" }}>
        ← Back to Workspaces
      </Link>

      <section
        style={{
          marginTop: "2rem",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >
        <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
  Workspace
</p>
        <h1 style={{ marginTop: "0.5rem" }}>{workspace.name}</h1>

        <p style={{ marginTop: "1rem", color: "#aaa" }}>
          {workspace.description || "No description provided."}
        </p>

        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#888" }}>
          Created: {new Date(workspace.created_at).toLocaleString()}
        </p>

        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#666" }}>
  Last updated: {new Date(workspace.updated_at || workspace.created_at).toLocaleString()}
</p>

        <Link
  href={`/workspaces/${id}/edit`}
  style={{
    display: "inline-block",
    marginTop: "1.5rem",
    color: "#aaa",
    textDecoration: "underline",
  }}
>
  Edit Workspace
</Link>

<form action={deleteWorkspace}>
  <DeleteWorkspaceButton />
</form>

      </section>
    </main>
  );
}