import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { ReviewActions } from "@/components/admin/ReviewActions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();

  let reviews: any[] = [];
  try {
    reviews = await db.review.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
      include: {
        product: { select: { title: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    });
  } catch { /* DB not connected */ }

  const pending = reviews.filter((r: any) => r.status === "PENDING");
  const approved = reviews.filter((r: any) => r.status === "APPROVED");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Reviews</h1>
        {pending.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{pending.length} pending</span>
        )}
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] mb-3">Pending Moderation</h2>
          <div className="space-y-3">
            {pending.map((r: any) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] mb-3">Approved</h2>
        {approved.length === 0 ? (
          <p className="text-sm text-[var(--color-warm-grey)] py-6">No approved reviews yet.</p>
        ) : (
          <div className="space-y-2">
            {approved.map((r: any) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </div>
            <span className="text-xs text-[var(--color-warm-grey)]">{review.user?.name ?? review.user?.email ?? "Anonymous"}</span>
            <span className="text-xs text-[var(--color-warm-grey)]">·</span>
            <span className="text-xs text-[var(--color-warm-grey)]">{format(new Date(review.createdAt), "dd MMM yyyy")}</span>
          </div>
          {review.title && <p className="font-medium text-sm">{review.title}</p>}
          <p className="text-sm text-[var(--color-warm-grey)] mt-1">{review.body}</p>
          <p className="text-xs text-[var(--color-plum)] mt-2">— {review.product?.title}</p>
        </div>
        <ReviewActions reviewId={review.id} status={review.status} />
      </div>
    </div>
  );
}
