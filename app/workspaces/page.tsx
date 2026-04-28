import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WorkspacesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("id, name, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Link
  href="/dashboard"
  style={{
    color: "#aaa",
    textDecoration: "underline",
    display: "inline-block",
    marginBottom: "1.5rem",
  }}
>
  ← Back to Dashboard
</Link>
        <div>
          <h1>My Workspaces</h1>
          <p style={{ marginTop: "0.5rem", color: "#666" }}>
            Manage your secure VaultDesk workspaces.
          </p>
        </div>

        <Link
          href="/workspaces/new"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: "black",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Create Workspace
        </Link>
      </div>

      <section style={{ marginTop: "2rem" }}>
        {!workspaces || workspaces.length === 0 ? (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h2>No workspaces yet</h2>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              Create your first workspace to start organizing your records.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {workspaces.map((workspace) => (
              <Link
  key={workspace.id}
  href={`/workspaces/${workspace.id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <article
  style={{
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1.25rem",
    cursor: "pointer",
    transition: "border-color 0.2s ease, transform 0.2s ease",
  }}
>
    <h2 style={{ marginBottom: "0.5rem" }}>
      {workspace.name}
    </h2>

    <p style={{ color: "#666" }}>
      {workspace.description || "No description provided."}
    </p>

    <p
      style={{
        marginTop: "1rem",
        fontSize: "0.875rem",
        color: "#888",
      }}
    >
      Created:{" "}
      {new Date(workspace.created_at).toLocaleDateString()}
    </p>
  </article>
</Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}