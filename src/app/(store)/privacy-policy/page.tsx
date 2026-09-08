import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const metadata: Metadata = { title: "Privacy Policy | AVIRA" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl">Privacy Policy</h1>
        <p className="text-xs text-[var(--color-warm-grey)] mt-2">Last updated: August 2026</p>
      </div>
      <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-loose">
        <section>
          <h2 className="font-medium mb-2">Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or contacting us, including your name, email address, phone number, and delivery address. We also collect anonymous usage data to improve our website.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">How We Use Your Information</h2>
          <p>Your information is used to process orders, send order updates, provide customer support, and (with your consent) send marketing communications. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Payment Security</h2>
          <p>All payments are processed by Razorpay. We do not store card or UPI details on our servers. All transactions are encrypted with industry-standard SSL.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Cookies</h2>
          <p>We use cookies to maintain your session, remember cart contents, and understand how visitors use our website. You can disable cookies in your browser settings, though some features may not work correctly.</p>
        </section>
        <section>
          <h2 className="font-medium mb-2">Contact</h2>
          <p>For privacy-related queries, email us at <a href="mailto:hello@avira.in" className="text-[var(--color-plum)] underline">hello@avira.in</a></p>
        </section>
      </div>
    </div>
  );
}
