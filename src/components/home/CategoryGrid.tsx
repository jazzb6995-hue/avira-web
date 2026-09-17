import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { label: "Earrings", href: "/category/earrings", imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80&auto=format&fit=crop", tagline: "From studs to drops" },
  { label: "Bracelets", href: "/category/bracelets", imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80&auto=format&fit=crop", tagline: "Stack or solo" },
  { label: "Necklaces", href: "/category/necklaces", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80&auto=format&fit=crop", tagline: "Delicate layers" },
  { label: "Rings", href: "/category/rings", imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&q=80&auto=format&fit=crop", tagline: "Little statements" },
  { label: "Sets", href: "/category/sets", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80&auto=format&fit=crop", tagline: "Perfectly paired" },
];

export function CategoryGrid() {
  return (
    <section className="pt-8 md:pt-10 pb-12 md:pb-16 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
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
            <Image
              src={cat.imageUrl}
              alt={cat.label}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
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
