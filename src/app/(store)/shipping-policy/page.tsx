import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { SHIPPING } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Shipping Policy | AVIRA" };

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl">Shipping Policy</h1>
      </div>
      <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-loose">
        <div className="bg-[var(--color-cream)] p-5 text-center">
          <p className="font-[var(--font-display)] text-xl mb-1">Free Shipping on Orders Above {formatPrice(SHIPPING.FREE_THRESHOLD)}</p>
          <p className="text-[var(--color-warm-grey)] text-xs">Flat {formatPrice(SHIPPING.FLAT_RATE)} for orders below {formatPrice(SHIPPING.FREE_THRESHOLD)}</p>
        </div>
        <section>
          <h2 className="font-medium mb-2">Delivery Timelines</h2>
          <p>Orders are typically dispatched within 1–2 business days of payment confirmation. Standard delivery across India takes 4–7 business days. Express delivery options are shown at checkout where available.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Tracking</h2>
          <p>Once your order is shipped, you'll receive a tracking number via email. You can also track your order anytime on the <a href="/track-order" className="text-[var(--color-plum)] underline">Track Order</a> page.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Packaging</h2>
          <p>Every AVIRA order is packed with care in our signature gift-ready packaging, perfect to keep or gift. We use minimal, eco-conscious materials wherever possible.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Delivery Areas</h2>
          <p>We currently ship to all major cities and towns across India. Some remote pincodes may require additional delivery time.</p>
        </section>
      </div>
    </div>
  );
}
