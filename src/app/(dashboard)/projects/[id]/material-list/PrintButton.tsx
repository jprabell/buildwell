"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
    >
      Print / Export PDF
    </button>
  );
}
