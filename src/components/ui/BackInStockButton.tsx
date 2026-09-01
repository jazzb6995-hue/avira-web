"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

interface Props {
  productId: string;
  variantId?: string;
}

export function BackInStockButton({ productId, variantId }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { setError("Enter a valid email."); return; }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/back-in-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId, variantId }),
      });
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full border border-[var(--color-plum)] text-[var(--color-plum)] py-3 text-xs uppercase tracking-widest hover:bg-[var(--color-blush)] transition-colors"
      >
        <Bell size={14} />
        Notify Me When Back in Stock
      </button>
    );
  }

  return (
    <div className="border border-[var(--color-plum)] p-4">
      {done ? (
        <p className="text-sm text-[var(--color-plum)] text-center">
          You're on the list! We'll email you when it's back.
        </p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-warm-grey)] mb-3">Enter your email and we'll notify you the moment it's back.</p>
          <form onSubmit={handleNotify} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
              className="flex-1 border border-[var(--color-warm-grey-light)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-plum)] bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-plum)] text-white px-4 py-2 text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "…" : "Notify"}
            </button>
          </form>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
