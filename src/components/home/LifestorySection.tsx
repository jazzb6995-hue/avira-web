import Link from "next/link";
import Image from "next/image";

export function LifestorySection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="relative overflow-hidden bg-[var(--color-plum)] min-h-[380px] md:min-h-[520px] flex items-end">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&auto=format&fit=crop"
          alt="Colourful gemstone jewellery laid out on a bright background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Colour wash + legibility overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#54283C]/90 via-[#6b3450]/80 to-[#3c1d2b]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative z-10 p-8 md:p-16 max-w-xl">
          <p className="text-xs tracking-[0.3em] text-white/80 uppercase mb-4">
            A Little Colour
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Jewellery for brighter days.
          </h2>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-sm">
            Colour doesn't need an occasion. Neither does beautiful jewellery.
            From sunlit citrine to deep sapphire blue, every piece in this
            edit is picked to catch the light and lift your everyday look.
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
