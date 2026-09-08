"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AviraMotif } from "@/components/ui/AviraMotif";
import { SITE_NAME, SITE_TAGLINE, WHATSAPP_NUMBER } from "@/lib/constants";
// Instagram SVG (not available in lucide-react v1)
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Earrings", href: "/category/earrings" },
    { label: "Bracelets", href: "/category/bracelets" },
    { label: "Necklaces", href: "/category/necklaces" },
    { label: "Rings", href: "/category/rings" },
    { label: "Sets", href: "/category/sets" },
    { label: "AVIRA Edit", href: "/edit" },
  ],
  help: [
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
    { label: "Jewellery Care", href: "/jewellery-care" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
  about: [
    { label: "About AVIRA", href: "/about" },
    { label: "AVIRA Story", href: "/about#story" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "No Return Policy", href: "/no-return-policy" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-[var(--color-plum)] text-white/80 mt-auto">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <AviraMotif size={20} className="mx-auto mb-4 text-white/70" />
            <h3 className="font-[var(--font-display)] text-2xl md:text-3xl text-white mb-2">
              Little things, beautifully delivered.
            </h3>
            <p className="text-sm text-white/80 mb-6">
              Join the AVIRA family for new arrivals, styling stories and exclusive offers.
            </p>
            {status === "done" ? (
              <p className="text-sm text-white/80 py-3">Thank you for joining! ✨</p>
            ) : (
              <form className="flex gap-0 max-w-sm mx-auto" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/70 text-sm px-4 py-3 outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-white text-[var(--color-plum)] text-xs tracking-widest uppercase font-semibold px-5 py-3 hover:bg-[var(--color-ivory)] transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </form>
            )}
            {status === "error" && <p className="text-xs text-red-300 mt-2">Something went wrong. Please try again.</p>}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              width={110}
              height={44}
              className="h-9 w-auto object-contain brightness-0 invert mb-4"
            />
            <p className="text-xs text-white/50 tracking-widest uppercase mb-4">{SITE_TAGLINE}</p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com/avira"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AVIRA on Instagram"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.102 1.522 5.828L.057 23.804c-.09.356.224.67.58.58l5.976-1.465A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.372l-.359-.214-3.72.912.93-3.641-.234-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white font-medium mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white font-medium mb-4">Help</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white font-medium mb-4">About</h4>
            <ul className="space-y-2.5">
              {footerLinks.about.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Payment icons */}
            <span className="text-xs text-white/70">Secure payments via</span>
            <div className="flex items-center gap-2">
              {["UPI", "Visa", "MC", "RuPay"].map((p) => (
                <span key={p} className="text-[10px] border border-white/20 px-2 py-0.5 text-white/50">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
