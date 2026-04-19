"use client";

import { useState } from "react";

export default function FloorPlanDownloadButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/floor-plan`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "floor_plan.dxf";
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Floor plan download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="animate-spin text-xs">⏳</span> Generating…
        </>
      ) : (
        <>⬇ Floor Plan (.dxf)</>
      )}
    </button>
  );
}
