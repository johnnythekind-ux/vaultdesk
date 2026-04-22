"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function RequestAccessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
  emailRedirectTo: "http://localhost:3001/auth/callback",
  data: {
    name,
    company,
  },
},
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. You can now log in.");
window.location.href = "/dashboard";
return;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border border-gray-700 p-6 rounded-lg w-80">
        <h1 className="text-xl font-bold mb-4">Request Access</h1>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-600 rounded bg-black text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-600 rounded bg-black text-white"
          />

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-600 rounded bg-black text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-600 rounded bg-black text-white"
          />

          <button className="w-full bg-white text-black p-2 rounded">
            Submit
          </button>
        </form>

        {message && (
  <div className="mt-4">
    <p className="text-sm">{message}</p>

    {message === "Account created. You can now log in." && (
      <button
        onClick={() => (window.location.href = "/login")}
        className="mt-3 w-full border border-gray-600 rounded p-2 text-white"
      >
        Go to Login
      </button>
    )}
  </div>
)}
      </div>
    </div>
  );
}