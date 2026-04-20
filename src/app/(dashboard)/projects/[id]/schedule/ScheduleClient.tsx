"use client";

import { useState, useTransition } from "react";
import { SchedulePhase, ScheduleTask } from "@/lib/constructionSchedule";
import GanttChart from "./GanttChart";

interface Props {
  phases: SchedulePhase[];
  totalWeeks: number;
  criticalPathSummary: string;
  projectId: string;
  initialProgress: Record<string, boolean>;
  purchased: boolean;
}

export default function ScheduleClient({
  phases,
  totalWeeks,
  criticalPathSummary,
  projectId,
  initialProgress,
  purchased,
}: Props) {
  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress);
  const [tab, setTab]           = useState<"list" | "gantt">("list");
  const [, startTransition]     = useTransition();

  // ── Stats ──────────────────────────────────────────────────────────────────
  const allTasks       = phases.flatMap(p => p.tasks);
  const completedCount = allTasks.filter(t => progress[t.id]).length;
  const totalCount     = allTasks.length;
  const pct            = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const criticalTasks  = allTasks.filter(t => t.isCritical);
  const criticalDone   = criticalTasks.filter(t => progress[t.id]).length;

  // ── Toggle a task's completion state ───────────────────────────────────────
  function toggle(task: ScheduleTask) {
    if (!purchased) return;
    const next = !progress[task.id];
    setProgress(prev => ({ ...prev, [task.id]: next }));
    startTransition(async () => {
      await fetch(`/api/projects/${projectId}/schedule-progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, completed: next }),
      });
    });
  }

  // ── Whether a task's dependencies are all done ─────────────────────────────
  function isReady(task: ScheduleTask): boolean {
    return task.dependsOn.every(dep => !!progress[dep]);
  }

  return (
    <div>
      {/* ── Progress stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Overall Progress</p>
          <p className="text-3xl font-black text-stone-900">{pct}%</p>
          <p className="text-xs text-stone-400 mt-1">{completedCount} of {totalCount} tasks</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Critical Path</p>
          <p className="text-3xl font-black text-amber-600">{criticalDone}/{criticalTasks.length}</p>
          <p className="text-xs text-stone-400 mt-1">critical tasks done</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Est. Timeline</p>
          <p className="text-3xl font-black text-stone-900">{totalWeeks} wks</p>
          <p className="text-xs text-stone-400 mt-1">total project</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Phases</p>
          <p className="text-3xl font-black text-stone-900">{phases.length}</p>
          <p className="text-xs text-stone-400 mt-1">build phases</p>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-stone-700">Build Progress</p>
          <p className="text-sm font-black text-amber-600">{pct}%</p>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-stone-400 leading-relaxed">
          <span className="font-semibold text-stone-600">Critical Path:</span>{" "}{criticalPathSummary}
        </p>
      </div>

      {/* ── Tab switcher ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5 print:hidden">
        <button
          onClick={() => setTab("list")}
          className={`text-sm font-bold px-5 py-2 rounded-xl transition-all ${
            tab === "list"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white border border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300"
          }`}
        >
          ☑ Task List
        </button>
        <button
          onClick={() => setTab("gantt")}
          className={`text-sm font-bold px-5 py-2 rounded-xl transition-all ${
            tab === "gantt"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white border border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300"
          }`}
        >
          📊 Gantt Chart
        </button>
      </div>

      {/* ── Task List view ─────────────────────────────────────────────────── */}
      {tab === "list" && (
        <>
          {phases.map(phase => {
            const phaseTasks    = phase.tasks;
            const phaseDone     = phaseTasks.filter(t => progress[t.id]).length;
            const phaseComplete = phaseDone === phaseTasks.length;

            return (
              <div key={phase.id} className="mb-6">
                {/* Phase header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-white text-xs font-black px-3 py-1 rounded-full ${phase.color}`}>
                    Phase {phase.order}
                  </span>
                  <h3 className="text-lg font-black text-stone-900">{phase.name}</h3>
                  {phaseComplete && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      ✓ Complete
                    </span>
                  )}
                  <span className="ml-auto text-xs text-stone-400">{phaseDone}/{phaseTasks.length} tasks</span>
                </div>

                {/* Task rows */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  {phaseTasks.map((task, ti) => {
                    const done    = !!progress[task.id];
                    const ready   = isReady(task);
                    const blocked = purchased && !ready && !done;

                    return (
                      <div
                        key={task.id}
                        className={`flex items-start gap-4 px-5 py-4 ${
                          ti < phaseTasks.length - 1 ? "border-b border-stone-100" : ""
                        } ${done ? "bg-green-50/40" : blocked ? "opacity-50" : ""}`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggle(task)}
                          disabled={!purchased || blocked}
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            done
                              ? "bg-green-500 border-green-500 text-white"
                              : purchased && !blocked
                              ? "border-stone-300 hover:border-amber-500 cursor-pointer"
                              : "border-stone-200 cursor-default"
                          }`}
                          aria-label={done ? "Mark incomplete" : "Mark complete"}
                        >
                          {done && (
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold ${done ? "line-through text-stone-400" : "text-stone-900"}`}>
                              {task.name}
                            </span>
                            {task.isCritical && (
                              <span className="text-[10px] font-black uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                                Critical Path
                              </span>
                            )}
                            {blocked && (
                              <span className="text-[10px] font-semibold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                Waiting on prior task
                              </span>
                            )}
                          </div>
                          {task.notes && !done && (
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed">{task.notes}</p>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-stone-500">{task.durationDays}d</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!purchased && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-bold text-amber-800 mb-1">Purchase to unlock progress tracking</p>
              <p className="text-xs text-amber-700">Check off tasks as you complete them and track your build in real time.</p>
            </div>
          )}
        </>
      )}

      {/* ── Gantt Chart view ───────────────────────────────────────────────── */}
      {tab === "gantt" && (
        <GanttChart
          phases={phases}
          progress={progress}
          onToggle={toggle}
          purchased={purchased}
        />
      )}
    </div>
  );
}
