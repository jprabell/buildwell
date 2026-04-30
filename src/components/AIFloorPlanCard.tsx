"use client";

import { useEffect, useRef, useState } from "react";

interface AIFloorPlanResult {
  imageUrl: string;
  summary?: string;
  detailedDescription?: string;
  generatedAt: string;
  prompt: string;
}

interface Props {
  projectId: string;
  /** Initial cached result already on the project, if any. */
  initial?: AIFloorPlanResult | null;
  /** Initial state — RUNNING means we should resume polling on mount. */
  initialStatus?: string | null;
  /** Children render the SVG fallback shown until AI plan is ready. */
  children: React.ReactNode;
}

type UIState =
  | { kind: "idle" }
  | { kind: "starting" }
  | { kind: "running"; secondsElapsed: number }
  | { kind: "ready"; result: AIFloorPlanResult }
  | { kind: "error"; message: string };

const POLL_MS = 5000;
const MAX_POLL_SECONDS = 240; // 4 min cap

export default function AIFloorPlanCard({ projectId, initial, initialStatus, children }: Props) {
  const [state, setState] = useState<UIState>(() => {
    if (initial) return { kind: "ready", result: initial };
    if (initialStatus === "RUNNING" || initialStatus === "PENDING") {
      return { kind: "running", secondsElapsed: 0 };
    }
    return { kind: "idle" };
  });

  const pollRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  function clearPoll() {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    startedAtRef.current = null;
  }

  async function pollOnce() {
    try {
      const res = await fetch(`/api/projects/${projectId}/ai-floor-plan`, { cache: "no-store" });
      const data = await res.json();
      const elapsed = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0;

      if (data.status === "SUCCEEDED" && data.result) {
        clearPoll();
        setState({ kind: "ready", result: data.result });
        return;
      }
      if (data.status === "FAILED" || data.status === "TIMED-OUT" || data.status === "ABORTED") {
        clearPoll();
        setState({ kind: "error", message: data.error || `Generation ${data.status?.toLowerCase()}` });
        return;
      }
      if (elapsed > MAX_POLL_SECONDS) {
        clearPoll();
        setState({ kind: "error", message: "Generation timed out after 4 minutes. Try again." });
        return;
      }
      setState({ kind: "running", secondsElapsed: elapsed });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown poll error";
      // Don't clear poll on a single network blip — let the next tick retry
      console.error("AI floor plan poll error:", msg);
    }
  }

  function startPolling() {
    clearPoll();
    startedAtRef.current = Date.now();
    pollOnce(); // immediate first check
    pollRef.current = window.setInterval(pollOnce, POLL_MS);
  }

  // Resume polling if we mount in a RUNNING state
  useEffect(() => {
    if (state.kind === "running" && pollRef.current === null) {
      startPolling();
    }
    return () => clearPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    setState({ kind: "starting" });
    try {
      const res = await fetch(`/api/projects/${projectId}/ai-floor-plan`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error", message: data.error || "Failed to start generation" });
        return;
      }
      setState({ kind: "running", secondsElapsed: 0 });
      startPolling();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setState({ kind: "error", message: msg });
    }
  }

  async function handleRegenerate() {
    // Clear cached result, then start fresh
    try {
      await fetch(`/api/projects/${projectId}/ai-floor-plan`, { method: "DELETE" });
    } catch {
      // best-effort
    }
    handleGenerate();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (state.kind === "ready") {
    return (
      <div>
        <div className="flex items-center justify-between mb-3 print:hidden">
          <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            AI-Generated Floor Plan
          </span>
          <button
            onClick={handleRegenerate}
            className="text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors"
          >
            Regenerate ↻
          </button>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.result.imageUrl}
            alt="AI-generated floor plan"
            className="w-full h-auto"
          />
        </div>
        {state.result.summary && (
          <p className="text-xs text-stone-500 mt-2 italic print:hidden">
            {state.result.summary}
          </p>
        )}
      </div>
    );
  }

  if (state.kind === "running" || state.kind === "starting") {
    const seconds = state.kind === "running" ? state.secondsElapsed : 0;
    return (
      <div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-3 print:hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <p className="text-sm font-bold text-amber-900">
              Generating AI Floor Plan…
            </p>
            <span className="text-xs text-amber-700 ml-auto">
              {seconds > 0 ? `${seconds}s elapsed` : "Starting…"}
            </span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            This usually takes 1–2 minutes. You can leave this page and come back —
            we'll save it automatically. The schematic floor plan below is shown in the meantime.
          </p>
        </div>
        {children}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-3 print:hidden">
          <p className="text-sm font-bold text-rose-700 mb-1">AI generation failed</p>
          <p className="text-xs text-rose-600 mb-3">{state.message}</p>
          <button
            onClick={handleGenerate}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
        {children}
      </div>
    );
  }

  // idle
  return (
    <div>
      <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-2xl p-5 mb-3 print:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-stone-900 mb-0.5">
              ✨ Generate an AI Floor Plan
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Use AI to render a polished floor plan from your project answers. Takes 1–2 minutes. Replaces the schematic below when ready.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="shrink-0 bg-amber-600 hover:bg-amber-500 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
          >
            Generate →
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
