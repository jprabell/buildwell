import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { calculateMaterials, MaterialLineItem } from "@/lib/materialCalculator";
import { ProjectAnswers } from "@/types";
import Button from "@/components/ui/Button";
import PrintButton from "./PrintButton";

function groupByDivision(items: MaterialLineItem[]) {
  const map = new Map<string, { division: number; name: string; items: MaterialLineItem[] }>();
  for (const item of items) {
    const key = `${item.division}`;
    if (!map.has(key)) {
      map.set(key, { division: item.division, name: item.divisionName, items: [] });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values()).sort((a, b) => a.division - b.division);
}

export default async function MaterialListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  // BETA: free access during beta period
  const purchased = true || purchases.includes("material_list");

  const result = calculateMaterials(answers, project.structureType, project.name);
  const divisions = groupByDivision(result.items);
  const totalItems = result.items.length;

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

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Material List + Spec Sheet</p>
              <h1 className="text-3xl font-black text-stone-900 mb-1">{result.projectName}</h1>
              <p className="text-stone-500 text-sm">
                {result.structureType.replace(/_/g, " ")} ·{" "}
                {result.squareFootage.toLocaleString()} sq ft ·{" "}
                Generated {new Date(result.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-stone-900">{totalItems}</p>
              <p className="text-xs text-stone-400">line items</p>
            </div>
          </div>

          {/* Watermark banner for unpurchased */}
          {!purchased && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-800">DRAFT PREVIEW — OWNED BY BUILD-WELL LLC</p>
                <p className="text-xs text-amber-600">Purchase to unlock the full clean document, all quantities, and export.</p>
              </div>
              <Link href={`/projects/${id}`}>
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $100
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Assumptions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 print:mb-4">
          <h2 className="text-sm font-bold text-stone-900 mb-3">Project Assumptions &amp; Scope</h2>
          <ul className="space-y-1">
            {result.assumptions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Division tables */}
        {divisions.map((div) => (
          <div key={div.division} className="mb-8 print:mb-5 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">
                DIV {div.division}
              </span>
              <h2 className="text-lg font-black text-stone-900">{div.name}</h2>
              <span className="text-xs text-stone-400">{div.items.length} items</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-36">Category</th>
                    <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Item</th>
                    <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3">Specification</th>
                    <th className="text-right text-xs font-semibold text-stone-500 px-4 py-3 w-24">Qty</th>
                    <th className="text-left text-xs font-semibold text-stone-500 px-3 py-3 w-16">Unit</th>
                    <th className="text-left text-xs font-semibold text-stone-500 px-4 py-3 w-48 print:hidden">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {div.items.map((item, i) => {
                    const isBlurred = !purchased && i >= 3;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-stone-100 last:border-0 ${
                          isBlurred ? "opacity-30 select-none pointer-events-none" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-xs text-stone-500 font-medium">{item.category}</td>
                        <td className="px-4 py-3 font-semibold text-stone-900">
                          {isBlurred ? "████████████" : item.item}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-600">
                          {isBlurred ? "██████████████████" : item.spec}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-stone-900">
                          {isBlurred ? "—" : item.quantity.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-xs text-stone-500">{isBlurred ? "—" : item.unit}</td>
                        <td className="px-4 py-3 text-xs text-stone-400 print:hidden">
                          {isBlurred ? "" : item.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!purchased && div.items.length > 3 && (
                <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 text-center">
                  <p className="text-xs text-stone-500">
                    {div.items.length - 3} more items hidden —{" "}
                    <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">
                      Purchase to unlock
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Disclaimer */}
        <div className="bg-stone-100 rounded-2xl p-5 mt-6 print:mt-4">
          <p className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Important Disclaimer</p>
          <p className="text-xs text-stone-500 leading-relaxed">{result.disclaimer}</p>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Generated by Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
