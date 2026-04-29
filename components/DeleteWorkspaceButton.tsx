"use client";

export default function DeleteWorkspaceButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(
  "This will permanently delete the workspace. This action cannot be undone.\n\nAre you sure?"
);

        if (!confirmed) {
          e.preventDefault();
        }
      }}
      style={{
        marginTop: "1rem",
        padding: "0.75rem 1rem",
        border: "1px solid red",
        background: "transparent",
        color: "red",
        cursor: "pointer",
        borderRadius: "8px",
      }}
    >
      Delete Workspace
    </button>
  );
}