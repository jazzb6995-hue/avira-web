"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Search } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || q.length < 2) { setResults({ products: [], categories: [] }); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(setResults)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">
          {q ? `Search: "${q}"` : "Search"}
        </h1>
        {!loading && q && (
          <p className="text-[var(--color-warm-grey)] text-sm mt-2">
            {results.products.length} {results.products.length === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {!q && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-[var(--color-warm-grey-light)] mb-4" />
          <p className="text-[var(--color-warm-grey)]">Start typing to search for jewellery</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--color-plum)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && q && results.products.length === 0 && (
        <div className="text-center py-16">
          <p className="font-[var(--font-display)] text-xl mb-2">No results for "{q}"</p>
          <p className="text-sm text-[var(--color-warm-grey)] mb-6">Try searching for earrings, bracelets, or necklaces</p>
          <Link href="/new-arrivals" className="text-[var(--color-plum)] underline text-sm">Browse all new arrivals</Link>
        </div>
      )}

      {results.categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {results.categories.map((cat: any) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}
                className="border border-[var(--color-plum)] text-[var(--color-plum)] text-xs px-4 py-2 hover:bg-[var(--color-blush)] transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {results.products.map((product: any, i: number) => (
            <ProductCard key={product.id} product={{ ...product, isNewArrival: false, isBestSeller: false }} priority={i < 8} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
