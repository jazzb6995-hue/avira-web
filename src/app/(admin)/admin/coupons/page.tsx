import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { format } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await requireAdmin();

  let coupons: any[] = [];
  try {
    coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        promotion: true,
        _count: { select: { redemptions: true } },
      },
    });
  } catch { /* DB not connected */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Coupons</h1>
        <Link href="/admin/coupons/new" className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-4 py-2 text-sm hover:opacity-90">
          <Plus size={14} /> New Coupon
        </Link>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Code</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Discount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Usage</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Expires</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[var(--color-warm-grey)] text-sm">
                  No coupons yet. <Link href="/admin/coupons/new" className="text-[var(--color-plum)] underline">Create one</Link>
                </td>
              </tr>
            ) : (
              coupons.map((c: any) => {
                const promo = c.promotion;
                const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                const usedUp = promo?.usageLimit && promo.usageCount >= promo.usageLimit;
                const active = c.active && promo?.active && !expired && !usedUp;
                return (
                  <tr key={c.id} className="hover:bg-[var(--color-ivory)]">
                    <td className="px-4 py-3 font-mono font-semibold text-sm">{c.code}</td>
                    <td className="px-4 py-3 text-sm">
                      {promo?.discountType === "PERCENTAGE"
                        ? `${Number(promo.discountValue)}%`
                        : formatPrice(Number(promo?.discountValue ?? 0))}
                      {promo?.minimumSpend && (
                        <span className="text-xs text-[var(--color-warm-grey)] ml-1">(min {formatPrice(Number(promo.minimumSpend))})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">
                      {c._count.redemptions}{promo?.usageLimit ? ` / ${promo.usageLimit}` : ""}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">
                      {c.expiresAt ? format(new Date(c.expiresAt), "dd MMM yyyy") : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {active ? "active" : expired ? "expired" : usedUp ? "used up" : "inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/coupons/${c.id}`} className="text-xs text-[var(--color-plum)] underline">Edit</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
