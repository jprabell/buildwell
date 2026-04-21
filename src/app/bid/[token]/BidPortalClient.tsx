"use client";

import { useState } from "react";

interface Props {
  token: string;
  projectName: string;
  contractorName?: string | null;
  tradeName: string;
  tradeDescription: string;
  tradeCategory: string;
  budgetLow: number;
  budgetHigh: number;
  licenseNote: string;
  specs: string[];
  alreadySubmitted: boolean;
}

export default function BidPortalClient({
  token,
  projectName,
  contractorName,
  tradeName,
  tradeDescription,
  budgetLow,
  budgetHigh,
  licenseNote,
  specs,
  alreadySubmitted: initialSubmitted,
}: Props) {
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    licenseNumber: "",
    insuranceInfo: "",
    bidAmount: "",
    startDate: "",
    durationWeeks: "",
    materialsIncluded: "all",
    exclusions: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.bidAmount.replace(/[^0-9.]/g, ""));
    if (!amount || amount <= 0) {
      setErrMsg("Please enter a valid bid amount.");
      return;
    }
    setState("sending");
    setErrMsg("");
    const res = await fetch(`/api/bid/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName:      form.companyName   || undefined,
        licenseNumber:    form.licenseNumber || undefined,
        insuranceInfo:    form.insuranceInfo || undefined,
        bidAmount:        amount,
        startDate:        form.startDate     || undefined,
        durationWeeks:    form.durationWeeks ? parseInt(form.durationWeeks) : undefined,
        materialsIncluded: form.materialsIncluded,
        exclusions:       form.exclusions || undefined,
        notes:            form.notes     || undefined,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const j = await res.json().catch(() => ({}));
      setErrMsg(j.error || "Submission failed — please try again.");
      setState("error");
    }
  }

  function fmt(n: number) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Bid Submitted!</h1>
          <p className="text-stone-500 text-sm mb-1">
            Your bid for <strong className="text-stone-700">{tradeName}</strong> on <strong className="text-stone-700">{projectName}</strong> has been received.
          </p>
          <p className="text-stone-400 text-xs mt-4">The project owner has been notified. They&apos;ll be in touch if your bid is selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </p>
          <p className="text-xs text-stone-400">Contractor Bid Portal · ibuildwell.com</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Intro banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Bid Invitation</p>
          {contractorName && (
            <p className="text-sm text-stone-700 mb-0.5">Hi <strong>{contractorName}</strong>,</p>
          )}
          <p className="text-sm text-stone-700">
            You&apos;ve been invited to submit a bid for the <strong>{tradeName}</strong> scope on <strong>{projectName}</strong>.
            Review the details below and complete the bid form to submit your proposal.
          </p>
        </div>

        {/* Scope */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Scope of Work</p>
          <p className="text-sm text-stone-700 leading-relaxed">{tradeDescription}</p>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Specified Materials &amp; Standards</p>
            <ul className="space-y-1.5">
              {specs.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                  <span className="text-amber-500 shrink-0 mt-0.5">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* License note */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-yellow-800">⚠ Licensing: {licenseNote}</p>
        </div>

        {/* Budget range */}
        {budgetLow > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-600">Owner&apos;s Estimated Budget Range</p>
            <p className="text-base font-black text-amber-700">{fmt(budgetLow)} – {fmt(budgetHigh)}</p>
          </div>
        )}

        {/* Bid form */}
        <form onSubmit={submit} className="bg-white border-2 border-amber-500 rounded-2xl p-6 space-y-4">
          <p className="text-sm font-black text-stone-900 uppercase tracking-wide mb-1">Your Bid Response</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Company Name</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                placeholder="Smith Concrete LLC"
                value={form.companyName}
                onChange={e => update("companyName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">License Number</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                placeholder="State license #"
                value={form.licenseNumber}
                onChange={e => update("licenseNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Insurance Cert / Exp Date</label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                placeholder="MM/DD/YYYY"
                value={form.insuranceInfo}
                onChange={e => update("insuranceInfo", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">
                Base Bid Amount ($) <span className="text-rose-500">*</span>
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none font-bold"
                placeholder="$0"
                required
                value={form.bidAmount}
                onChange={e => update("bidAmount", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Estimated Start Date</label>
              <input
                type="date"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                value={form.startDate}
                onChange={e => update("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Estimated Duration (weeks)</label>
              <input
                type="number"
                min="1"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                placeholder="e.g. 4"
                value={form.durationWeeks}
                onChange={e => update("durationWeeks", e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-2">Materials Included in Bid?</p>
            <div className="flex gap-4 flex-wrap">
              {[
                { val: "all",    label: "All materials included" },
                { val: "labor",  label: "Labor only" },
                { val: "partial", label: "Partial (explain below)" },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="materials"
                    value={opt.val}
                    checked={form.materialsIncluded === opt.val}
                    onChange={() => update("materialsIncluded", opt.val)}
                    className="accent-amber-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Exclusions / Clarifications</label>
            <textarea
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none resize-none"
              rows={3}
              placeholder="List anything NOT included in your bid…"
              value={form.exclusions}
              onChange={e => update("exclusions", e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Additional Notes</label>
            <textarea
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none resize-none"
              rows={2}
              placeholder="References, availability, questions…"
              value={form.notes}
              onChange={e => update("notes", e.target.value)}
            />
          </div>

          {errMsg && <p className="text-sm text-rose-600">{errMsg}</p>}

          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-black py-3 rounded-xl text-sm transition-colors"
          >
            {state === "sending" ? "Submitting…" : "Submit Bid Response →"}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 pb-4">
          Powered by <span className="font-bold text-stone-600">Buildwell</span> · ibuildwell.com
        </p>
      </div>
    </div>
  );
}
