import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Orders | AVIRA" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      where: { userId: session.user.id, paymentStatus: "PAID" },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch { /* db not connected */ }

  return (
    <div>
      <MotifDivider className="mb-5 max-w-xs" />
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="text-[var(--color-warm-grey-light)] mx-auto mb-4" />
          <p className="text-[var(--color-warm-grey)] mb-4">No orders yet</p>
          <Link href="/new-arrivals" className="text-[var(--color-plum)] underline text-sm">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-[var(--color-border)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-[var(--color-warm-grey)]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(Number(order.total))}</p>
                  <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                    order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-500" :
                    "bg-[var(--color-blush)] text-[var(--color-plum)]"
                  }`}>{order.status.toLowerCase()}</span>
                </div>
              </div>
              <div className="text-sm text-[var(--color-warm-grey)]">
                {order.items.map((item: any) => item.snapshotTitle).join(", ")}
              </div>
              <Link href={`/track-order?orderNumber=${order.orderNumber}&email=${encodeURIComponent(session.user!.email!)}`}
                className="text-xs text-[var(--color-plum)] underline mt-2 inline-block">
                Track order
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
