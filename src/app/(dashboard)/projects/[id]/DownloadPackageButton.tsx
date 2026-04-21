"use client";

import { useState } from "react";

export default function DownloadPackageButton({ projectId }: { projectId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function download() {
    setState("loading");
    try {
      const res = await fetch(`/api/projects/${projectId}/download-package`);
      if (!res.ok) {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "Buildwell_Package.zip";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={download}
      disabled={state === "loading"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
        state === "error"
          ? "bg-rose-100 text-rose-700"
          : state === "loading"
          ? "bg-stone-200 text-stone-500 cursor-wait"
          : "bg-stone-900 hover:bg-stone-700 text-white"
      }`}
    >
      {state === "loading" ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Building package…
        </>
      ) : state === "error" ? (
        "Error — try again"
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/>
          </svg>
          Download Architect Package (.zip)
        </>
      )}
    </button>
  );
}
