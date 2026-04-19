import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { getTradesForStructure } from "@/lib/contractorTrades";
import { ProjectAnswers } from "@/types";
import { StructureType } from "@/types";
import Button from "@/components/ui/Button";

const CATEGORY_COLORS: Record<string, string> = {
  Civil: "bg-amber-100 text-amber-800",
  Structural: "bg-blue-100 text-blue-800",
  Envelope: "bg-emerald-100 text-emerald-800",
  MEP: "bg-purple-100 text-purple-800",
  Interior: "bg-rose-100 text-rose-800",
  Design: "bg-slate-100 text-slate-800",
};

export default async function ContractorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const zipCode = (answers.zipCode as string) || "";
  const state = (answers.state as string) || "";

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const trades = getTradesForStructure(project.structureType as StructureType);

  const hasZip = zipCode.trim().length === 5;

  function searchUrl(keywords: string) {
    const location = hasZip ? zipCode : state || "near me";
    return `https://www.google.com/search?q=${encodeURIComponent(`${keywords} ${location}`)}`;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <Link href={`/projects/${id}`}>
            <Button variant="ghost" size="sm">← Project</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            Preferred Vendor List
          </p>
          <h1 className="text-3xl font-black text-stone-900 mb-1">{project.name}</h1>
          <p className="text-stone-500 text-sm">
            {structure?.label} · {trades.length} trades in build sequence
            {hasZip ? ` · Searching near ${zipCode}` : " · Add ZIP code to your project for location-specific searches"}
          </p>
        </div>

        {/* ZIP code notice if missing */}
        {!hasZip && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">No ZIP Code on file</p>
              <p className="text-xs text-amber-700">
                Add your build site ZIP code in your project answers to get location-based contractor searches.
                Without it, searches will use your state or "near me."
              </p>
            </div>
            <Link href={`/design?edit=${id}`} className="shrink-0">
              <button className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Add ZIP Code
              </button>
            </Link>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
            <span key={cat} className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* Trades table */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-200 grid grid-cols-12 px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Trade</span>
            <span className="col-span-4 hidden md:block">Description</span>
            <span className="col-span-2 hidden md:block">Est. Budget %</span>
            <span className="col-span-2 text-right">Find Contractor</span>
          </div>

          {trades.map((trade, i) => (
            <div
              key={trade.trade}
              className={`grid grid-cols-12 items-start px-5 py-4 gap-2 ${
                i < trades.length - 1 ? "border-b border-stone-100" : ""
              }`}
            >
              {/* Order */}
              <div className="col-span-1">
                <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 text-xs font-black flex items-center justify-center">
                  {trade.order}
                </span>
              </div>

              {/* Trade name + category + license */}
              <div className="col-span-5 md:col-span-3">
                <p className="font-bold text-stone-900 text-sm">{trade.trade}</p>
                <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[trade.category] ?? "bg-stone-100 text-stone-600"}`}>
                  {trade.category}
                </span>
                {trade.licenseRequired && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">⚠ License required</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-12 md:col-span-4 text-xs text-stone-500 leading-relaxed">
                <p className="md:hidden font-semibold text-stone-700 text-xs mb-0.5">{trade.description}</p>
                <p className="hidden md:block">{trade.description}</p>
                <p className="text-stone-400 mt-1 italic">{trade.licenseNote}</p>
              </div>

              {/* Budget % */}
              <div className="col-span-4 md:col-span-2 hidden md:flex items-center">
                <span className="text-sm font-bold text-stone-700">{trade.budgetPctRange}</span>
              </div>

              {/* Find button */}
              <div className="col-span-6 md:col-span-2 flex justify-end">
                <a
                  href={searchUrl(trade.searchKeywords)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                >
                  Find Near {hasZip ? zipCode : (state || "Me")}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-black text-stone-900 mb-2">Get 3 Bids</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Always get at least 3 competitive bids for each trade. Prices can vary 30–50% for the same work.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-black text-stone-900 mb-2">Verify Licenses</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Check your state contractor licensing board online before signing. Ask for proof of liability insurance and workers' comp.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-black text-stone-900 mb-2">Sequence Matters</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Trades above are listed in build sequence. Don't schedule finish work before rough inspections pass or you'll have to redo work.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-stone-400 mt-6 text-center">
          Contractor search links go to Google. Buildwell does not endorse or vet any specific contractor.
          Always verify licensing, insurance, and references independently.
        </p>
      </div>
    </div>
  );
}
