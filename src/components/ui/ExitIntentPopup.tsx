"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { AviraMotif } from "./AviraMotif";

const STORAGE_KEY = "avira_exit_intent_shown";
const COOLDOWN_DAYS = 7;

function hasRecentlyShown(): boolean {
  try {
    const ts = localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    const diff = Date.now() - Number(ts);
    return diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markShown() {
  try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
}

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (hasRecentlyShown()) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      // Desktop: trigger on mouse leaving towards top of viewport
      const handleMouseOut = (e: MouseEvent) => {
        if (triggered.current) return;
        if (e.clientY <= 10 && e.relatedTarget === null) {
          triggered.current = true;
          setVisible(true);
          markShown();
        }
      };
      document.addEventListener("mouseleave", handleMouseOut);
      return () => document.removeEventListener("mouseleave", handleMouseOut);
    } else {
      // Mobile: trigger on idle (30s) or scroll reversal
      let lastScrollY = window.scrollY;
      let scrollUpCount = 0;

      const handleScroll = () => {
        if (triggered.current) return;
        const currentY = window.scrollY;
        if (currentY < lastScrollY && currentY > 200) {
          scrollUpCount++;
          if (scrollUpCount >= 3) {
            triggered.current = true;
            setVisible(true);
            markShown();
          }
        } else {
          scrollUpCount = 0;
        }
        lastScrollY = currentY;
      };

      const idleTimer = setTimeout(() => {
        if (!triggered.current) {
          triggered.current = true;
          setVisible(true);
          markShown();
        }
      }, 30000);

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(idleTimer);
      };
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { setError("Enter a valid email."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent" }),
      });
      if (res.ok) { setSubmitted(true); }
      else { setError("Something went wrong. Try again."); }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(44, 37, 33, 0.55)", backdropFilter: "blur(2px)" }}
    >
      <div className="relative bg-[var(--color-ivory)] w-full max-w-md overflow-hidden shadow-2xl">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)] z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          <AviraMotif size={28} className="mx-auto mb-4" />

          {submitted ? (
            <>
              <h2 className="font-[var(--font-display)] text-2xl mb-2">Welcome to AVIRA</h2>
              <p className="text-sm text-[var(--color-warm-grey)]">
                Thank you for joining. Watch your inbox for something beautiful.
              </p>
              <button
                onClick={() => setVisible(false)}
                className="mt-6 text-xs uppercase tracking-widest text-[var(--color-plum)] underline"
              >
                Continue shopping
              </button>
            </>
          ) : (
            <>
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl mb-2 leading-snug">
                Wait, a little gift for you
              </h2>
              <p className="text-sm text-[var(--color-warm-grey)] mb-1">
                Get <span className="font-semibold text-[var(--color-charcoal)]">10% off your first order</span> when you join our world.
              </p>
              <p className="text-xs text-[var(--color-warm-grey)] mb-6">New arrivals, styling notes, and stories from AVIRA.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-[var(--color-warm-grey-light)] px-3 py-2.5 text-sm text-center focus:outline-none focus:border-[var(--color-plum)] bg-white"
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-plum)] text-[var(--color-ivory)] py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? "Claiming…" : "Claim My 10% Off"}
                </button>
              </form>

              <button
                onClick={() => setVisible(false)}
                className="mt-4 text-xs text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)]"
              >
                No thanks, I'll pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
