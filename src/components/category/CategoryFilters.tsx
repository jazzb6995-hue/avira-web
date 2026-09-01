"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  currentSort: string;
}

const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function CategoryFilters({ currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-xs tracking-widest uppercase text-[var(--color-charcoal)] font-medium mb-3">
          Sort By
        </h3>
        <ul className="space-y-1.5">
          {SORTS.map((s) => (
            <li key={s.value}>
              <button
                onClick={() => setSort(s.value)}
                className={cn(
                  "text-sm text-left transition-colors w-full py-0.5",
                  currentSort === s.value
                    ? "text-[var(--color-plum)] font-medium"
                    : "text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)]"
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs tracking-widest uppercase text-[var(--color-charcoal)] font-medium mb-3">
          Price Range
        </h3>
        <div className="space-y-1.5">
          {[
            { label: "Under ₹500", min: 0, max: 500 },
            { label: "₹500 – ₹999", min: 500, max: 999 },
            { label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
            { label: "₹2,000 & above", min: 2000, max: 99999 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("minPrice", String(r.min));
                params.set("maxPrice", String(r.max));
                params.delete("page");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)] transition-colors w-full text-left py-0.5"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
