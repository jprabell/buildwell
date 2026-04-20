import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { getTradesForStructure } from "@/lib/contractorTrades";
import { getBidSpecs } from "@/lib/bidPackageSpecs";
import { ProjectAnswers } from "@/types";
import { StructureType } from "@/types";
import Button from "@/components/ui/Button";
import PrintButton from "../../material-list/PrintButton";
import QuoteBoardClient, { QuoteMap, QuoteTrade } from "./QuoteBoardClient";
import SendBidButton from "./SendBidButton";

const CATEGORY_COLORS: Record<string, string> = {
  Civil:      "bg-amber-100 text-amber-800",
  Structural: "bg-blue-100 text-blue-800",
  Envelope:   "bg-emerald-100 text-emerald-800",
  MEP:        "bg-purple-100 text-purple-800",
  Interior:   "bg-rose-100 text-rose-800",
  Design:     "bg-slate-100 text-slate-800",
};

export default async function QuotePackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const purchased = purchases.includes("quote_package");

  const zipCode = (answers.zipCode as string) || "";
  const state   = (answers.state   as string) || "";
  const location = zipCode.trim().length === 5 ? zipCode : state || "—";

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const trades    = getTradesForStructure(project.structureType as StructureType);

  const sqft = Number(answers.squareFootage ?? answers.squareFeet ?? 0) || 1500;
  const costPerSqftLow  = 80;
  const costPerSqftHigh = 200;
  const totalLow  = sqft * costPerSqftLow;
  const totalHigh = sqft * costPerSqftHigh;

  function fmtMoney(n: number) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function tradeBudgetLow(pctRange: string): number {
    const m = pctRange.match(/([\d.]+)/);
    if (!m) return 0;
    return totalLow * (parseFloat(m[1]) / 100);
  }

  function tradeBudgetHigh(pctRange: string): number {
    const m = pctRange.match(/–\s*([\d.]+)/);
    if (!m) return 0;
    return totalHigh * (parseFloat(m[1]) / 100);
  }

  // ── Saved quotes + contractor names ──────────────────────────────────────
  const savedQuotes = ((answers as Record<string, unknown>)._quotes as QuoteMap) ?? {};
  const savedContractorNames = ((answers as Record<string, unknown>)._contractorNames as [string, string, string]) ?? ["", "", ""];

  const quoteTrades: QuoteTrade[] = trades.map(t => ({
    trade: t.trade,
    category: t.category,
    budgetLow:  tradeBudgetLow(t.budgetPctRange),
    budgetHigh: tradeBudgetHigh(t.budgetPctRange),
  }));

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

      <div className="max-w-6xl mx-auto px-4 py-10 print:py-4 print:px-0">

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
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Contractor Bid Package</p>
              <p className="text-xs text-stone-400">
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Project</p>
              <p className="font-bold text-stone-900">{project.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Structure</p>
              <p className="font-semibold text-stone-700">{structure?.label}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Build Site</p>
              <p className="font-semibold text-stone-700">{location}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Trades</p>
              <p className="font-bold text-stone-900">{trades.length} bid sections</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Drawings</p>
              <Link href={`/projects/${id}/preview/blueprint_set`} className="text-xs font-semibold text-amber-600 hover:text-amber-500 underline">
                View Floor Plan →
              </Link>
            </div>
          </div>

          {/* Budget range callout */}
          {sqft > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Sq Ft</p>
                <p className="font-black text-stone-900">{sqft.toLocaleString()}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Est. Budget Low</p>
                <p className="font-black text-stone-900">{fmtMoney(totalLow)}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Est. Budget High</p>
                <p className="font-black text-stone-900">{fmtMoney(totalHigh)}</p>
              </div>
            </div>
          )}

          {!purchased && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">
                  PREVIEW — Purchase to unlock the full bid package
                </p>
                <p className="text-xs text-amber-700">
                  Get scope-of-work sections, bid request forms, and budget estimates per trade — email directly to contractors or print.
                </p>
              </div>
              <Link href={`/projects/${id}`} className="shrink-0">
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $250
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Instructions + floor plan link (purchased only) */}
        {purchased && (
          <>
            <div className="bg-stone-900 text-white rounded-2xl p-5 mb-4 print:rounded-none print:bg-white print:text-stone-900 print:border print:border-stone-300">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 print:text-amber-700">How to Use This Bid Package</p>
              <ol className="text-xs space-y-1 text-stone-300 print:text-stone-600 list-decimal list-inside leading-relaxed">
                <li>Review the &ldquo;Specified Materials &amp; Standards&rdquo; in each trade section below — these are your baseline specs.</li>
                <li>Use the <strong className="text-white print:text-stone-900">✉ Email to Contractor</strong> button on each section to send that scope directly to a contractor&apos;s inbox.</li>
                <li>Send each trade to a minimum of 3 licensed contractors and enter bids in the Comparison Board above.</li>
                <li>Award based on price, references, availability, and communication quality.</li>
              </ol>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between gap-4 print:hidden">
              <div>
                <p className="text-sm font-bold text-blue-900 mb-0.5">📐 Floor Plan &amp; Drawings</p>
                <p className="text-xs text-blue-700">Send the floor plan PDF to each contractor alongside their bid section.</p>
              </div>
              <Link href={`/projects/${id}/preview/blueprint_set`} className="shrink-0">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  View / Print Floor Plan →
                </button>
              </Link>
            </div>

            {/* ── Quote Comparison Board ── */}
            <div className="mb-8 print:hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">📊</span>
                <h2 className="text-lg font-black text-stone-900">Bid Comparison Board</h2>
                <span className="text-xs text-stone-400">Enter bids as you receive them</span>
              </div>
              <QuoteBoardClient
                projectId={id}
                trades={quoteTrades}
                initialQuotes={savedQuotes}
                contractorNames={savedContractorNames}
              />
            </div>
          </>
        )}

        {/* ── Trade Bid Sections ── */}
        {purchased && (
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-stone-800 text-white text-xs font-black px-3 py-1 rounded-full">📋</span>
            <h2 className="text-lg font-black text-stone-900">Trade Bid Sections</h2>
            <span className="text-xs text-stone-400">Email each section directly to contractors</span>
          </div>
        )}

        <div className="space-y-6">
          {trades.map((trade, ti) => {
            const isBlurred = !purchased && ti >= 3;
            const budgetLow  = tradeBudgetLow(trade.budgetPctRange);
            const budgetHigh = tradeBudgetHigh(trade.budgetPctRange);
            const specs = getBidSpecs(trade.trade, answers, project.structureType);

            return (
              <div
                key={trade.trade}
                className={`bg-white border rounded-2xl overflow-hidden print:break-inside-avoid ${
                  isBlurred ? "opacity-30 select-none pointer-events-none" : "border-stone-200"
                }`}
              >
                {/* Section header */}
                <div className="bg-stone-800 text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-400 text-sm w-6">{String(trade.order).padStart(2, "0")}</span>
                    <div>
                      <p className="font-black text-sm">{trade.trade}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${CATEGORY_COLORS[trade.category] ?? "bg-stone-100 text-stone-600"}`}>
                        {trade.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {purchased && (
                      <SendBidButton
                        projectId={id}
                        tradeName={trade.trade}
                        tradeDescription={trade.description}
                        tradeCategory={trade.category}
                        budgetLow={budgetLow}
                        budgetHigh={budgetHigh}
                        licenseNote={trade.licenseNote}
                      />
                    )}
                    <div className="text-right">
                      {budgetLow > 0 && budgetHigh > 0 && (
                        <p className="text-xs text-amber-300 font-semibold">
                          Est. {fmtMoney(budgetLow)} – {fmtMoney(budgetHigh)}
                        </p>
                      )}
                      <p className="text-xs text-stone-400">{trade.budgetPctRange} of total budget</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-5">
                  {/* Scope + Specs */}
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Scope of Work</p>
                    <p className="text-sm text-stone-700 leading-relaxed mb-4">{trade.description}</p>

                    {specs.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Specified Materials &amp; Standards</p>
                        <ul className="space-y-1.5">
                          {specs.map((item, si) => (
                            <li key={si} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                              <span className="text-amber-500 shrink-0 mt-0.5">▸</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Licensing Requirement</p>
                      <p className={`text-xs font-semibold ${trade.licenseRequired ? "text-rose-600" : "text-stone-400"}`}>
                        {trade.licenseRequired ? "✓ License Required — " : "— "}{trade.licenseNote}
                      </p>
                    </div>
                  </div>

                  {/* Bid request form */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Bid Request Form</p>

                    {[
                      "Contractor Company Name",
                      "License Number",
                      "Insurance Cert / Exp Date",
                      "Base Bid Amount ($)",
                      "Alternate / Allowance Items ($)",
                      "Estimated Start Date",
                      "Estimated Duration (weeks)",
                      "Key Subcontractors (if any)",
                    ].map((field) => (
                      <div key={field}>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-0.5">{field}</p>
                        <div className="border-b border-stone-200 h-6 w-full" />
                      </div>
                    ))}

                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">Materials Included in Bid?</p>
                      <div className="flex gap-6 text-xs text-stone-500">
                        <label className="flex items-center gap-1.5"><span className="border border-stone-300 w-3 h-3 inline-block" /> Yes — all materials</label>
                        <label className="flex items-center gap-1.5"><span className="border border-stone-300 w-3 h-3 inline-block" /> Labor only</label>
                        <label className="flex items-center gap-1.5"><span className="border border-stone-300 w-3 h-3 inline-block" /> Partial</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exclusions + Notes row */}
                <div className="border-t border-stone-100 px-5 py-3 bg-stone-50 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">Exclusions / Clarifications</p>
                    <div className="border-b border-stone-200 h-5 w-full mb-1" />
                    <div className="border-b border-stone-200 h-5 w-full" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">References (previous projects)</p>
                    <div className="border-b border-stone-200 h-5 w-full mb-1" />
                    <div className="border-b border-stone-200 h-5 w-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Locked preview banner */}
        {!purchased && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 text-center">
            <p className="text-sm font-bold text-amber-800 mb-1">
              {trades.length - 3} more bid sections are hidden
            </p>
            <p className="text-xs text-amber-700 mb-3">
              Purchase to unlock all {trades.length} trade sections — complete with scope, budget estimates, email-to-contractor, and a live bid comparison board.
            </p>
            <Link href={`/projects/${id}`}>
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors">
                Purchase Bid Package — $250
              </button>
            </Link>
          </div>
        )}

        {/* Legend */}
        {purchased && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-400 print:hidden">
            {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
              <span key={cat} className={`px-2 py-0.5 rounded-full font-semibold ${cls}`}>{cat}</span>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 bg-stone-100 rounded-2xl p-5 print:mt-4">
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Disclaimer</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Budget estimates are derived from industry-standard cost percentages and project square footage and are provided for planning purposes only.
            Actual bids may vary significantly based on local labor markets, site conditions, material costs, and contractor availability.
            Buildwell LLC does not guarantee any pricing or outcome. Always obtain at least 3 competitive bids per trade, verify contractor
            licensing and insurance independently, and consult a licensed general contractor before executing any agreement.
          </p>
        </div>

        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Contractor Bid Package · Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
