"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  reviewId: string;
  status: string;
}

export function ReviewActions({ reviewId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (status === "APPROVED") {
    return (
      <button onClick={() => updateStatus("REJECTED")} disabled={loading}
        className="text-xs text-red-500 hover:underline flex items-center gap-1">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Reject
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={() => updateStatus("APPROVED")} disabled={loading}
        className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 hover:bg-green-700">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Approve
      </button>
      <button onClick={() => updateStatus("REJECTED")} disabled={loading}
        className="flex items-center gap-1 text-xs border border-red-200 text-red-500 px-2 py-1 hover:bg-red-50">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Reject
      </button>
    </div>
  );
}
