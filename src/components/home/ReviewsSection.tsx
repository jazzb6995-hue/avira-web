import { MotifDivider } from "@/components/ui/AviraMotif";
import { Star } from "lucide-react";
import { db } from "@/lib/db";

async function getReviews() {
  try {
    return await db.review.findMany({
      where: { status: "APPROVED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { title: true } } },
    });
  } catch {
    return [];
  }
}

export async function ReviewsSection() {
  const reviews = await getReviews();
  const displayReviews = reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS;

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-3">
          Happy Customers
        </p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)]">
          Little Things, Big Smiles
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.slice(0, 3).map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="bg-white border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < (review.rating ?? 5) ? "fill-[var(--color-rose-gold)] text-[var(--color-rose-gold)]" : "text-[var(--color-border)]"}
          />
        ))}
      </div>
      {review.title && (
        <p className="font-medium text-sm mb-2 text-[var(--color-charcoal)]">{review.title}</p>
      )}
      <p className="text-sm text-[var(--color-warm-grey)] leading-relaxed mb-4 line-clamp-4">
        "{review.body}"
      </p>
      <div className="flex items-center justify-between text-xs text-[var(--color-warm-grey)]">
        <span className="font-medium text-[var(--color-charcoal)]">
          {review.guestName ?? review.user?.name ?? "Customer"}
        </span>
        {review.verifiedPurchase && (
          <span className="text-[var(--color-plum)] font-medium">✓ Verified</span>
        )}
      </div>
    </div>
  );
}

const PLACEHOLDER_REVIEWS = [
  { rating: 5, title: "Absolutely beautiful!", body: "I ordered the pearl drop earrings and they are stunning. The packaging was so thoughtful, felt like opening a gift. Will definitely order again.", guestName: "Priya S.", verifiedPurchase: true },
  { rating: 5, title: "Perfect everyday jewellery", body: "Finally found jewellery that doesn't turn my skin green! AVIRA pieces are so delicate and beautiful. The quality is amazing for the price.", guestName: "Ananya M.", verifiedPurchase: true },
  { rating: 5, title: "Gorgeous gift packaging", body: "Bought this as a birthday gift. The packaging alone made my friend squeal with joy. The necklace is even more beautiful in person.", guestName: "Kavya R.", verifiedPurchase: true },
];
