"use client";

import { useState } from "react";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Package, CheckCircle2, Truck, RotateCcw, Clock } from "lucide-react";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock size={18} />,
  CONFIRMED: <CheckCircle2 size={18} />,
  PROCESSING: <Package size={18} />,
  SHIPPED: <Truck size={18} />,
  DELIVERED: <CheckCircle2 size={18} />,
  CANCELLED: <RotateCcw size={18} />,
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Order not found."); return; }
      setOrder(data);
    } catch {
      setError("Could not fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Track Your Order</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-2">Enter your order number and email to check status</p>
      </div>

      <form onSubmit={search} className="bg-[var(--color-cream)] p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="AV2608XXXXX"
              required
              className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] bg-white transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Order email"
              required
              className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] bg-white transition-colors"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full sm:w-auto">
          Track Order
        </Button>
      </form>

      {order && (
        <div className="space-y-6">
          <div className="bg-[var(--color-cream)] p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)]">Order Number</p>
                <p className="font-semibold text-lg">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)]">Total</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Progress */}
            {order.status !== "CANCELLED" && (
              <div className="mt-6">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-[var(--color-border)]" />
                  <div
                    className="absolute left-0 top-4 h-0.5 bg-[var(--color-plum)] transition-all duration-500"
                    style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                  />
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="relative flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                        i <= currentStep ? "bg-[var(--color-plum)] text-white" : "bg-white border-2 border-[var(--color-border)] text-[var(--color-warm-grey)]"
                      }`}>
                        {STATUS_ICONS[step]}
                      </div>
                      <span className="text-[10px] uppercase tracking-wide text-[var(--color-warm-grey)] text-center hidden sm:block">{step.toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.shipment && (
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-1">Tracking</p>
                <p className="text-sm font-medium">{order.shipment.carrier}</p>
                {order.shipment.trackingNumber && (
                  <p className="text-sm text-[var(--color-plum)]">{order.shipment.trackingNumber}</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-[var(--color-cream)] p-6">
            <h2 className="font-[var(--font-display)] text-lg mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.snapshotTitle} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
