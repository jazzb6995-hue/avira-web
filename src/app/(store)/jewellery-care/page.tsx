import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const metadata: Metadata = {
  title: "Jewellery Care | AVIRA",
  description: "How to care for your AVIRA jewellery so it lasts.",
};

const TIPS = [
  { title: "Store separately", body: "Keep each piece in its own pouch or compartment to prevent scratching. The AVIRA box is perfect for this." },
  { title: "Avoid moisture", body: "Remove jewellery before swimming, bathing, or sweating. Water and humidity can dull metal and damage coatings." },
  { title: "Last on, first off", body: "Put your jewellery on after applying perfume, moisturiser, and hairspray. Chemicals in these products can affect the finish." },
  { title: "Clean gently", body: "Wipe with a soft dry cloth after each wear. For deeper cleaning, use a slightly damp cloth and pat dry immediately." },
  { title: "Avoid direct sunlight", body: "Prolonged exposure to sunlight and heat can fade colours and weaken plating over time." },
  { title: "Handle with care", body: "Avoid bending, stretching, or pulling delicate pieces. Always hold rings and pendants from the base, not the decorative elements." },
];

export default function JewelleryCare() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Jewellery Care</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-2">A little care makes a big difference</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TIPS.map((tip) => (
          <div key={tip.title} className="bg-[var(--color-cream)] p-5">
            <h3 className="font-medium text-sm mb-2 text-[var(--color-charcoal)]">{tip.title}</h3>
            <p className="text-sm text-[var(--color-warm-grey)] leading-relaxed">{tip.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-plum)] text-white p-6 mt-10 text-center">
        <p className="font-[var(--font-display)] text-xl mb-2">Quality Guaranteed</p>
        <p className="text-sm text-white/80">Every AVIRA piece is crafted to last. With proper care, your jewellery will remain beautiful for years to come.</p>
      </div>
    </div>
  );
}
