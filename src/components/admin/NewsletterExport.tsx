"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function NewsletterExport() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/export");
      const text = await res.text();
      const blob = new Blob([text], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `avira-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleExport} disabled={loading}
      className="flex items-center gap-2 border border-gray-200 px-3 py-2 text-sm hover:border-gray-400 text-gray-600 disabled:opacity-60">
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      Export CSV
    </button>
  );
}
