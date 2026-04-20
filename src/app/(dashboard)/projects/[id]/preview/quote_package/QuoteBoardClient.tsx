"use client";

import { useState, useTransition, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuoteTrade {
  trade: string;
  category: string;
  budgetLow: number;
  budgetHigh: number;
}

export interface ContractorQuote {
  name: string;
  amount: string;  // raw input — may include "$" and commas
  duration: string;
  notes: string;
}

export type QuoteMap = Record<string, [ContractorQuote, ContractorQuote, ContractorQuote]>;

const EMPTY_QUOTE: ContractorQuote = { name: "", amount: "", duration: "", notes: "" };

function emptySlots(): [ContractorQuote, ContractorQuote, ContractorQuote] {
  return [{ ...EMPTY_QUOTE }, { ...EMPTY_QUOTE }, { ...EMPTY_QUOTE }];
}

function parseMoney(s: string): number {
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function fmtMoney(n: number): string {
  if (!n) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}

const CATEGORY_COLORS: Record<string, string> = {
  Civil:      "bg-amber-100 text-amber-800",
  Structural: "bg-blue-100 text-blue-800",
  Envelope:   "bg-emerald-100 text-emerald-800",
  MEP:        "bg-purple-100 text-purple-800",
  Interior:   "bg-rose-100 text-rose-800",
  Design:     "bg-slate-100 text-slate-800",
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  projectId: string;
  trades: QuoteTrade[];
  initialQuotes: QuoteMap;
  contractorNames: [string, string, string];
}

export default function QuoteBoardClient({
  projectId,
  trades,
  initialQuotes,
  contractorNames: initialNames,
}: Props) {
  const [quotes, setQuotes] = useState<QuoteMap>(() => {
    const map: QuoteMap = {};
    for (const t of trades) {
      map[t.trade] = initialQuotes[t.trade] ?? emptySlots();
    }
    return map;
  });

  const [names, setNames] = useState<[string, string, string]>(initialNames);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  const save = useCallback((newQuotes: QuoteMap, newNames: [string, string, string]) => {
    setSaved(false);
    startTransition(async () => {
      await fetch(`/api/projects/${projectId}/quotes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotes: newQuotes, contractorNames: newNames }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }, [projectId]);

  function updateQuote(trade: string, slot: 0 | 1 | 2, field: keyof ContractorQuote, value: string) {
    setQuotes(prev => {
      const next = { ...prev };
      const slots = [...next[trade]] as [ContractorQuote, ContractorQuote, ContractorQuote];
      slots[slot] = { ...slots[slot], [field]: value };
      next[trade] = slots;
      return next;
    });
  }

  function updateName(i: 0 | 1 | 2, value: string) {
    setNames(prev => {
      const n: [string, string, string] = [...prev] as [string, string, string];
      n[i] = value;
      return n;
    });
  }

  // ── Compute totals ─────────────────────────────────────────────────────────
  const totals: [number, number, number] = [0, 1, 2].map(si =>
    trades.reduce((sum, t) => sum + parseMoney(quotes[t.trade]?.[si]?.amount ?? ""), 0)
  ) as [number, number, number];

  const bestTotal = Math.min(...totals.filter(t => t > 0));

  return (
    <div>
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-2">
        <div className="bg-stone-800 text-white px-5 py-3 flex items-center justify-between">
          <div>
            <p className="font-black text-sm">Bid Comparison Board</p>
            <p className="text-xs text-stone-400 mt-0.5">Enter bids as you receive them · All figures save automatically</p>
          </div>
          <button
            onClick={() => save(quotes, names)}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors shrink-0"
          >
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>

        {/* Contractor name headers */}
        <div className="grid grid-cols-[200px_1fr_1fr_1fr] border-b border-stone-200 bg-stone-50">
          <div className="px-4 py-2 text-xs font-bold text-stone-500 uppercase tracking-wide border-r border-stone-100 flex items-center">
            Trade
          </div>
          {([0, 1, 2] as const).map(si => (
            <div key={si} className="px-3 py-2 border-r border-stone-100 last:border-0">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                Contractor {String.fromCharCode(65 + si)}
              </p>
              <input
                className="w-full text-xs font-bold text-stone-800 bg-transparent border-b border-stone-300 focus:border-amber-500 outline-none pb-0.5 placeholder-stone-300"
                placeholder={`Contractor ${String.fromCharCode(65 + si)} name`}
                value={names[si]}
                onChange={e => updateName(si, e.target.value)}
                onBlur={() => save(quotes, names)}
              />
            </div>
          ))}
        </div>

        {/* Trade rows */}
        {trades.map((trade, ti) => {
          const rowQuotes = quotes[trade.trade];
          const amounts = ([0, 1, 2] as const).map(si => parseMoney(rowQuotes?.[si]?.amount ?? ""));
          const rowBest = Math.min(...amounts.filter(a => a > 0));

          return (
            <div
              key={trade.trade}
              className={`grid grid-cols-[200px_1fr_1fr_1fr] border-b border-stone-100 last:border-0 ${
                ti % 2 === 1 ? "bg-stone-50/40" : ""
              }`}
            >
              {/* Trade label */}
              <div className="px-4 py-3 border-r border-stone-100">
                <p className="text-xs font-bold text-stone-800 leading-tight mb-1">{trade.trade}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[trade.category] ?? "bg-stone-100 text-stone-600"}`}>
                  {trade.category}
                </span>
                {trade.budgetLow > 0 && (
                  <p className="text-[9px] text-stone-400 mt-1">
                    Est. {fmtMoney(trade.budgetLow)}–{fmtMoney(trade.budgetHigh)}
                  </p>
                )}
              </div>

              {/* Contractor cells */}
              {([0, 1, 2] as const).map(si => {
                const q = rowQuotes?.[si] ?? EMPTY_QUOTE;
                const amt = parseMoney(q.amount);
                const isBest = amt > 0 && amt === rowBest && amounts.filter(a => a > 0).length > 1;

                return (
                  <div
                    key={si}
                    className={`px-3 py-2 border-r border-stone-100 last:border-0 space-y-1.5 ${
                      isBest ? "bg-green-50" : ""
                    }`}
                  >
                    {isBest && (
                      <span className="text-[9px] font-black text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                        ✓ Low Bid
                      </span>
                    )}
                    <input
                      className="w-full text-xs font-bold text-stone-900 bg-transparent border-b border-stone-200 focus:border-amber-500 outline-none pb-0.5 placeholder-stone-300"
                      placeholder="$0"
                      value={q.amount}
                      onChange={e => updateQuote(trade.trade, si, "amount", e.target.value)}
                      onBlur={() => save(quotes, names)}
                    />
                    <input
                      className="w-full text-[10px] text-stone-500 bg-transparent border-b border-stone-100 focus:border-amber-400 outline-none pb-0.5 placeholder-stone-300"
                      placeholder="weeks"
                      value={q.duration}
                      onChange={e => updateQuote(trade.trade, si, "duration", e.target.value)}
                      onBlur={() => save(quotes, names)}
                    />
                    <input
                      className="w-full text-[10px] text-stone-400 bg-transparent border-b border-stone-100 focus:border-amber-400 outline-none pb-0.5 placeholder-stone-300"
                      placeholder="notes"
                      value={q.notes}
                      onChange={e => updateQuote(trade.trade, si, "notes", e.target.value)}
                      onBlur={() => save(quotes, names)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Totals row */}
        <div className="grid grid-cols-[200px_1fr_1fr_1fr] border-t-2 border-stone-300 bg-stone-50">
          <div className="px-4 py-3 border-r border-stone-200">
            <p className="text-xs font-black text-stone-800 uppercase tracking-wide">Total Bid</p>
          </div>
          {([0, 1, 2] as const).map(si => {
            const total = totals[si];
            const isBest = total > 0 && total === bestTotal && totals.filter(t => t > 0).length > 1;
            return (
              <div
                key={si}
                className={`px-3 py-3 border-r border-stone-200 last:border-0 ${isBest ? "bg-green-50" : ""}`}
              >
                <p className={`text-sm font-black ${isBest ? "text-green-700" : "text-stone-900"}`}>
                  {fmtMoney(total)}
                </p>
                {isBest && <p className="text-[9px] font-bold text-green-600 mt-0.5">Lowest Total</p>}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-stone-400 text-center">
        Tip: Enter bids as you receive them. Low bids are highlighted automatically. All data is saved to your project.
      </p>
    </div>
  );
}
