"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--color-plum)] text-white text-center text-xs tracking-widest py-2 px-4">
        FREE SHIPPING ON ORDERS ABOVE ₹500
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[var(--shadow-card)]"
            : "bg-[var(--color-ivory)]"
        )}
      >
        <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Left Nav */}
            <nav className="flex items-center gap-6 flex-1">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs tracking-widest uppercase font-medium transition-colors duration-150",
                    pathname === link.href
                      ? "text-[var(--color-plum)]"
                      : "text-[var(--color-charcoal)] hover:text-[var(--color-plum)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 mx-8"
              aria-label="AVIRA — Home"
            >
              <Image
                src="/logo.png"
                alt="AVIRA"
                width={120}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Right Nav */}
            <nav className="flex items-center gap-6 flex-1 justify-end">
              {NAV_LINKS.slice(5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs tracking-widest uppercase font-medium transition-colors duration-150",
                    pathname === link.href
                      ? "text-[var(--color-plum)]"
                      : "text-[var(--color-charcoal)] hover:text-[var(--color-plum)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Icons */}
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                  className="p-1 hover:text-[var(--color-plum)] transition-colors"
                >
                  <Search size={18} />
                </button>
                <Link href="/account" aria-label="Account" className="p-1 hover:text-[var(--color-plum)] transition-colors">
                  <User size={18} />
                </Link>
                <Link href="/wishlist" aria-label={`Wishlist (${wishlistCount})`} className="p-1 hover:text-[var(--color-plum)] transition-colors relative">
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--color-plum)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={openCart}
                  aria-label={`Cart (${itemCount} items)`}
                  className="p-1 hover:text-[var(--color-plum)] transition-colors relative"
                >
                  <ShoppingBag size={18} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--color-plum)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </div>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between h-14">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="p-2 -ml-2"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/" aria-label="AVIRA — Home" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/logo.png"
                alt="AVIRA"
                width={90}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-2"
              >
                <Search size={20} />
              </button>
              <button
                onClick={openCart}
                aria-label={`Cart (${itemCount})`}
                className="p-2 relative"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[var(--color-plum)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-[var(--color-border)] bg-white">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form
                action="/search"
                method="get"
                className="flex items-center gap-3 border-b border-[var(--color-charcoal)] pb-2"
              >
                <Search size={16} className="text-[var(--color-warm-grey)] flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search earrings, rings, gifts…"
                  className="flex-1 bg-transparent text-sm outline-none text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-grey)]"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="text-[var(--color-warm-grey)]">
                    <X size={14} />
                  </button>
                )}
              </form>
              <p className="text-xs text-[var(--color-warm-grey)] mt-3">Popular: Everyday Earrings, Layered Necklaces, Gifting Sets</p>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <nav
          className={cn(
            "absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white flex flex-col transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <Image src="/logo.png" alt="AVIRA" width={80} height={32} className="h-7 w-auto" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center py-3 text-sm tracking-widest uppercase font-medium border-b border-[var(--color-border)] last:border-0 hover:text-[var(--color-plum)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] p-5 flex gap-4">
            <Link href="/account" className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]">
              <User size={16} /> Account
            </Link>
            <Link href="/wishlist" className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]">
              <Heart size={16} /> Wishlist
              {wishlistCount > 0 && <span className="text-[var(--color-plum)] font-medium">({wishlistCount})</span>}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
