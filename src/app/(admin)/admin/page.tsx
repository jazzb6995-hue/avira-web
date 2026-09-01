import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Users, Package, Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [orderCount, revenue, customerCount, productCount, pendingReviews, recentOrders] = await Promise.all([
      db.order.count({ where: { paymentStatus: "PAID" } }),
      db.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
      db.user.count(),
      db.product.count({ where: { status: "PUBLISHED" } }),
      db.review.count({ where: { status: "PENDING" } }),
      db.order.findMany({
        where: { paymentStatus: "PAID" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: { take: 1 } },
      }),
    ]);
    return { orderCount, revenue: Number(revenue._sum.total ?? 0), customerCount, productCount, pendingReviews, recentOrders };
  } catch {
    return { orderCount: 0, revenue: 0, customerCount: 0, productCount: 0, pendingReviews: 0, recentOrders: [] };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Orders", value: stats.orderCount.toString(), icon: <ShoppingCart size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: <ShoppingCart size={20} />, color: "bg-green-50 text-green-600" },
    { label: "Customers", value: stats.customerCount.toString(), icon: <Users size={20} />, color: "bg-purple-50 text-purple-600" },
    { label: "Live Products", value: stats.productCount.toString(), icon: <Package size={20} />, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-charcoal)] mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${c.color}`}>{c.icon}</div>
            <p className="text-2xl font-semibold">{c.value}</p>
            <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-5 shadow-sm">
          <h2 className="font-medium text-sm mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--color-warm-grey)]">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[var(--color-warm-grey)] border-b border-[var(--color-border)]">
                  <th className="text-left pb-2">Order</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {stats.recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-2 font-medium">{o.orderNumber}</td>
                    <td className="py-2 capitalize text-xs text-[var(--color-warm-grey)]">{o.status.toLowerCase()}</td>
                    <td className="py-2 text-right">{formatPrice(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-white p-5 shadow-sm">
          <h2 className="font-medium text-sm mb-4">Attention Required</h2>
          <div className="space-y-3">
            {stats.pendingReviews > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Star size={14} className="text-amber-500" />
                <span>{stats.pendingReviews} review{stats.pendingReviews > 1 ? "s" : ""} pending approval</span>
                <a href="/admin/reviews" className="text-xs text-[var(--color-plum)] underline ml-auto">Review</a>
              </div>
            )}
            {stats.pendingReviews === 0 && (
              <p className="text-sm text-[var(--color-warm-grey)]">Nothing needs attention right now.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
