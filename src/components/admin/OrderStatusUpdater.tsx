"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const STATUSES = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber, carrier, note }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-plum)]"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
        ))}
      </select>
      {status === "SHIPPED" && (
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Carrier (e.g. Delhivery)" value={carrier} onChange={(e) => setCarrier(e.target.value)}
            className="border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-plum)]" />
          <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
            className="border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-plum)]" />
        </div>
      )}
      <input type="text" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)}
        className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-plum)]" />
      <Button variant="primary" size="sm" onClick={handleUpdate} loading={loading}>Update Status</Button>
    </div>
  );
}
