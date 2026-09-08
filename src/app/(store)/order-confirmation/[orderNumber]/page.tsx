import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { formatPrice } from "@/lib/utils";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { AviraMotif } from "@/components/ui/AviraMotif";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import type { Metadata } from "next";
import { PurchaseTracker } from "@/components/ui/PurchaseTracker";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = { title: "Order Confirmed | AVIRA" };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;

  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        user: { select: { email: true } },
      },
    });
  } catch {
    notFound();
  }

  if (!order || order.paymentStatus !== "PAID") notFound();

  const shippingAddr = order.shippingAddress as Record<string, string> | null;
  const customerEmail = order.guestEmail ?? order.user?.email ?? "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <PurchaseTracker
        orderNumber={order.orderNumber}
        total={Number(order.total)}
        items={order.items.map((i: any) => ({
          id: i.productId,
          name: i.snapshotTitle ?? i.productId,
          price: Number(i.snapshotPrice),
          qty: i.quantity,
        }))}
      />
      <div className="flex justify-center mb-6">
        <CheckCircle2 size={56} className="text-green-500" strokeWidth={1.5} />
      </div>

      <MotifDivider className="mb-6 max-w-xs mx-auto" />
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl mb-3">Order Confirmed!</h1>
      <p className="text-[var(--color-warm-grey)] text-sm mb-1">Thank you for shopping with AVIRA.</p>
      {customerEmail && (
        <p className="text-sm mb-8">
          A confirmation has been sent to <strong>{customerEmail}</strong>
        </p>
      )}

      <div className="bg-[var(--color-cream)] p-6 text-left mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)]">Order Number</p>
            <p className="font-semibold text-lg">{order.orderNumber}</p>
          </div>
          <AviraMotif size={28} />
        </div>

        <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[var(--color-charcoal)]">
                {item.snapshotTitle} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(Number(item.lineTotal))}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discountAmount))}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-warm-grey)]">Shipping</span>
            <span>{Number(order.shippingAmount) === 0 ? "Free" : formatPrice(Number(order.shippingAmount))}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total Paid</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {shippingAddr && (
        <div className="bg-[var(--color-cream)] p-5 text-left mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-[var(--color-plum)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)]">Shipping To</span>
          </div>
          <p className="text-sm font-medium">{shippingAddr.name}</p>
          <p className="text-sm text-[var(--color-warm-grey)]">
            {shippingAddr.line1}
            {shippingAddr.line2 ? `, ${shippingAddr.line2}` : ""}
          </p>
          <p className="text-sm text-[var(--color-warm-grey)]">
            {shippingAddr.city}, {shippingAddr.state}, {shippingAddr.pincode}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/new-arrivals"
          className="border border-[var(--color-plum)] text-[var(--color-plum)] px-8 py-3 text-xs tracking-widest uppercase hover:bg-[var(--color-blush)] transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/track-order"
          className="bg-[var(--color-plum)] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-[var(--color-plum-light)] transition-colors"
        >
          Track My Order
        </Link>
      </div>
    </div>
  );
}
