import Link from "next/link";

export function AviraStory() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-[var(--color-ivory-dark)]">
      <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Decorative side */}
        <div className="flex-1 relative min-h-[240px] md:min-h-[360px] bg-[var(--color-blush)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blush)] to-[var(--color-champagne)]" />
          <div className="absolute bottom-6 right-6 text-[var(--color-plum)]/20">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="20" rx="7.5" ry="18" fill="currentColor" />
              <ellipse cx="40" cy="60" rx="7.5" ry="18" fill="currentColor" />
              <ellipse cx="20" cy="40" rx="18" ry="7.5" fill="currentColor" />
              <ellipse cx="60" cy="40" rx="18" ry="7.5" fill="currentColor" />
              <circle cx="40" cy="40" r="7" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 max-w-xl">
          <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-4">
            The AVIRA Story
          </p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)] mb-6 leading-tight">
            Beautiful doesn't have to wait for an occasion.
          </h2>
          <p className="text-[var(--color-warm-grey)] text-sm leading-relaxed mb-4">
            AVIRA was born from a simple belief — that beautiful, thoughtfully designed jewellery
            should be part of everyday life. Not reserved for special occasions. Not saved for
            someone else's approval.
          </p>
          <p className="text-[var(--color-warm-grey)] text-sm leading-relaxed mb-8">
            Each piece is designed to feel like a little celebration — for the moments that matter
            and the ordinary Tuesday afternoons that deserve to feel special too.
          </p>
          <Link
            href="/about"
            className="inline-block text-xs tracking-widest uppercase border-b border-[var(--color-charcoal)] pb-0.5 hover:text-[var(--color-plum)] hover:border-[var(--color-plum)] transition-colors"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
