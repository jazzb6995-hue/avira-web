"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  reviewId: string;
}

export function ApproveReviewButton({ reviewId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button onClick={() => update("APPROVED")} disabled={loading}
        className="text-xs bg-green-600 text-white px-3 py-1 hover:bg-green-700 disabled:opacity-50">
        Approve
      </button>
      <button onClick={() => update("REJECTED")} disabled={loading}
        className="text-xs bg-red-500 text-white px-3 py-1 hover:bg-red-600 disabled:opacity-50">
        Reject
      </button>
    </div>
  );
}
