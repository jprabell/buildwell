"use client";

import { useState } from "react";

interface Props {
  projectId: string;
  tradeName: string;
  tradeDescription: string;
  tradeCategory: string;
  budgetLow: number;
  budgetHigh: number;
  licenseNote: string;
}

export default function SendBidButton({
  projectId,
  tradeName,
  tradeDescription,
  tradeCategory,
  budgetLow,
  budgetHigh,
  licenseNote,
}: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function send() {
    if (!email.includes("@")) { setErrMsg("Enter a valid email address."); return; }
    setState("sending");
    setErrMsg("");
    const res = await fetch(`/api/projects/${projectId}/send-bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractorEmail: email,
        contractorName:  name,
        tradeName,
        tradeDescription,
        tradeCategory,
        budgetLow,
        budgetHigh,
        licenseNote,
      }),
    });
    if (res.ok) {
      setState("sent");
      setTimeout(() => { setState("idle"); setOpen(false); setEmail(""); setName(""); }, 3000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErrMsg(j.error || "Failed to send. Try again.");
      setState("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 transition-colors"
      >
        ✉ Email to Contractor
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-black text-stone-900 mb-1">Email Bid Request</h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Send the <span className="font-semibold text-stone-700">{tradeName}</span> scope, specs, and bid form directly to a contractor.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Contractor Name (optional)</label>
                <input
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                  placeholder="e.g. Smith Concrete LLC"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Contractor Email *</label>
                <input
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
                  placeholder="contractor@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                />
              </div>
            </div>

            {errMsg && <p className="text-xs text-rose-600 mb-3">{errMsg}</p>}

            <div className="flex gap-2">
              <button
                onClick={send}
                disabled={state === "sending" || state === "sent"}
                className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-all ${
                  state === "sent"
                    ? "bg-green-600 text-white"
                    : "bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-60"
                }`}
              >
                {state === "sending" ? "Sending…" : state === "sent" ? "✓ Sent!" : "Send Bid Request"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
