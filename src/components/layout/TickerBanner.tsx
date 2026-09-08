"use client";

import { useEffect, useRef } from "react";

const TICKER_ITEMS = [
  "Free shipping on orders above ₹500",
  "Handcrafted with love in India",
  "New arrivals every week",
  "Gift wrapping available on all orders",
  "100% authentic materials",
  "Easy exchanges within 7 days",
  "Secure payments via UPI, Visa, RuPay",
  "Free shipping on orders above ₹500",
  "Handcrafted with love in India",
  "New arrivals every week",
  "Gift wrapping available on all orders",
  "100% authentic materials",
  "Easy exchanges within 7 days",
  "Secure payments via UPI, Visa, RuPay",
];

export function TickerBanner() {
  return (
    <div className="bg-[var(--color-plum)] text-white overflow-hidden py-2 select-none">
      <div className="ticker-track flex gap-0">
        {TICKER_ITEMS.map((item, i) => (
          <span
            key={i}
            className="ticker-item flex-shrink-0 text-xs tracking-widest uppercase px-10 text-white/90"
          >
            <span className="inline-block mr-10 text-white/40">✦</span>
            {item}
          </span>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 38s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
