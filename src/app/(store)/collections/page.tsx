import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { MotifDivider } from "@/components/ui/AviraMotif";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections | AVIRA",
  description: "Explore all AVIRA jewellery collections.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    collections = await db.collection.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch { /* DB not connected */ }

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-5xl">Collections</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-3">Each collection tells a story. Find yours.</p>
      </div>

      {collections.length === 0 ? (
        <p className="text-center text-[var(--color-warm-grey)] py-16">Collections coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col: any) => (
            <Link key={col.id} href={`/collections/${col.slug}`}
              className="group relative overflow-hidden aspect-[4/5] bg-[var(--color-cream)] block">
              {col.imageUrl && (
                <Image src={col.imageUrl} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="font-[var(--font-display)] text-2xl">{col.name}</h2>
                {col.description && <p className="text-xs text-white/80 mt-1">{col.description}</p>}
                <p className="text-xs text-white/60 mt-1">{col._count.products} pieces</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
