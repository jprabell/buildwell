"use client";

import { useState } from "react";
import Link from "next/link";

interface Package {
  id: string;
  icon: string;
  title: string;
  price: string;
  priceNum: number; // dollars
  badge: string | null;
  includes: string[];
  viewPath: string;
}

interface PackagesSectionProps {
  packages: Package[];
  purchases: string[];
  projectId: string;
}

export default function PackagesSection({ packages, purchases, projectId }: PackagesSectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const unpurchased = packages.filter((p) => !purchases.includes(p.id));
  const totalSelected = [...selected].reduce((sum, id) => {
    const pkg = packages.find((p) => p.id === id);
    return sum + (pkg?.priceNum ?? 0);
  }, 0);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleCheckout(packageTypes: string[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageTypes, projectId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert("Checkout failed. Please try again.");
      }
    } catch {
      setLoading(false);
      alert("Checkout failed. Please try again.");
    }
  }

  return (
    <div>
      {/* Cart bar — shown when ≥1 item selected */}
      {selected.size > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-amber-900 text-sm">
              {selected.size} item{selected.size > 1 ? "s" : ""} selected
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              {[...selected].map((id) => packages.find((p) => p.id === id)?.title).filter(Boolean).join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-amber-800">${totalSelected}</span>
            <button
              onClick={() => handleCheckout([...selected])}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              {loading ? "Redirecting..." : `Buy ${selected.size > 1 ? "All Selected" : "Selected"} →`}
            </button>
          </div>
        </div>
      )}

      {/* Select All / Deselect All (only shown if there are unpurchased items) */}
      {unpurchased.length > 1 && (
        <div className="flex items-center gap-4 mb-4">
          <p className="text-xs text-stone-400">Quick select:</p>
          <button
            onClick={() => setSelected(new Set(unpurchased.map((p) => p.id)))}
            className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors"
          >
            Select all ({unpurchased.length})
          </button>
          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs font-semibold text-stone-400 hover:text-stone-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Package grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const purchased = purchases.includes(pkg.id);
          const isSelected = selected.has(pkg.id);

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col transition-all ${
                purchased
                  ? "border-green-300 shadow-sm"
                  : isSelected
                  ? "border-amber-400 shadow-md ring-1 ring-amber-300"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{pkg.icon}</span>
                <div className="flex items-center gap-2">
                  {pkg.badge && !purchased && (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                  {purchased && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Purchased
                    </span>
                  )}
                  {!purchased && (
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(pkg.id)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs text-stone-400 font-medium">Select</span>
                    </label>
                  )}
                </div>
              </div>

              <h3 className="font-black text-stone-900 mb-1">{pkg.title}</h3>
              <p className="text-2xl font-black text-amber-600 mb-4">{pkg.price}</p>

              <ul className="space-y-1.5 text-xs text-stone-500 mb-6 flex-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>

              {purchased ? (
                <Link href={pkg.viewPath}>
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    View Document
                  </button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleCheckout([pkg.id])}
                    disabled={loading}
                    className={`w-full font-bold py-3 rounded-xl transition-colors text-sm ${
                      isSelected
                        ? "bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-amber-600 hover:bg-amber-500 text-white"
                    } disabled:bg-amber-300`}
                  >
                    {loading ? "Redirecting..." : `Purchase — ${pkg.price}`}
                  </button>
                  <Link href={pkg.viewPath}>
                    <button className="w-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium py-2 rounded-xl transition-colors text-sm">
                      Preview Free (watermarked)
                    </button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
