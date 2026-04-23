"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
return;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border border-gray-700 p-6 rounded-lg w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}