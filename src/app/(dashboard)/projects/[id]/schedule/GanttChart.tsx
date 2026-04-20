"use client";

import { useState } from "react";
import { SchedulePhase, ScheduleTask } from "@/lib/constructionSchedule";

// ── Hex colors per phase ID (for inline bar styling) ─────────────────────────
const PHASE_HEX: Record<string, string> = {
  "pre-construction":    "#64748b",
  "site-work":           "#b45309",
  "foundation":          "#78716c",
  "framing":             "#d97706",
  "rough-mep":           "#1d4ed8",
  "envelope":            "#059669",
  "insulation-drywall":  "#7c3aed",
  "interior-finish":     "#be185d",
  "final-mep":           "#2563eb",
  "completion":          "#16a34a",
};

// ── Compute start/end day for every task via topological forward-pass ─────────
interface Timing { startDay: number; endDay: number; }

function computeTimings(phases: SchedulePhase[]): Map<string, Timing> {
  const allTasks = phases.flatMap(p => p.tasks);
  const taskMap  = new Map(allTasks.map(t => [t.id, t]));
  const timings  = new Map<string, Timing>();

  function compute(id: string) {
    if (timings.has(id)) return;
    const t = taskMap.get(id);
    if (!t) return;
    let start = 0;
    for (const dep of t.dependsOn) {
      compute(dep);
      const d = timings.get(dep);
      if (d) start = Math.max(start, d.endDay);
    }
    timings.set(id, { startDay: start, endDay: start + t.durationDays });
  }

  for (const t of allTasks) compute(t.id);
  return timings;
}

// ── Layout constants ──────────────────────────────────────────────────────────
const ROW_H     = 42;   // px — task row height
const PHASE_H   = 34;   // px — phase header row height
const HEADER_H  = 48;   // px — week ruler height
const LABEL_W   = 228;  // px — left label column width

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  phases: SchedulePhase[];
  progress: Record<string, boolean>;
  onToggle: (task: ScheduleTask) => void;
  purchased: boolean;
}

interface TooltipState {
  task: ScheduleTask;
  x: number;
  y: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GanttChart({ phases, progress, onToggle, purchased }: Props) {
  const [pxPerDay, setPxPerDay] = useState(16);
  const [tooltip,  setTooltip]  = useState<TooltipState | null>(null);

  const timings   = computeTimings(phases);
  const totalDays = Math.max(...Array.from(timings.values()).map(t => t.endDay), 1);
  const weeks     = Math.ceil(totalDays / 7);
  const totalW    = totalDays * pxPerDay;

  const weekNums  = Array.from({ length: weeks + 1 }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden print:hidden">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-stone-500">Zoom</span>
          <button
            onClick={() => setPxPerDay(p => Math.max(6, p - 4))}
            className="w-6 h-6 flex items-center justify-center bg-white border border-stone-200 rounded font-bold text-stone-600 hover:bg-stone-100"
          >−</button>
          <button
            onClick={() => setPxPerDay(p => Math.min(52, p + 4))}
            className="w-6 h-6 flex items-center justify-center bg-white border border-stone-200 rounded font-bold text-stone-600 hover:bg-stone-100"
          >+</button>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-stone-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-amber-400 border border-amber-500" />
            Critical path
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-stone-400" />
            Non-critical
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-green-500" />
            Complete
          </span>
        </div>

        <span className="ml-auto text-[10px] text-stone-400 hidden sm:block">
          {totalDays} days · {weeks} weeks · scroll →
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex">

        {/* Left label column (doesn't scroll horizontally) */}
        <div className="shrink-0 border-r border-stone-200" style={{ width: LABEL_W }}>

          {/* Header spacer */}
          <div style={{ height: HEADER_H }} className="border-b border-stone-200 bg-stone-50" />

          {phases.map(phase => (
            <div key={phase.id}>
              {/* Phase header */}
              <div
                style={{ height: PHASE_H }}
                className="flex items-center gap-2 px-3 border-b border-stone-100 bg-stone-50"
              >
                <span className={`shrink-0 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ${phase.color}`}>
                  {phase.order}
                </span>
                <span className="text-xs font-bold text-stone-700 truncate">{phase.name}</span>
              </div>

              {/* Task labels */}
              {phase.tasks.map(task => {
                const done = !!progress[task.id];
                return (
                  <div
                    key={task.id}
                    style={{ height: ROW_H }}
                    className={`flex items-center px-3 gap-1.5 border-b border-stone-50 ${done ? "bg-green-50/50" : ""}`}
                  >
                    {task.isCritical && (
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                    <span className={`text-[11px] leading-tight flex-1 ${done ? "line-through text-stone-400" : "text-stone-700"}`}>
                      {task.name}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">{task.durationDays}d</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right scrollable chart area */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: Math.max(totalW, 400), position: "relative" }}>

            {/* Week ruler */}
            <div
              style={{ height: HEADER_H }}
              className="relative border-b border-stone-200 bg-stone-50"
            >
              {weekNums.map(w => (
                <div
                  key={w}
                  className="absolute top-0 bottom-0 flex flex-col justify-center pl-1.5 border-l border-stone-200"
                  style={{ left: w * 7 * pxPerDay }}
                >
                  <span className="text-[10px] font-bold text-stone-600">Wk {w + 1}</span>
                  {pxPerDay >= 12 && (
                    <span className="text-[9px] text-stone-400">Day {w * 7 + 1}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Phase + task rows */}
            {phases.map(phase => {
              const phaseHex = PHASE_HEX[phase.id] ?? "#d97706";

              return (
                <div key={phase.id}>

                  {/* Phase header band */}
                  <div
                    style={{ height: PHASE_H }}
                    className="relative border-b border-stone-100"
                  >
                    <div
                      className="absolute inset-y-1 left-0 right-0 rounded opacity-10"
                      style={{ backgroundColor: phaseHex }}
                    />
                    {weekNums.map(w => (
                      <div
                        key={w}
                        className="absolute top-0 bottom-0 border-l border-stone-100"
                        style={{ left: w * 7 * pxPerDay }}
                      />
                    ))}
                  </div>

                  {/* Task bar rows */}
                  {phase.tasks.map(task => {
                    const timing = timings.get(task.id);
                    if (!timing) return null;

                    const done      = !!progress[task.id];
                    const barLeft   = timing.startDay * pxPerDay;
                    const barWidth  = Math.max((timing.endDay - timing.startDay) * pxPerDay - 2, 8);

                    const barBg = done
                      ? "#22c55e"
                      : task.isCritical
                      ? "#f59e0b"
                      : phaseHex;

                    const showLabel = barWidth > 52;

                    return (
                      <div
                        key={task.id}
                        style={{ height: ROW_H }}
                        className={`relative border-b border-stone-50 ${done ? "bg-green-50/40" : ""}`}
                      >
                        {/* Week grid lines */}
                        {weekNums.map(w => (
                          <div
                            key={w}
                            className="absolute top-0 bottom-0 border-l border-stone-100"
                            style={{ left: w * 7 * pxPerDay }}
                          />
                        ))}

                        {/* Task bar */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 rounded-md flex items-center overflow-hidden select-none transition-all duration-150 ${
                            purchased
                              ? "cursor-pointer hover:brightness-110 hover:shadow-lg active:scale-y-95"
                              : "cursor-default"
                          }`}
                          style={{
                            left: barLeft,
                            width: barWidth,
                            height: 26,
                            backgroundColor: barBg,
                            boxShadow: task.isCritical && !done
                              ? "0 0 0 1.5px rgba(245,158,11,0.6), 0 1px 3px rgba(0,0,0,0.2)"
                              : "0 1px 3px rgba(0,0,0,0.15)",
                          }}
                          onClick={() => purchased && onToggle(task)}
                          onMouseEnter={e => setTooltip({ task, x: e.clientX, y: e.clientY })}
                          onMouseMove={e  => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          {done && (
                            <svg className="w-3.5 h-3.5 ml-1.5 shrink-0" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {showLabel && (
                            <span className="text-[10px] font-semibold text-white px-1.5 truncate">
                              {task.name}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Hover tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-50 bg-stone-900 text-white rounded-xl shadow-2xl p-3.5 text-xs pointer-events-none border border-stone-700"
          style={{
            left: Math.min(tooltip.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 290),
            top:  Math.max(tooltip.y - 100, 8),
            maxWidth: 272,
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <p className="font-black text-sm leading-tight flex-1">{tooltip.task.name}</p>
            {tooltip.task.isCritical && (
              <span className="shrink-0 text-[9px] font-black uppercase bg-amber-500 px-1.5 py-0.5 rounded">
                Critical
              </span>
            )}
          </div>
          <p className="text-stone-300 mb-1">
            Duration: <span className="font-semibold text-white">{tooltip.task.durationDays} days</span>
          </p>
          {tooltip.task.dependsOn.length > 0 && (
            <p className="text-stone-500 text-[10px] mb-1">
              Requires: {tooltip.task.dependsOn.join(", ")}
            </p>
          )}
          {tooltip.task.notes && (
            <p className="text-stone-300 leading-relaxed mt-2 pt-2 border-t border-stone-700">
              {tooltip.task.notes}
            </p>
          )}
          {purchased && (
            <p className="text-stone-500 text-[10px] mt-2 italic">
              Click bar to mark {progress[tooltip.task.id] ? "incomplete" : "complete"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
