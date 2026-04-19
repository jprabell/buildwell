import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SPEC_TIER_ROWS, TIER_COST_SUMMARIES } from "@/lib/specTiers";
import { ProjectAnswers } from "@/types";
import Button from "@/components/ui/Button";
import PrintButton from "../material-list/PrintButton";

function groupByCategory(rows: typeof SPEC_TIER_ROWS) {
  const map = new Map<string, typeof SPEC_TIER_ROWS>();
  for (const row of rows) {
    if (!map.has(row.category)) map.set(row.category, []);
    map.get(row.category)!.push(row);
  }
  return Array.from(map.entries());
}

export default async function SpecTierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const purchased = purchases.includes("spec_tier");

  const categories = groupByCategory(SPEC_TIER_ROWS);
  const totalRows = SPEC_TIER_ROWS.length;

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

      <div className="max-w-6xl mx-auto px-6 py-10 print:py-4 print:px-0">

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
                Good / Better / Best Spec Tier
              </p>
              <h1 className="text-3xl font-black text-stone-900 mb-1">{project.name}</h1>
              <p className="text-stone-500 text-sm">
                Verified material specifications with cost ranges ·{" "}
                {totalRows} categories ·{" "}
                Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-stone-900">{totalRows}</p>
              <p className="text-xs text-stone-400">spec categories</p>
            </div>
          </div>

          {/* Draft banner */}
          {!purchased && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-800">DRAFT PREVIEW — OWNED BY BUILD-WELL LLC</p>
                <p className="text-xs text-amber-600">Purchase to unlock full specs, brand examples, cost ranges, and notes for all categories.</p>
              </div>
              <Link href={`/projects/${id}`}>
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Purchase — $150
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Tier cost summary cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {TIER_COST_SUMMARIES.map((tier) => (
            <div key={tier.label} className={`rounded-2xl border p-5 ${tier.bgClass}`}>
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${tier.colorClass}`}>
                {tier.label}
              </p>
              <p className={`text-2xl font-black mb-1 ${tier.colorClass}`}>{tier.perSqftRange}</p>
              <p className="text-xs text-stone-500 mb-3">{tier.totalRangeNote}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{tier.description}</p>
            </div>
          ))}
        </div>

        {/* Category sections */}
        {categories.map(([categoryName, rows], catIdx) => (
          <div key={categoryName} className="mb-10 print:mb-6 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full">
                {String(catIdx + 1).padStart(2, "0")}
              </span>
              <h2 className="text-lg font-black text-stone-900">{categoryName}</h2>
            </div>

            {rows.map((row, rowIdx) => {
              const isBlurred = !purchased && (catIdx > 1 || (catIdx === 1 && rowIdx > 0));
              return (
                <div
                  key={row.subcategory}
                  className={`mb-4 bg-white border border-stone-200 rounded-2xl overflow-hidden ${
                    isBlurred ? "opacity-25 select-none pointer-events-none" : ""
                  }`}
                >
                  <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
                    <h3 className="font-bold text-stone-800 text-sm">{row.subcategory}</h3>
                  </div>

                  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                    {(["good", "better", "best"] as const).map((tier) => {
                      const t = row[tier];
                      const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
                      const tierColors: Record<string, string> = {
                        good: "text-slate-600 bg-slate-50",
                        better: "text-amber-700 bg-amber-50",
                        best: "text-emerald-700 bg-emerald-50",
                      };
                      return (
                        <div key={tier} className="p-5">
                          <div className={`inline-block text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${tierColors[tier]}`}>
                            {tierLabel}
                          </div>

                          <p className="text-sm font-semibold text-stone-900 mb-2 leading-snug">
                            {isBlurred ? "████████████████████" : t.spec}
                          </p>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex gap-1.5">
                              <span className="text-stone-400 w-16 shrink-0">Brands</span>
                              <span className="text-stone-600 font-medium">
                                {isBlurred ? "████████████" : t.brandExamples}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              <span className="text-stone-400 w-16 shrink-0">Cost</span>
                              <span className="font-bold text-stone-800">
                                {isBlurred ? "██████" : t.costRange}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              <span className="text-stone-400 w-16 shrink-0">Warranty</span>
                              <span className="text-stone-600">
                                {isBlurred ? "█████████" : t.warranty}
                              </span>
                            </div>
                            {t.notes && !isBlurred && (
                              <p className="text-stone-400 italic mt-2 leading-relaxed pt-1 border-t border-stone-100">
                                {t.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Disclaimer */}
        <div className="bg-stone-100 rounded-2xl p-5 mt-6 print:mt-4">
          <p className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Disclaimer</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Cost ranges are estimates based on national averages (RSMeans 2024, National Estimator) and may vary
            significantly by region, labor market, material availability, and project complexity. Always obtain
            3 competitive bids from licensed contractors. Build-Well LLC makes no warranty as to pricing accuracy.
            Specifications are informational only and do not constitute engineering plans or construction documents.
          </p>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-6 border-t pt-4 text-center text-xs text-stone-400">
          Generated by Buildwell · ibuildwell.com · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
