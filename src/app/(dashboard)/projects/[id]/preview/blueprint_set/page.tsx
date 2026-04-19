import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { generatePlanningReport, CodeItem } from "@/lib/planningReport";
import { ProjectAnswers } from "@/types";
import Button from "@/components/ui/Button";
import FloorPlanDownloadButton from "./FloorPlanDownloadButton";

function StatusBadge({ status }: { status: CodeItem["status"] }) {
  if (status === "required") return (
    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Required</span>
  );
  if (status === "verify") return (
    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Verify Local</span>
  );
  return (
    <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">N/A</span>
  );
}

export default async function BlueprintSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const purchased = purchases.includes("blueprint_set");

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const report = generatePlanningReport(answers, project.structureType, structure?.label ?? project.structureType, project.name);

  const totalRoomSqft = report.rooms.reduce((s, r) => s + r.sqft, 0);

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
            <FloorPlanDownloadButton projectId={id} isDraft={!purchased} />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 print:py-4 print:px-0">

        {/* Letterhead */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8 print:border-0 print:p-0 print:mb-4">
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-stone-100">
            <div>
              <p className="text-2xl font-black text-stone-900">
                Build<span className="text-amber-600">well</span>
              </p>
              <p className="text-xs text-stone-400">ibuildwell.com · Professional Build Management</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Construction Planning Report</p>
              <p className="text-xs text-stone-400">
                {new Date(report.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Project</p>
              <p className="font-bold text-stone-900">{report.projectName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Structure</p>
              <p className="font-semibold text-stone-700">{structure?.label}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Build Site</p>
              <p className="font-semibold text-stone-700">{report.location}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Budget</p>
              <p className="font-semibold text-stone-700">{report.budgetRange}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Total Area</p>
              <p className="font-bold text-stone-900">{report.squareFootage > 0 ? report.squareFootage.toLocaleString() + " sq ft" : "TBD"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Stories</p>
              <p className="font-semibold text-stone-700">{report.stories}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Rooms</p>
              <p className="font-semibold text-stone-700">{report.rooms.length} spaces</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Scheduled Sq Ft</p>
              <p className="font-semibold text-stone-700">{totalRoomSqft.toLocaleString()} sq ft</p>
            </div>
          </div>

          {!purchased && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">DRAFT PREVIEW — OWNED BY BUILD-WELL LLC</p>
                <p className="text-xs text-amber-700">Purchase to unlock the full clean report, all sections, and print-ready export.</p>
              </div>
              <Link href={`/projects/${id}`} className="shrink-0">
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $250
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Assumptions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-stone-900 mb-3">Project Scope &amp; Assumptions</h2>
          <ul className="space-y-1">
            {report.assumptions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Section 1: Room Schedule ── */}
        <div className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">01</span>
            <h2 className="text-lg font-black text-stone-900">Room Schedule</h2>
            <span className="text-xs text-stone-400">{report.rooms.length} spaces · {totalRoomSqft.toLocaleString()} sq ft scheduled</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Room / Space</th>
                  <th className="text-right text-xs font-semibold text-stone-500 px-4 py-3 w-28">Width (ft)</th>
                  <th className="text-right text-xs font-semibold text-stone-500 px-4 py-3 w-28">Length (ft)</th>
                  <th className="text-right text-xs font-semibold text-stone-500 px-4 py-3 w-28">Sq Ft</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.rooms.map((room, i) => {
                  const isBlurred = !purchased && i >= 4;
                  return (
                    <tr key={i} className={`border-b border-stone-100 last:border-0 ${isBlurred ? "opacity-30 select-none pointer-events-none" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-stone-900">{isBlurred ? "████████████" : room.name}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{isBlurred ? "—" : room.width}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{isBlurred ? "—" : room.length}</td>
                      <td className="px-4 py-3 text-right font-bold text-stone-900">{isBlurred ? "—" : room.sqft.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-stone-400">{isBlurred ? "" : room.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-stone-50 border-t border-stone-200">
                  <td className="px-4 py-3 text-xs font-bold text-stone-600 uppercase tracking-wide" colSpan={3}>Scheduled Total</td>
                  <td className="px-4 py-3 text-right font-black text-stone-900">{purchased ? totalRoomSqft.toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">sq ft</td>
                </tr>
              </tfoot>
            </table>
            {!purchased && report.rooms.length > 4 && (
              <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 text-center">
                <p className="text-xs text-stone-500">
                  {report.rooms.length - 4} more rooms hidden —{" "}
                  <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">Purchase to unlock</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Foundation & Framing ── */}
        <div className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">02</span>
            <h2 className="text-lg font-black text-stone-900">Foundation &amp; Framing Summary</h2>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-48">Element</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-64">Specification</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.structural.map((s, i) => {
                  const isBlurred = !purchased && i >= 3;
                  return (
                    <tr key={i} className={`border-b border-stone-100 last:border-0 ${isBlurred ? "opacity-30 select-none pointer-events-none" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-stone-900 text-xs">{s.label}</td>
                      <td className="px-4 py-3 text-sm text-stone-800">{isBlurred ? "████████████████" : s.value}</td>
                      <td className="px-4 py-3 text-xs text-stone-500">{isBlurred ? "" : s.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!purchased && report.structural.length > 3 && (
              <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 text-center">
                <p className="text-xs text-stone-500">
                  {report.structural.length - 3} more items hidden —{" "}
                  <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">Purchase to unlock</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 3: Systems Overview ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">03</span>
            <h2 className="text-lg font-black text-stone-900">Systems Overview</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Plumbing */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden print:break-inside-avoid">
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
                <h3 className="font-black text-blue-900 text-sm">Plumbing</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {report.plumbing.map((p, i) => {
                  const isBlurred = !purchased && i >= 3;
                  return (
                    <div key={i} className={`px-4 py-3 ${isBlurred ? "opacity-30 select-none" : ""}`}>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">{isBlurred ? "████████" : p.item}</p>
                      <p className="text-xs text-stone-500">{isBlurred ? "████████████████" : p.spec}</p>
                    </div>
                  );
                })}
                {!purchased && (
                  <div className="px-4 py-2 text-center">
                    <p className="text-xs text-stone-400">
                      <Link href={`/projects/${id}`} className="text-amber-600 hover:underline">Purchase to see all</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Electrical */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden print:break-inside-avoid">
              <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-3">
                <h3 className="font-black text-yellow-900 text-sm">Electrical</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {report.electrical.map((e, i) => {
                  const isBlurred = !purchased && i >= 3;
                  return (
                    <div key={i} className={`px-4 py-3 ${isBlurred ? "opacity-30 select-none" : ""}`}>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">{isBlurred ? "████████" : e.item}</p>
                      <p className="text-xs text-stone-500">{isBlurred ? "████████████████" : e.spec}</p>
                    </div>
                  );
                })}
                {!purchased && (
                  <div className="px-4 py-2 text-center">
                    <p className="text-xs text-stone-400">
                      <Link href={`/projects/${id}`} className="text-amber-600 hover:underline">Purchase to see all</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* HVAC */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden print:break-inside-avoid">
              <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-3">
                <h3 className="font-black text-emerald-900 text-sm">HVAC</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {report.hvac.map((h, i) => {
                  const isBlurred = !purchased && i >= 2;
                  return (
                    <div key={i} className={`px-4 py-3 ${isBlurred ? "opacity-30 select-none" : ""}`}>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">{isBlurred ? "████████" : h.item}</p>
                      <p className="text-xs text-stone-500">{isBlurred ? "████████████████" : h.spec}</p>
                    </div>
                  );
                })}
                {!purchased && (
                  <div className="px-4 py-2 text-center">
                    <p className="text-xs text-stone-400">
                      <Link href={`/projects/${id}`} className="text-amber-600 hover:underline">Purchase to see all</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Material Selections ── */}
        <div className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">04</span>
            <h2 className="text-lg font-black text-stone-900">Material Selections &amp; Specs</h2>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-40">Category</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Selection</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.materials.map((m, i) => {
                  const isBlurred = !purchased && i >= 3;
                  return (
                    <tr key={i} className={`border-b border-stone-100 last:border-0 ${isBlurred ? "opacity-30 select-none pointer-events-none" : ""}`}>
                      <td className="px-4 py-3 text-xs font-semibold text-stone-500">{m.category}</td>
                      <td className="px-4 py-3 font-semibold text-stone-900">{isBlurred ? "████████████████" : m.selection}</td>
                      <td className="px-4 py-3 text-xs text-stone-400">{isBlurred ? "" : m.spec}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!purchased && report.materials.length > 3 && (
              <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 text-center">
                <p className="text-xs text-stone-500">
                  {report.materials.length - 3} more selections hidden —{" "}
                  <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">Purchase to unlock</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 5: Code Compliance Checklist ── */}
        <div className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">05</span>
            <h2 className="text-lg font-black text-stone-900">Code Compliance Checklist</h2>
            <span className="text-xs text-stone-400">{report.codeChecklist.filter(c => c.status === "required").length} required items</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-24">Code Ref</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Requirement</th>
                  <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.codeChecklist.map((c, i) => {
                  const isBlurred = !purchased && i >= 6;
                  return (
                    <tr key={i} className={`border-b border-stone-100 last:border-0 ${isBlurred ? "opacity-30 select-none pointer-events-none" : ""}`}>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-stone-600">{c.code}</td>
                      <td className="px-4 py-3 text-xs text-stone-700">{isBlurred ? "████████████████████████████" : c.requirement}</td>
                      <td className="px-4 py-3">{isBlurred ? null : <StatusBadge status={c.status} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!purchased && report.codeChecklist.length > 6 && (
              <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 text-center">
                <p className="text-xs text-stone-500">
                  {report.codeChecklist.length - 6} more items hidden —{" "}
                  <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">Purchase to unlock</Link>
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-4 text-xs text-stone-500">
            <span><span className="font-bold text-rose-600">Required</span> — apply to all new construction</span>
            <span><span className="font-bold text-amber-600">Verify Local</span> — confirm with local jurisdiction</span>
            <span><span className="text-stone-400">N/A</span> — not applicable to this project</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-stone-100 rounded-2xl p-5 mt-6 print:mt-4">
          <p className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Important Disclaimer</p>
          <p className="text-xs text-stone-500 leading-relaxed">{report.disclaimer}</p>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Construction Planning Report · Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
