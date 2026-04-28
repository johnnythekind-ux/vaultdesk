"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

export default function SubmitButton({
  idleText,
  pendingText,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "0.85rem 1rem",
        border: "none",
        borderRadius: "8px",
        background: pending ? "#555" : "black",
        color: "white",
        cursor: pending ? "not-allowed" : "pointer",
        fontWeight: "bold",
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? pendingText : idleText}
    </button>
  );
}