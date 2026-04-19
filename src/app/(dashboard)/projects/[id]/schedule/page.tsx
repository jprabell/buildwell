import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { ProjectAnswers } from "@/types";
import { StructureType } from "@/types";
import { generateSchedule } from "@/lib/constructionSchedule";
import Button from "@/components/ui/Button";
import PrintButton from "../material-list/PrintButton";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!project) notFound();

  const answers   = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const purchased = purchases.includes("construction_schedule");

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);

  // Generate the schedule (same result purchased or not — we just blur it unpurchased)
  const schedule = generateSchedule(
    project.structureType as StructureType,
    answers as Record<string, unknown>
  );

  const initialProgress = ((answers as Record<string, unknown>)._scheduleProgress as Record<string, boolean>) ?? {};

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/projects/${id}`}>
              <Button variant="ghost" size="sm">← Project</Button>
            </Link>
            {purchased && <PrintButton />}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10 print:py-4 print:px-0">

        {/* Letterhead */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 print:border-0 print:p-0 print:mb-4">
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-stone-100">
            <div>
              <p className="text-2xl font-black text-stone-900">
                Build<span className="text-amber-600">well</span>
              </p>
              <p className="text-xs text-stone-400">ibuildwell.com · Professional Build Management</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Construction Schedule</p>
              <p className="text-xs text-stone-400">
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Project</p>
              <p className="font-bold text-stone-900">{project.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Structure</p>
              <p className="font-semibold text-stone-700">{structure?.label}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Est. Timeline</p>
              <p className="font-bold text-stone-900">{schedule.totalWeeks} weeks</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Phases</p>
              <p className="font-bold text-stone-900">{schedule.phases.length} build phases</p>
            </div>
          </div>

          {!purchased && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">
                  PREVIEW — Purchase to unlock progress tracking &amp; full schedule
                </p>
                <p className="text-xs text-amber-700">
                  Check off tasks as you complete them. Critical path tasks are highlighted. Tracks your build from day one to CO.
                </p>
              </div>
              <Link href={`/projects/${id}`} className="shrink-0">
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $85
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Interactive schedule */}
        <div className={!purchased ? "pointer-events-none select-none opacity-60" : ""}>
          <ScheduleClient
            phases={schedule.phases}
            totalWeeks={schedule.totalWeeks}
            criticalPathSummary={schedule.criticalPathSummary}
            projectId={id}
            initialProgress={initialProgress}
            purchased={purchased}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-stone-500 print:hidden">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-amber-500" />
            Critical path task — delays here delay the whole project
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-stone-300" />
            Non-critical — can run parallel with other phases
          </span>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-stone-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Disclaimer</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Schedule durations are estimates based on typical construction timelines for your structure type and project size.
            Actual timelines vary based on weather, contractor availability, permit processing times, material lead times,
            and site conditions. Always build contingency time into your project plan.
          </p>
        </div>

        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Construction Schedule · Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
