"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <h1 className="text-2xl font-black text-stone-900 mt-4 mb-2">Forgot your password?</h1>
          <p className="text-stone-500 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          {status === "sent" ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-lg font-black text-stone-900 mb-2">Check your email</h2>
              <p className="text-stone-500 text-sm mb-6">
                If an account exists for <strong>{email}</strong>, you&apos;ll receive a reset link shortly.
                The link expires in 1 hour.
              </p>
              <Link href="/login">
                <button className="text-amber-600 font-semibold text-sm hover:underline">
                  Back to sign in
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {status === "error" && (
                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>

              <p className="text-center text-sm text-stone-500">
                Remember your password?{" "}
                <Link href="/login" className="text-amber-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
