import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";

export default async function EditWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    .select("id, name, description")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !workspace) {
    notFound();
  }

  async function updateWorkspace(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user: currentUser },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !currentUser) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Workspace name is required.");
  }

  const { error } = await supabase
    .from("workspaces")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", currentUser.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/workspaces/${id}?success=updated`);
}

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <Link
        href={`/workspaces/${id}`}
        style={{ color: "#aaa", textDecoration: "underline" }}
      >
        ← Cancel
      </Link>

      <h1 style={{ marginTop: "2rem" }}>Edit Workspace</h1>

      <form
        action={updateWorkspace}
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          Workspace Name
          <input
            name="name"
            type="text"
            defaultValue={workspace.name}
            required
            style={{
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          Description
          <textarea
            name="description"
            defaultValue={workspace.description || ""}
            rows={5}
            style={{
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </label>

        <SubmitButton
  idleText="Save Changes"
  pendingText="Saving..."
/>
      </form>
    </main>
  );
}