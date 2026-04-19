import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { getTradesForStructure } from "@/lib/contractorTrades";
import { findContractors, geocodeZip, ContractorResult } from "@/lib/googlePlaces";
import { ProjectAnswers } from "@/types";
import { StructureType } from "@/types";
import Button from "@/components/ui/Button";
import PrintButton from "../material-list/PrintButton";

const CATEGORY_COLORS: Record<string, string> = {
  Civil:      "bg-amber-100 text-amber-800",
  Structural: "bg-blue-100 text-blue-800",
  Envelope:   "bg-emerald-100 text-emerald-800",
  MEP:        "bg-purple-100 text-purple-800",
  Interior:   "bg-rose-100 text-rose-800",
  Design:     "bg-slate-100 text-slate-800",
};

function starStr(rating: number): string {
  if (!rating) return "—";
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}

export default async function ContractorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const purchased = purchases.includes("vendor_list");

  const zipCode = (answers.zipCode as string) || "";
  const state   = (answers.state   as string) || "";
  const hasZip  = zipCode.trim().length === 5;
  const location = hasZip ? zipCode : state || "near me";

  const structure  = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const trades     = getTradesForStructure(project.structureType as StructureType);
  const hasGoogleKey = !!process.env.GOOGLE_PLACES_API_KEY;

  type TradeWithContractors = { trade: (typeof trades)[0]; contractors: ContractorResult[] };
  let tradeResults: TradeWithContractors[] = [];

  if (purchased && hasGoogleKey) {
    // Geocode the zip once so every trade search uses a hard radius constraint
    // instead of relying on a text-embedded location string.
    const coords = hasZip ? await geocodeZip(zipCode) : null;

    tradeResults = await Promise.all(
      trades.map(async (trade) => ({
        trade,
        contractors: await findContractors(trade.searchKeywords, location, coords),
      }))
    );
  } else {
    tradeResults = trades.map((trade) => ({ trade, contractors: [] }));
  }

  // Pad each trade to exactly 3 contractor slots
  const SLOTS = 3;

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
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Preferred Vendor List</p>
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
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Build Site</p>
              <p className="font-semibold text-stone-700">{hasZip ? zipCode : state || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Trades</p>
              <p className="font-bold text-stone-900">{trades.length} in build sequence</p>
            </div>
          </div>

          {!purchased && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">
                  PREVIEW — Purchase to unlock full contractor spreadsheet
                </p>
                <p className="text-xs text-amber-700">
                  Get 3 local contractors per trade pre-filled with name, phone, address, and rating — print-ready.
                </p>
              </div>
              <Link href={`/projects/${id}`} className="shrink-0">
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $40
                </button>
              </Link>
            </div>
          )}

          {purchased && !hasZip && (
            <div className="mt-5 bg-stone-50 border border-stone-200 rounded-xl px-5 py-3">
              <p className="text-sm text-stone-600">
                <strong>No ZIP code on file.</strong> Results use your state or &ldquo;near me&rdquo;.{" "}
                <Link href={`/design?edit=${id}`} className="text-amber-600 hover:underline">Add your ZIP code</Link>{" "}
                for precise local results.
              </p>
            </div>
          )}

          {purchased && !hasGoogleKey && (
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
              <p className="text-sm font-bold text-blue-800 mb-0.5">Contractor Data Pending</p>
              <p className="text-xs text-blue-700">
                Add <code className="bg-blue-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> to Netlify env vars to auto-fill contractor rows.
                Rows are print-ready for manual entry in the meantime.
              </p>
            </div>
          )}
        </div>

        {/* ── Spreadsheet ── */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden print:rounded-none print:border-0">
          <table className="w-full text-xs border-collapse">
            {/* Column headers */}
            <thead>
              <tr className="bg-stone-800 text-white">
                <th className="text-left font-bold px-3 py-2.5 w-8">#</th>
                <th className="text-left font-bold px-3 py-2.5 w-36">Trade</th>
                <th className="text-left font-bold px-3 py-2.5 w-20 hidden md:table-cell">Category</th>
                <th className="text-left font-bold px-3 py-2.5 w-16 hidden md:table-cell">Budget %</th>
                <th className="text-left font-bold px-3 py-2.5 w-16 hidden md:table-cell">License</th>
                <th className="text-left font-bold px-3 py-2.5">Contractor Name</th>
                <th className="text-left font-bold px-3 py-2.5 w-28 hidden lg:table-cell">Phone</th>
                <th className="text-left font-bold px-3 py-2.5 w-40 hidden lg:table-cell">Address</th>
                <th className="text-left font-bold px-3 py-2.5 w-20 hidden lg:table-cell">Rating</th>
                <th className="text-left font-bold px-3 py-2.5 w-32">Notes</th>
              </tr>
            </thead>

            <tbody>
              {tradeResults.map(({ trade, contractors }, ti) => {
                const rowBg = ti % 2 === 0 ? "bg-white" : "bg-stone-50/60";
                const slots = Array.from({ length: SLOTS }, (_, i) => contractors[i] ?? null);

                return slots.map((c, si) => {
                  const isFirstSlot = si === 0;
                  const isBlurred = !purchased;
                  const isEmpty = purchased && !c;

                  return (
                    <tr
                      key={`${trade.trade}-${si}`}
                      className={`border-b border-stone-100 ${rowBg} ${
                        isFirstSlot ? "border-t-2 border-t-stone-200" : ""
                      }`}
                    >
                      {/* # — only on first slot, spans 3 rows via visual alignment */}
                      <td className={`px-3 py-2 font-black text-stone-400 ${isFirstSlot ? "" : "border-t-0"}`}>
                        {isFirstSlot ? String(trade.order).padStart(2, "0") : ""}
                      </td>

                      {/* Trade name — only on first slot */}
                      <td className="px-3 py-2 font-semibold text-stone-800 align-top leading-snug">
                        {isFirstSlot ? trade.trade : ""}
                      </td>

                      {/* Category — only on first slot */}
                      <td className="px-3 py-2 hidden md:table-cell align-top">
                        {isFirstSlot ? (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[trade.category] ?? "bg-stone-100 text-stone-600"}`}>
                            {trade.category}
                          </span>
                        ) : null}
                      </td>

                      {/* Budget % — only on first slot */}
                      <td className="px-3 py-2 text-stone-500 hidden md:table-cell align-top">
                        {isFirstSlot ? trade.budgetPctRange : ""}
                      </td>

                      {/* License — only on first slot */}
                      <td className="px-3 py-2 hidden md:table-cell align-top">
                        {isFirstSlot ? (
                          trade.licenseRequired
                            ? <span className="text-rose-600 font-bold">✓ Req.</span>
                            : <span className="text-stone-300">—</span>
                        ) : null}
                      </td>

                      {/* Contractor Name */}
                      <td className="px-3 py-2">
                        {isBlurred ? (
                          <span className="text-stone-200 select-none">██████████████</span>
                        ) : isEmpty ? (
                          <span className="text-stone-300 italic">—</span>
                        ) : c ? (
                          <span className="font-semibold text-stone-900">{c.name}</span>
                        ) : null}
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-2 hidden lg:table-cell">
                        {isBlurred ? (
                          <span className="text-stone-200 select-none">██████████</span>
                        ) : isEmpty ? (
                          <span className="text-stone-200">—</span>
                        ) : c?.phone ? (
                          <a href={`tel:${c.phone.replace(/\D/g, "")}`} className="text-amber-700 hover:text-amber-600 font-medium">
                            {c.phone}
                          </a>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-3 py-2 hidden lg:table-cell text-stone-500 leading-snug">
                        {isBlurred ? (
                          <span className="text-stone-200 select-none">████████████████</span>
                        ) : isEmpty ? (
                          <span className="text-stone-200">—</span>
                        ) : (
                          c?.address || <span className="text-stone-200">—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-3 py-2 hidden lg:table-cell">
                        {isBlurred ? (
                          <span className="text-stone-200 select-none">█████</span>
                        ) : isEmpty ? (
                          <span className="text-stone-200">—</span>
                        ) : c ? (
                          <span>
                            <span className="text-amber-500">{starStr(c.rating)}</span>
                            {c.reviewCount > 0 && (
                              <span className="text-stone-400 ml-1">({c.reviewCount})</span>
                            )}
                          </span>
                        ) : null}
                      </td>

                      {/* Notes — blank line for writing */}
                      <td className="px-3 py-2">
                        {isBlurred ? (
                          <span className="text-stone-200 select-none">████████</span>
                        ) : (
                          <span className="block border-b border-stone-200 h-4 w-full" />
                        )}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>

          {!purchased && (
            <div className="border-t border-stone-200 bg-amber-50 px-5 py-3 text-center">
              <p className="text-xs text-stone-500">
                All contractor rows are hidden —{" "}
                <Link href={`/projects/${id}`} className="text-amber-600 font-semibold hover:underline">
                  Purchase to unlock the full spreadsheet
                </Link>
              </p>
            </div>
          )}
        </div>

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
            Contractor information is sourced from Google Places and provided for reference only. Buildwell LLC does not
            endorse, vet, or guarantee any contractor listed. Always verify licensing, insurance, and references
            independently before executing any contract. Obtain at least 3 competitive bids per trade.
          </p>
        </div>

        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Preferred Vendor List · Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
