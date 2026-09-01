import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { label: "Earrings", href: "/category/earrings", imageUrl: "/categories/earrings.jpg", tagline: "From studs to drops" },
  { label: "Bracelets", href: "/category/bracelets", imageUrl: "/categories/bracelets.jpg", tagline: "Stack or solo" },
  { label: "Necklaces", href: "/category/necklaces", imageUrl: "/categories/necklaces.jpg", tagline: "Delicate layers" },
  { label: "Rings", href: "/category/rings", imageUrl: "/categories/rings.jpg", tagline: "Little statements" },
  { label: "Sets", href: "/category/sets", imageUrl: "/categories/sets.jpg", tagline: "Perfectly paired" },
];

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-3">
          Find Your Piece
        </p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)]">
          Shop Your Little Thing
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden bg-[var(--color-cream)] aspect-[3/4] md:aspect-[2/3]"
          >
            {/* Placeholder gradient, replace with real image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blush)] to-[var(--color-champagne)] group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="font-[var(--font-display)] text-lg leading-tight">{cat.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{cat.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
