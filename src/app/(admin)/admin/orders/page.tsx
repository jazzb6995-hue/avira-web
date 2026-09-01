import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const statusFilter = sp.status;
  const PAGE_SIZE = 25;

  let orders: any[] = [];
  let total = 0;

  try {
    const where: any = { paymentStatus: "PAID" };
    if (statusFilter) where.status = statusFilter;

    [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      db.order.count({ where }),
    ]);
  } catch { /* db not connected */ }

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Orders</h1>

      <div className="flex gap-1 mb-5 overflow-x-auto">
        <Link href="/admin/orders" className={`px-3 py-1.5 text-xs whitespace-nowrap ${!statusFilter ? "bg-[var(--color-plum)] text-white" : "bg-white text-[var(--color-warm-grey)] hover:bg-[var(--color-cream)]"}`}>
          All
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs whitespace-nowrap ${statusFilter === s ? "bg-[var(--color-plum)] text-white" : "bg-white text-[var(--color-warm-grey)] hover:bg-[var(--color-cream)]"}`}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[var(--color-warm-grey)] border-b border-[var(--color-border)]">
              <th className="text-left px-4 py-3">Order #</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--color-warm-grey)]">No orders found.</td></tr>
            ) : orders.map((o) => {
              const addr = o.shippingAddress as Record<string, string> | null;
              return (
                <tr key={o.id} className="hover:bg-[var(--color-cream)]">
                  <td className="px-4 py-3 font-medium text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)]">
                    {addr?.name ?? o.guestName ?? o.guestEmail ?? "Guest"}
                    {addr?.city ? ` · ${addr.city}` : ""}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)]">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      o.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      o.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                      o.status === "CANCELLED" ? "bg-red-100 text-red-500" :
                      "bg-amber-100 text-amber-700"
                    }`}>{o.status.toLowerCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs text-[var(--color-plum)] underline">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-1 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link key={i} href={`/admin/orders?page=${i + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center text-xs ${i + 1 === page ? "bg-[var(--color-plum)] text-white" : "bg-white text-[var(--color-warm-grey)] hover:bg-[var(--color-cream)]"}`}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
