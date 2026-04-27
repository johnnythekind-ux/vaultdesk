import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function NewWorkspacePage() {
  async function createWorkspace(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      redirect("/login");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || name.trim().length === 0) {
      throw new Error("Workspace name is required.");
    }

    const { error } = await supabase.from("workspaces").insert({
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/workspaces");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Create Workspace</h1>

      <p style={{ marginTop: "0.5rem", color: "#666" }}>
        Create a secure workspace connected to your account.
      </p>

      <form
        action={createWorkspace}
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
            placeholder="Example: Investor Files"
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
            placeholder="Optional description"
            rows={5}
            style={{
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "0.85rem 1rem",
            border: "none",
            borderRadius: "8px",
            background: "black",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Workspace
        </button>

        <a
  href="/workspaces"
  style={{
    marginTop: "0.5rem",
    textAlign: "center",
    color: "#aaa",
    textDecoration: "underline",
  }}
>
  Cancel
</a>

      </form>
    </main>
  );
}