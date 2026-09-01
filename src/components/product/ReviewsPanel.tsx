"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  guestName?: string | null;
  user?: { name: string | null } | null;
  verifiedPurchase: boolean;
  createdAt: Date;
}

interface Props {
  reviews: Review[];
  avgRating: number;
  productId: string;
}

export function ReviewsPanel({ reviews, avgRating, productId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!formBody || formBody.length < 10) { setSubmitError("Review must be at least 10 characters."); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: formRating, title: formTitle || undefined, body: formBody }),
      });
      if (res.ok) { setSubmitted(true); setShowForm(false); }
      else { const j = await res.json(); setSubmitError(j.error ?? "Submit failed."); }
    } catch { setSubmitError("Network error."); }
    finally { setSubmitting(false); }
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-[var(--font-display)] text-2xl mb-1">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(avgRating) ? "fill-[var(--color-rose-gold)] text-[var(--color-rose-gold)]" : "text-[var(--color-border)]"}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--color-warm-grey)]">
                {avgRating.toFixed(1)} out of 5 · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
        <Button variant="plum-outline" size="sm" onClick={() => setShowForm(!showForm)}>
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {submitted && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 mb-6">
          Thank you! Your review is pending moderation and will appear shortly.
        </div>
      )}
      {showForm && (
        <form
          className="bg-[var(--color-cream)] p-6 mb-8 space-y-4"
          onSubmit={handleSubmitReview}
        >
          <h3 className="font-[var(--font-display)] text-lg">Your Review</h3>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setFormRating(n)}>
                  <Star size={20} className={n <= formRating ? "fill-[var(--color-rose-gold)] text-[var(--color-rose-gold)]" : "text-[var(--color-border)]"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Review Title</label>
            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Summarise your experience" className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Review *</label>
            <textarea rows={4} value={formBody} onChange={(e) => setFormBody(e.target.value)} placeholder="Tell us about the product…" className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] resize-none bg-transparent" />
          </div>
          {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-[var(--color-warm-grey)] text-center py-12">
          Be the first to review this piece.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-[var(--color-border)] pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? "fill-[var(--color-rose-gold)] text-[var(--color-rose-gold)]" : "text-[var(--color-border)]"} />
                  ))}
                </div>
                <span className="text-xs text-[var(--color-warm-grey)]">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                {review.verifiedPurchase && (
                  <span className="text-xs text-[var(--color-plum)] font-medium ml-auto">✓ Verified Purchase</span>
                )}
              </div>
              {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
              <p className="text-sm text-[var(--color-warm-grey)] leading-relaxed">{review.body}</p>
              <p className="text-xs text-[var(--color-charcoal)] font-medium mt-2">
                — {review.guestName ?? review.user?.name ?? "Customer"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
