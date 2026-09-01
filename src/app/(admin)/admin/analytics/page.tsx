import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  try {
    const now = new Date();
    const startOf30Days = new Date(now);
    startOf30Days.setDate(startOf30Days.getDate() - 30);

    const [
      totalRevenue,
      monthlyRevenue,
      totalOrders,
      monthlyOrders,
      avgOrderValue,
      topProducts,
    ] = await Promise.all([
      db.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
      db.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOf30Days } }, _sum: { total: true } }),
      db.order.count({ where: { paymentStatus: "PAID" } }),
      db.order.count({ where: { paymentStatus: "PAID", createdAt: { gte: startOf30Days } } }),
      db.order.aggregate({ where: { paymentStatus: "PAID" }, _avg: { total: true } }),
      db.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, lineTotal: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    return { totalRevenue, monthlyRevenue, totalOrders, monthlyOrders, avgOrderValue, topProducts };
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const data = await getAnalytics();

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Analytics</h1>

      {!data ? (
        <div className="bg-white p-8 shadow-sm text-center">
          <p className="text-[var(--color-warm-grey)] text-sm">Analytics data unavailable. Connect your database to see metrics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: formatPrice(Number(data.totalRevenue._sum.total ?? 0)) },
              { label: "Revenue (30d)", value: formatPrice(Number(data.monthlyRevenue._sum.total ?? 0)) },
              { label: "Total Orders", value: data.totalOrders.toString() },
              { label: "Orders (30d)", value: data.monthlyOrders.toString() },
            ].map((m) => (
              <div key={m.label} className="bg-white p-5 shadow-sm">
                <p className="text-xs text-[var(--color-warm-grey)] uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-xl font-semibold">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="font-medium text-sm mb-4">Top Products by Units Sold</h2>
            <div className="space-y-2">
              {data.topProducts.map((item: any, i: number) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-[var(--color-warm-grey)] text-xs">{i + 1}</span>
                  <div className="flex-1">
                    <div className="h-1.5 bg-[var(--color-plum)] rounded-full" style={{ width: `${Math.min(100, (Number(item._sum.quantity) / (Number(data.topProducts[0]?._sum?.quantity) || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-[var(--color-warm-grey)] text-xs">{item._sum.quantity} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
