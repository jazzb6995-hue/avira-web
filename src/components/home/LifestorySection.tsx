import Link from "next/link";

export function LifestorySection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="relative overflow-hidden bg-[var(--color-plum)] min-h-[320px] md:min-h-[480px] flex items-end">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#54283C] via-[#6b3450] to-[#3c1d2b]" />

        <div className="relative z-10 p-8 md:p-16 max-w-xl">
          <p className="text-xs tracking-[0.3em] text-white/50 uppercase mb-4">
            A Little Colour
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Jewellery for brighter days.
          </h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed max-w-sm">
            Colour doesn't need an occasion. Neither does beautiful jewellery.
          </p>
          <Link
            href="/collections"
            className="inline-block text-xs tracking-widest uppercase text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
