import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const metadata: Metadata = { title: "Terms & Conditions | AVIRA" };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl">Terms &amp; Conditions</h1>
        <p className="text-xs text-[var(--color-warm-grey)] mt-2">Last updated: August 2026</p>
      </div>
      <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-loose">
        <section>
          <h2 className="font-medium mb-2">Use of Website</h2>
          <p>By accessing avira.in, you agree to these terms. You must be at least 18 years old or accessing with parental consent to make purchases.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Orders &amp; Payment</h2>
          <p>All orders are subject to acceptance and availability. We accept payments via UPI, cards, net banking, and wallets through Razorpay. COD is not available. Prices are in INR and inclusive of applicable taxes.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Product Descriptions</h2>
          <p>We make every effort to display products accurately. Slight colour variations may occur due to screen settings. Product dimensions and weights are approximate.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Intellectual Property</h2>
          <p>All content on this website — including images, text, and design — is the intellectual property of AVIRA and may not be reproduced without written permission.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Limitation of Liability</h2>
          <p>AVIRA's liability is limited to the value of the order placed. We are not responsible for indirect or consequential damages.</p>
        </section>
      </div>
    </div>
  );
}
