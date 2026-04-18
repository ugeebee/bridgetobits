"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the environment variable for the API endpoint
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Maintaining consistency for cross-origin requests
      });

      if (res.ok) {
        router.push("/login?message=Account created! Please log in.");
      } else {
        const data = await res.text();
        setError(data || "Failed to create account");
      }
    } catch (err) {
      setError("Server unreachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#111", color: "#fff" }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: "#181818", border: "1.5px solid #333" }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "#fac203" }}>Create Account</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-[#fac203]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-[#fac203]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold transition-opacity hover:opacity-90 disabled:opacity-50 mt-4"
            style={{ background: "#FFD600", color: "#111" }}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-70">
          Already have an account? <Link href="/login" className="text-[#fac203] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}