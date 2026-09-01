import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true,
        shipment: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        user: { select: { email: true, name: true } },
      },
    });
  } catch { notFound(); }

  if (!order) notFound();

  const shippingAddr = order.shippingAddress as Record<string, string> | null;
  const customerEmail = order.guestEmail ?? order.user?.email ?? "—";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-xs text-[var(--color-warm-grey)] hover:text-[var(--color-plum)]">← Orders</Link>
        <span className="text-[var(--color-warm-grey)]">/</span>
        <h1 className="font-[var(--font-display)] text-xl">{order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="font-medium text-sm mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm border-b border-[var(--color-border)] pb-3">
                  <div>
                    <p className="font-medium">{item.snapshotTitle}</p>
                    <p className="text-xs text-[var(--color-warm-grey)]">SKU: {item.snapshotSku} · Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(Number(item.lineTotal))}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-warm-grey)]">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-warm-grey)]">Shipping</span>
                <span>{Number(order.shippingAmount) === 0 ? "Free" : formatPrice(Number(order.shippingAmount))}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="font-medium text-sm mb-4">Update Status</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="font-medium text-sm mb-4">Status History</h2>
            <div className="space-y-2">
              {order.statusHistory.map((h: any) => (
                <div key={h.id} className="flex gap-3 text-xs">
                  <span className="text-[var(--color-warm-grey)] whitespace-nowrap">
                    {new Date(h.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="font-medium capitalize">{h.status.toLowerCase()}</span>
                  {h.note && <span className="text-[var(--color-warm-grey)]">— {h.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="font-medium text-sm mb-3">Customer</h2>
            <p className="text-sm">{customerEmail}</p>
            {order.guestName && <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">{order.guestName}</p>}
          </div>
          {shippingAddr && (
            <div className="bg-white p-5 shadow-sm">
              <h2 className="font-medium text-sm mb-3">Shipping Address</h2>
              <div className="text-sm space-y-0.5 text-[var(--color-warm-grey)]">
                <p className="font-medium text-[var(--color-charcoal)]">{shippingAddr.name}</p>
                <p>{shippingAddr.line1}</p>
                {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
                <p>{shippingAddr.city}, {shippingAddr.state} – {shippingAddr.pincode}</p>
                {shippingAddr.phone && <p>{shippingAddr.phone}</p>}
              </div>
            </div>
          )}
          {order.payment && (
            <div className="bg-white p-5 shadow-sm">
              <h2 className="font-medium text-sm mb-3">Payment</h2>
              <div className="text-xs space-y-1 text-[var(--color-warm-grey)]">
                <p>Status: <span className="capitalize font-medium">{order.payment.status?.toLowerCase()}</span></p>
                <p>ID: {order.payment.gatewayPaymentId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
