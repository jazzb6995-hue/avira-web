import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const metadata: Metadata = { title: "Return Policy | AVIRA" };

export default function NoReturnPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl">Return Policy</h1>
      </div>
      <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-loose">
        <div className="bg-[var(--color-plum)] text-white p-5">
          <p className="font-medium">All sales are final. We do not accept returns or exchanges.</p>
        </div>
        <p>Due to the intimate nature of jewellery and hygiene considerations, all AVIRA purchases are final. We do not accept returns or exchanges once an order has been delivered.</p>
        <section>
          <h2 className="font-medium mb-2">Damaged or Incorrect Items</h2>
          <p>If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photographs via WhatsApp or email. We will assess each case individually and arrange a replacement or store credit where applicable.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Order Cancellation</h2>
          <p>Orders can be cancelled within 2 hours of placement by contacting us on WhatsApp. Once an order is dispatched, it cannot be cancelled.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Contact Us</h2>
          <p>For any order issues, reach us on WhatsApp or at <a href="mailto:hello@avira.in" className="text-[var(--color-plum)] underline">hello@avira.in</a></p>
        </section>
      </div>
    </div>
  );
}
