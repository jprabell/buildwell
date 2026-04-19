"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) setStatus("error"), setErrorMsg("Missing reset token. Please request a new link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-lg font-black text-stone-900 mb-2">Password updated!</h2>
        <p className="text-stone-500 text-sm">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Confirm new password</label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {(status === "error" || errorMsg) && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !token}
        className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {status === "loading" ? "Updating…" : "Set new password"}
      </button>

      <p className="text-center text-sm text-stone-500">
        <Link href="/forgot-password" className="text-amber-600 font-semibold hover:underline">
          Request a new link
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <h1 className="text-2xl font-black text-stone-900 mt-4 mb-2">Set a new password</h1>
          <p className="text-stone-500 text-sm">Choose a strong password for your account.</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <Suspense fallback={<p className="text-stone-400 text-sm text-center">Loading…</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
