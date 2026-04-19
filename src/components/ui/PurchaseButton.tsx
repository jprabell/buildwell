"use client";

import { useState } from "react";

interface PurchaseButtonProps {
  packageType: string;
  projectId: string;
  label: string;
}

export default function PurchaseButton({ packageType, projectId, label }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType, projectId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl transition-colors text-sm"
    >
      {loading ? "Redirecting to checkout..." : label}
    </button>
  );
}
