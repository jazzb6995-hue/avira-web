import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();

  let customers: any[] = [];
  try {
    customers = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        _count: { select: { orders: true } },
        orders: {
          where: { paymentStatus: "PAID" },
          select: { total: true },
        },
      },
    });
  } catch { /* DB not connected */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Customers</h1>
        <span className="text-sm text-[var(--color-warm-grey)]">{customers.length} registered</span>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Orders</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Total Spent</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Wishlist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[var(--color-warm-grey)] text-sm">No customers yet.</td>
              </tr>
            ) : (
              customers.map((c: any) => {
                const spent = c.orders.reduce((acc: number, o: any) => acc + Number(o.total), 0);
                return (
                  <tr key={c.id} className="hover:bg-[var(--color-ivory)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name ?? "—"}</p>
                      <p className="text-xs text-[var(--color-warm-grey)]">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">
                      {format(new Date(c.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">{c._count.orders}</td>
                    <td className="px-4 py-3 text-xs font-medium hidden md:table-cell">{spent > 0 ? formatPrice(spent) : "—"}</td>
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">{c._count.orders}</td>
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
