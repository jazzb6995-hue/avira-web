import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | AVIRA",
  description: "Frequently asked questions about AVIRA jewellery, orders, shipping and returns.",
};

const FAQS = [
  {
    category: "Orders and Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are dispatched within 1 to 2 business days. Standard delivery across India takes 4 to 7 business days. Express options are available at checkout.",
      },
      {
        q: "Is shipping free?",
        a: "Yes! We offer free shipping on all orders above ₹500. A flat shipping fee of ₹49 applies to orders below ₹500.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order from your account page.",
      },
      {
        q: "Do you ship outside India?",
        a: "Currently we ship within India only. International shipping is coming soon.",
      },
    ],
  },
  {
    category: "Products and Quality",
    items: [
      {
        q: "What materials do you use?",
        a: "AVIRA pieces are made with high-quality brass and copper alloys, plated with gold, rose gold, or silver. We use AAA-grade stones and shell pearls for a premium finish.",
      },
      {
        q: "Will the jewellery tarnish?",
        a: "Our pieces are designed to last with proper care. Avoid contact with water, perfume, and sweat. Store in the provided pouch when not wearing. See our Jewellery Care guide for full instructions.",
      },
      {
        q: "Are your pieces safe for sensitive skin?",
        a: "Most of our pieces use nickel-free plating, but individual sensitivity varies. If you have known metal allergies, we recommend patch testing or choosing our sterling silver-based options.",
      },
    ],
  },
  {
    category: "Returns and Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We follow a No Return policy due to the hygiene nature of jewellery. However, we do offer exchanges within 7 days if the product is damaged or defective on arrival.",
      },
      {
        q: "What if I receive a damaged product?",
        a: "Please reach out to us within 48 hours of delivery with photos of the damage. We will arrange a replacement or store credit promptly.",
      },
      {
        q: "How do I request an exchange?",
        a: "Contact us via WhatsApp or email with your order number and a description of the issue. We will guide you through the process.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit and debit cards (Visa, Mastercard, RuPay), net banking, and cash on delivery for select pincodes.",
      },
      {
        q: "Is it safe to pay on your website?",
        a: "Yes. All payments are processed via Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.",
      },
    ],
  },
  {
    category: "Gifting",
    items: [
      {
        q: "Can I add a personalised message?",
        a: "Yes! At checkout you can add a handwritten message card for free. Perfect for birthdays, anniversaries, and everyday celebrations.",
      },
      {
        q: "Is the packaging gift-ready?",
        a: "Every AVIRA order arrives in our signature plum gift box with a velvet pouch and tissue wrap. No extra charge for gift packaging.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl mb-4">FAQ</h1>
        <p className="text-[var(--color-warm-grey)] text-base">Everything you need to know about AVIRA.</p>
      </div>

      <div className="space-y-12">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="font-[var(--font-display)] text-xl text-[var(--color-plum)] mb-5 pb-2 border-b border-[var(--color-border)]">
              {section.category}
            </h2>
            <div className="space-y-5">
              {section.items.map((item) => (
                <div key={item.q} className="bg-white border border-[var(--color-border)] p-6">
                  <p className="font-medium text-[var(--color-charcoal)] mb-2">{item.q}</p>
                  <p className="text-[var(--color-warm-grey)] text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <MotifDivider className="mb-8 max-w-xs mx-auto" />
        <p className="text-[var(--color-warm-grey)] mb-4">Still have questions?</p>
        <Link
          href="/contact"
          className="inline-block bg-[var(--color-plum)] text-white text-xs tracking-widest uppercase px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
