import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90dvh] flex items-center overflow-hidden bg-[var(--color-plum-dark)]">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1573408301185-9519f94c5eb8?w=1600&q=80&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Dark overlay for text legibility */}
      <div
        className="absolute inset-0 bg-[#3c1d2b]/70"
        aria-hidden="true"
      />

      {/* Warm overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-24 md:py-32 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="text-xs tracking-[0.3em] text-white/50 uppercase mb-6">
            New Season · New You
          </p>

          {/* Headline */}
          <h1 className="font-[var(--font-display)] font-light text-white text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6">
            Little Things.
            <br />
            <em>Beautiful You.</em>
          </h1>

          {/* Supporting copy */}
          <p className="text-white/70 text-base md:text-lg max-w-md mb-10 leading-relaxed">
            Jewellery for everyday moments, little celebrations and everything
            in between.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/new-arrivals">
              <Button variant="primary" size="lg" className="bg-white text-[var(--color-plum)] hover:bg-[var(--color-ivory)] tracking-widest">
                Shop New In
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10 tracking-widest">
                Explore Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-ivory)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
