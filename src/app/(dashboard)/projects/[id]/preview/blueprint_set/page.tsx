import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { generatePlanningReport, CodeItem } from "@/lib/planningReport";
import { generateFloorPlanSVG } from "@/lib/floorPlanSVG";
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
    include: {
      blueprintOrders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  // BETA: free access during beta period
  const purchased = true || purchases.includes("blueprint_set");

  const blueprintOrder = project.blueprintOrders[0] ?? null;
  const bpFiles = (blueprintOrder?.files as { name: string; url: string; format: string }[] | undefined) ?? [];

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const report = generatePlanningReport(answers, project.structureType, structure?.label ?? project.structureType, project.name);

  const totalRoomSqft = report.rooms.reduce((s, r) => s + r.sqft, 0);

  const floorPlanSVG = generateFloorPlanSVG(
    report.rooms,
    project.name,
    project.structureType,
    report.squareFootage > 0 ? report.squareFootage : totalRoomSqft,
    !purchased,
    report.location,
  );

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

      {/* BETA banner */}
      <div className="bg-amber-50 border-b border-amber-300 px-6 py-2.5 print:hidden">
        <p className="max-w-6xl mx-auto text-xs font-bold text-amber-800 text-center">
          BETA — This document is AI-generated and still being fine-tuned. NOT FOR CONSTRUCTION. Do not use for permitting, bidding, or building without independent professional review.
        </p>
      </div>
      {/* BETA print watermark */}
      <div className="hidden print:block bg-amber-100 border border-amber-400 rounded-xl px-5 py-3 mx-6 mt-4 text-center">
        <p className="text-xs font-black text-amber-900 uppercase tracking-wide">
          BETA — AI-Generated Document · Still Being Fine-Tuned · NOT FOR CONSTRUCTION
        </p>
      </div>

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

        {/* ── Floor Plan Drawing ── */}
        <div className="mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-stone-800 text-white text-xs font-black px-3 py-1 rounded-full">A1</span>
            <h2 className="text-lg font-black text-stone-900">Floor Plan — Schematic Design</h2>
            <span className="text-xs text-stone-400">Not for construction · {report.squareFootage > 0 ? report.squareFootage.toLocaleString() : totalRoomSqft.toLocaleString()} sq ft</span>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl overflow-auto">
            <div
              className="min-w-0"
              dangerouslySetInnerHTML={{ __html: floorPlanSVG }}
            />
          </div>
          {!purchased && (
            <p className="text-xs text-amber-700 mt-2 text-center font-semibold">
              DRAFT PREVIEW — Purchase to unlock the clean, print-ready floor plan.
            </p>
          )}
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

        {/* ── Permit-Ready Blueprint CTA / Order Status ── */}
        <div className="mt-8 print:hidden">
          {blueprintOrder?.status === "COMPLETE" ? (
            // Files ready for download
            <div className="bg-green-50 border border-green-300 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-green-900 mb-0.5">
                    {blueprintOrder.tier === "permit" ? "Permit-Ready" : "Spec-Grade"} Blueprint Set Ready
                  </p>
                  <p className="text-sm text-green-700">
                    Your blueprints are complete and ready to download. All files are PDF + DWG format.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {bpFiles.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white border border-green-200 rounded-xl px-4 py-3 hover:border-green-400 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase">{f.format}</span>
                      <span className="text-sm font-semibold text-stone-800">{f.name}</span>
                    </div>
                    <svg className="h-4 w-4 text-stone-400 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ) : blueprintOrder?.status === "PROCESSING" || blueprintOrder?.status === "PAID" ? (
            // Order in progress
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-center gap-5">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <div>
                <p className="font-black text-blue-900 mb-0.5">
                  {blueprintOrder.tier === "permit" ? "Permit-Ready" : "Spec-Grade"} Blueprints In Production
                </p>
                <p className="text-sm text-blue-700">
                  {blueprintOrder.status === "PAID"
                    ? "Your order has been received and is queued for design. You'll get an email when ready."
                    : "Your blueprints are being generated. You'll receive an email with download links when complete."}
                  {" "}Expected: {blueprintOrder.tier === "permit" ? "7–10" : "3–5"} business days.
                </p>
                <p className="text-xs text-blue-500 mt-1">Order ref: {blueprintOrder.id}</p>
              </div>
            </div>
          ) : (
            // No order yet — show the CTA
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 bg-white">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">NEW</span>
                  <p className="font-black text-stone-900 text-lg">Need Permit-Ready Blueprints?</p>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Your schematic floor plan above is great for planning and cost estimating — but most permitting offices require stamped, construction-ready drawings. Order a full permit-ready blueprint set generated from your exact specifications.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Spec-Grade Set", price: "$699", badge: "AI-Generated", detail: "Floor plans, elevations, sections, site plan — PDF + DWG. 3–5 business days." },
                    { label: "Permit-Ready Set", price: "$1,499", badge: "Architect Stamped", detail: "Everything above + licensed architect stamp for your state. 7–10 business days." },
                  ].map(opt => (
                    <div key={opt.label} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-stone-900 text-sm">{opt.label}</p>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{opt.badge}</span>
                      </div>
                      <p className="text-xs text-stone-500 mb-2 leading-relaxed">{opt.detail}</p>
                      <p className="text-lg font-black text-stone-900">{opt.price}</p>
                    </div>
                  ))}
                </div>
                <Link href={`/projects/${id}/blueprints/order`}>
                  <button className="bg-amber-600 hover:bg-amber-500 text-white font-black px-6 py-3 rounded-xl text-sm transition-colors">
                    Start Blueprint Order →
                  </button>
                </Link>
                <p className="text-xs text-stone-400 mt-3">Takes about 5 minutes. Detailed questionnaire collects everything the architect needs.</p>
              </div>
            </div>
          )}
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
